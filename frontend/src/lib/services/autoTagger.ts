import type { JsonApiResource, Image } from '$lib/types';

export interface AutoTagResult {
  generalTags: Array<{
    name: string;
    confidence: number;
  }>;
  characterTags: Array<{
    name: string;
    confidence: number;
  }>;
  rating: string;
  rawOutput: string;
}

export interface AutoTagConfig {
  model_repo: string;
  general_thresh: number;
  general_mcut_enabled: boolean;
  character_thresh: number;
  character_mcut_enabled: boolean;
}

export class AutoTaggerService {
  private static readonly DEFAULT_CONFIG: AutoTagConfig = {
    model_repo: "SmilingWolf/wd-vit-tagger-v3",
    general_thresh: 0.35,
    general_mcut_enabled: false,
    character_thresh: 0.85,
    character_mcut_enabled: false
  };

  private static readonly CACHE_KEY_PREFIX = 'autotag_cache_';
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Resize image to optimize for API processing
   */
  private static async resizeImage(file: Blob, maxWidth: number = 2048, maxHeight: number = 2048): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and convert to blob
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(blob || file);
        }, 'image/jpeg', 0.9);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get cached result if available and not expired
   */
  private static getCachedResult(imageUrl: string): AutoTagResult | null {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + btoa(imageUrl);
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const { result, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.CACHE_DURATION) {
          return result;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.warn('Failed to get cached result:', error);
    }
    
    return null;
  }

  /**
   * Cache the result
   */
  private static setCachedResult(imageUrl: string, result: AutoTagResult): void {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + btoa(imageUrl);
      const cacheData = {
        result,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache result:', error);
    }
  }

  /**
   * Sanitize tag names to match backend validation (only alphanumeric, underscore, hyphen)
   */
  private static sanitizeTagName(tagName: string): string {
    return tagName
      .toLowerCase()
      .replace(/\s+/g, '_')           // Replace spaces with underscores
      .replace(/[()]/g, '')           // Remove parentheses
      .replace(/[^a-zA-Z0-9_-]/g, '') // Remove any other invalid characters
      .replace(/_+/g, '_')            // Replace multiple underscores with single
      .replace(/^_|_$/g, '');         // Remove leading/trailing underscores
  }

  /**
   * Parse the API response into structured tags
   */
  private static parseTagsFromResponse(response: any): AutoTagResult {
    console.log('🔍 DEBUG: parseTagsFromResponse - Raw response:', response);
    console.log('🔍 DEBUG: parseTagsFromResponse - Response.data:', response.data);
    console.log('🔍 DEBUG: parseTagsFromResponse - Response.data type:', typeof response.data);
    console.log('🔍 DEBUG: parseTagsFromResponse - Response.data length:', response.data?.length);
    
    const [generalTagsString, rating, characterTagsString, allTagsString] = response.data;
    
    console.log('🔍 DEBUG: parseTagsFromResponse - Extracted values:');
    console.log('  - generalTagsString:', generalTagsString);
    console.log('  - rating:', rating);
    console.log('  - characterTagsString:', characterTagsString);
    console.log('  - allTagsString:', allTagsString);
    
    const parseTagString = (tagString: string | any, threshold: number): Array<{name: string, confidence: number}> => {
      // Handle string format (comma-separated tags)
      if (typeof tagString === 'string') {
        if (!tagString) return [];
        
        return tagString
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .map(tag => {
            // Extract confidence if present (format: "tag:confidence")
            const parts = tag.split(':');
            const rawName = parts[0].trim();
            const confidence = parts.length > 1 ? parseFloat(parts[1]) : 0.5;
            
            return {
              name: this.sanitizeTagName(rawName),
              confidence
            };
          })
          .filter(tag => tag.name.length > 0 && tag.confidence >= threshold)
          .sort((a, b) => b.confidence - a.confidence);
      }
      
      // Handle object format with confidences array
      if (tagString && typeof tagString === 'object' && tagString.confidences) {
        return tagString.confidences
          .map((item: any) => ({
            name: this.sanitizeTagName(item.label || item.name || ''),
            confidence: item.confidence || 0.5
          }))
          .filter((tag: any) => tag.name.length > 0 && tag.confidence >= threshold)
          .sort((a: any, b: any) => b.confidence - a.confidence);
      }
      
      return [];
    };

    // Extract rating value
    const ratingValue = typeof rating === 'object' && rating.label ? rating.label : (rating || 'unknown');
    
    // Extract character tags - handle both string and object formats
    let characterTags: Array<{name: string, confidence: number}> = [];
    if (typeof characterTagsString === 'object' && characterTagsString.label) {
      // Single character tag in object format
      const sanitizedName = this.sanitizeTagName(characterTagsString.label);
      if (sanitizedName.length > 0) {
        characterTags = [{
          name: sanitizedName,
          confidence: characterTagsString.confidences?.[0]?.confidence || 0.9
        }].filter(tag => tag.confidence >= this.DEFAULT_CONFIG.character_thresh);
      }
    } else {
      characterTags = parseTagString(characterTagsString, this.DEFAULT_CONFIG.character_thresh);
    }

    return {
      generalTags: parseTagString(generalTagsString, this.DEFAULT_CONFIG.general_thresh),
      characterTags: characterTags,
      rating: ratingValue,
      rawOutput: typeof allTagsString === 'string' ? allTagsString : JSON.stringify(allTagsString)
    };
  }

  /**
   * Fetch image as blob from URL
   */
  private static async fetchImageBlob(imageUrl: string): Promise<Blob> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return response.blob();
  }

  /**
   * Auto-tag a single image
   */
  static async autoTagImage(
    image: JsonApiResource<Image>,
    config: Partial<AutoTagConfig> = {}
  ): Promise<AutoTagResult> {
    console.log('🔍 DEBUG: AutoTaggerService.autoTagImage called');
    console.log('🔍 DEBUG: Image parameter:', image);
    console.log('🔍 DEBUG: Config parameter:', config);
    
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    console.log('🔍 DEBUG: Final config:', finalConfig);
    
    if (!image.attributes.file_url) {
      console.log('❌ DEBUG: No file URL found');
      throw new Error('Image does not have a file URL');
    }
    
    console.log('🔍 DEBUG: Image file URL:', image.attributes.file_url);

    // Check cache first
    console.log('🔍 DEBUG: Checking cache for:', image.attributes.file_url);
    const cached = this.getCachedResult(image.attributes.file_url);
    if (cached) {
      console.log('🔍 DEBUG: Found cached result:', cached);
      return cached;
    }
    console.log('🔍 DEBUG: No cached result found, proceeding with API call');

    try {
      // Fetch and resize image
      const imageBlob = await this.fetchImageBlob(image.attributes.file_url);
      const resizedBlob = await this.resizeImage(imageBlob);

      // Use the real Gradio API with proper error handling
      let parsedResult: AutoTagResult;
      
      console.log('🔍 DEBUG: Starting Gradio API call...');
      console.log('🔍 DEBUG: Image URL:', image.attributes.file_url);
      console.log('🔍 DEBUG: Config:', finalConfig);
      console.log('🔍 DEBUG: Resized blob size:', resizedBlob.size, 'bytes');
      console.log('🔍 DEBUG: Resized blob type:', resizedBlob.type);
      
      try {
        console.log('🔍 DEBUG: Importing @gradio/client...');
        // Import the Gradio client dynamically
        const { Client } = await import('@gradio/client') as any;
        console.log('🔍 DEBUG: @gradio/client imported successfully');
        
        console.log('🔍 DEBUG: Connecting to Hugging Face space: SmilingWolf/wd-tagger');
        // Connect to the Hugging Face space
        const client = await Client.connect("SmilingWolf/wd-tagger");
        console.log('🔍 DEBUG: Connected to Hugging Face space successfully');
        
        console.log('🔍 DEBUG: Making prediction with parameters:', {
          image: `[Blob ${resizedBlob.size} bytes]`,
          model_repo: finalConfig.model_repo,
          general_thresh: finalConfig.general_thresh,
          general_mcut_enabled: finalConfig.general_mcut_enabled,
          character_thresh: finalConfig.character_thresh,
          character_mcut_enabled: finalConfig.character_mcut_enabled,
        });
        
        // Make the prediction using the correct API format
        const result = await client.predict("/predict", {
          image: resizedBlob,
          model_repo: finalConfig.model_repo,
          general_thresh: finalConfig.general_thresh,
          general_mcut_enabled: finalConfig.general_mcut_enabled,
          character_thresh: finalConfig.character_thresh,
          character_mcut_enabled: finalConfig.character_mcut_enabled,
        });

        console.log('🔍 DEBUG: Raw API response:', result);
        console.log('🔍 DEBUG: API response type:', typeof result);
        console.log('🔍 DEBUG: API response data:', result?.data);

        // Parse the response from the real API
        parsedResult = this.parseTagsFromResponse(result);
        
        console.log('✅ DEBUG: Successfully got tags from Hugging Face API:', parsedResult);
      } catch (gradioError) {
        console.error('❌ DEBUG: Gradio API failed with error:', gradioError);
        console.error('❌ DEBUG: Error type:', typeof gradioError);
        console.error('❌ DEBUG: Error name:', (gradioError as any)?.name);
        console.error('❌ DEBUG: Error message:', (gradioError as any)?.message);
        console.error('❌ DEBUG: Error stack:', (gradioError as any)?.stack);
        
        // Don't fall back to mock data - throw the actual error
        throw new Error(`Gradio API failed: ${(gradioError as any)?.message || gradioError}`);
      }
      
      // Cache the result
      this.setCachedResult(image.attributes.file_url, parsedResult);
      
      return parsedResult;
    } catch (error) {
      console.error('Auto-tagging failed:', error);
      throw new Error(`Auto-tagging failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Auto-tag multiple images (for batch processing)
   */
  static async autoTagImages(
    images: JsonApiResource<Image>[],
    config: Partial<AutoTagConfig> = {},
    onProgress?: (completed: number, total: number) => void
  ): Promise<Array<{ image: JsonApiResource<Image>; result: AutoTagResult | null; error?: string }>> {
    const results: Array<{ image: JsonApiResource<Image>; result: AutoTagResult | null; error?: string }> = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      
      try {
        const result = await this.autoTagImage(image, config);
        results.push({ image, result });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({ image, result: null, error: errorMessage });
      }
      
      // Report progress
      if (onProgress) {
        onProgress(i + 1, images.length);
      }
      
      // Add small delay to avoid overwhelming the API
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  /**
   * Clear all cached results
   */
  static clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { count: number; totalSize: number } {
    let count = 0;
    let totalSize = 0;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY_PREFIX)) {
          count++;
          totalSize += localStorage.getItem(key)?.length || 0;
        }
      });
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
    }
    
    return { count, totalSize };
  }

}