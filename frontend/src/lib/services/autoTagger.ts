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
    console.log('🔍 DEBUG: Starting image resize process:', {
      originalSize: file.size,
      originalType: file.type,
      maxWidth,
      maxHeight
    });
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('❌ DEBUG: Failed to get canvas 2D context');
        reject(new Error('Failed to get canvas 2D context'));
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        console.log('🔍 DEBUG: Image loaded for resizing:', {
          originalWidth: img.width,
          originalHeight: img.height
        });
        
        // Calculate new dimensions
        let { width, height } = img;
        const originalWidth = width;
        const originalHeight = height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
          console.log('🔍 DEBUG: Resizing image:', {
            ratio,
            newWidth: width,
            newHeight: height
          });
        } else {
          console.log('🔍 DEBUG: Image within size limits, no resizing needed');
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and convert to blob
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            console.log('✅ DEBUG: Image resize completed:', {
              originalSize: file.size,
              newSize: blob.size,
              compressionRatio: (blob.size / file.size).toFixed(2),
              finalType: blob.type
            });
            resolve(blob);
          } else {
            console.warn('⚠️ DEBUG: Canvas toBlob returned null, using original file');
            resolve(file);
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.onerror = (error) => {
        console.error('❌ DEBUG: Image load error during resize:', error);
        reject(new Error('Failed to load image for resizing'));
      };
      
      try {
        img.src = URL.createObjectURL(file);
      } catch (error) {
        console.error('❌ DEBUG: Failed to create object URL:', error);
        reject(new Error('Failed to create object URL for image'));
      }
    });
  }

  /**
   * Get cached result if available and not expired
   */
  private static getCachedResult(imageUrl: string): AutoTagResult | null {
    console.log('🔍 DEBUG: Checking cache for image URL:', imageUrl);
    
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + btoa(imageUrl);
      console.log('🔍 DEBUG: Generated cache key:', cacheKey);
      
      const cached = localStorage.getItem(cacheKey);
      console.log('🔍 DEBUG: Cache lookup result:', cached ? 'FOUND' : 'NOT_FOUND');
      
      if (cached) {
        const { result, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        const isExpired = age >= this.CACHE_DURATION;
        
        console.log('🔍 DEBUG: Cache entry details:', {
          timestamp: new Date(timestamp).toISOString(),
          age: Math.round(age / 1000) + 's',
          maxAge: Math.round(this.CACHE_DURATION / 1000) + 's',
          isExpired,
          hasResult: !!result
        });
        
        if (!isExpired) {
          console.log('✅ DEBUG: Using cached result');
          return result;
        } else {
          console.log('🔍 DEBUG: Cache expired, removing entry');
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.error('❌ DEBUG: Failed to get cached result:', error);
      console.error('❌ DEBUG: Cache error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        imageUrl: imageUrl.substring(0, 100) + '...'
      });
    }
    
    console.log('🔍 DEBUG: No valid cache entry found');
    return null;
  }

  /**
   * Cache the result
   */
  private static setCachedResult(imageUrl: string, result: AutoTagResult): void {
    console.log('🔍 DEBUG: Caching result for image URL:', imageUrl);
    
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + btoa(imageUrl);
      const cacheData = {
        result,
        timestamp: Date.now()
      };
      
      const serialized = JSON.stringify(cacheData);
      console.log('🔍 DEBUG: Cache data details:', {
        cacheKey,
        dataSize: serialized.length,
        generalTags: result.generalTags.length,
        characterTags: result.characterTags.length,
        rating: result.rating
      });
      
      localStorage.setItem(cacheKey, serialized);
      console.log('✅ DEBUG: Result cached successfully');
      
      // Check localStorage usage
      const stats = this.getCacheStats();
      console.log('🔍 DEBUG: Cache statistics:', stats);
      
    } catch (error) {
      console.error('❌ DEBUG: Failed to cache result:', error);
      console.error('❌ DEBUG: Cache error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        isQuotaExceeded: (error as any)?.name === 'QuotaExceededError'
      });
      
      // If quota exceeded, try to clear old entries
      if ((error as any)?.name === 'QuotaExceededError') {
        console.log('🔍 DEBUG: Attempting to clear old cache entries...');
        this.clearCache();
      }
    }
  }

  /**
   * Sanitize tag names to match backend validation (only alphanumeric, underscore, hyphen)
   */
  private static sanitizeTagName(tagName: string): string {
    console.log('🔍 DEBUG: Sanitizing tag name:', tagName);
    
    if (!tagName || typeof tagName !== 'string') {
      console.warn('⚠️ DEBUG: Invalid tag name input:', tagName);
      return '';
    }
    
    const original = tagName;
    const sanitized = tagName
      .toLowerCase()
      .replace(/\s+/g, '_')           // Replace spaces with underscores
      .replace(/[()]/g, '')           // Remove parentheses
      .replace(/[^a-zA-Z0-9_-]/g, '') // Remove any other invalid characters
      .replace(/_+/g, '_')            // Replace multiple underscores with single
      .replace(/^_|_$/g, '');         // Remove leading/trailing underscores
    
    console.log('🔍 DEBUG: Tag sanitization result:', {
      original,
      sanitized,
      changed: original !== sanitized,
      valid: /^[a-zA-Z0-9_-]+$/.test(sanitized),
      length: sanitized.length
    });
    
    return sanitized;
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
        console.log('🔍 DEBUG: Current environment:', {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          location: window.location.href
        });
        
        // Import the Gradio client dynamically with detailed error handling
        let Client;
        try {
          const gradioModule = await import('@gradio/client') as any;
          Client = gradioModule.Client;
          console.log('🔍 DEBUG: @gradio/client imported successfully');
          console.log('🔍 DEBUG: Client object:', typeof Client, Client);
        } catch (importError) {
          console.error('❌ DEBUG: Failed to import @gradio/client:', importError);
          console.error('❌ DEBUG: Import error details:', {
            name: (importError as any)?.name,
            message: (importError as any)?.message,
            stack: (importError as any)?.stack
          });
          throw new Error(`Failed to import @gradio/client: ${(importError as any)?.message}`);
        }
        
        console.log('🔍 DEBUG: Connecting to Hugging Face space: SmilingWolf/wd-tagger');
        console.log('🔍 DEBUG: Connection attempt started at:', new Date().toISOString());
        
        // Connect to the Hugging Face space with timeout and detailed logging
        let client;
        const connectionTimeout = 30000; // 30 seconds
        
        console.log('🔍 DEBUG: Creating connection promise...');
        const connectionPromise = Client.connect("SmilingWolf/wd-tagger");
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout after 30 seconds')), connectionTimeout)
        );
        
        try {
          console.log('🔍 DEBUG: Racing connection vs timeout...');
          client = await Promise.race([connectionPromise, timeoutPromise]);
          console.log('🔍 DEBUG: Connected to Hugging Face space successfully');
          console.log('🔍 DEBUG: Client connection details:', {
            connected: !!client,
            clientType: typeof client,
            connectionTime: new Date().toISOString(),
            clientMethods: client ? Object.getOwnPropertyNames(client) : []
          });
        } catch (connectionError) {
          console.error('❌ DEBUG: Failed to connect to Hugging Face space:', connectionError);
          console.error('❌ DEBUG: Connection error details:', {
            name: (connectionError as any)?.name,
            message: (connectionError as any)?.message,
            stack: (connectionError as any)?.stack,
            isTimeout: (connectionError as any)?.message?.includes('timeout')
          });
          
          // Check if it's a network issue
          try {
            console.log('🔍 DEBUG: Testing basic network connectivity...');
            const testResponse = await fetch('https://httpbin.org/get', {
              method: 'GET',
              signal: AbortSignal.timeout(5000)
            });
            console.log('🔍 DEBUG: Network test result:', testResponse.ok ? 'SUCCESS' : 'FAILED');
          } catch (networkError) {
            console.error('❌ DEBUG: Network connectivity test failed:', networkError);
          }
          
          throw new Error(`Failed to connect to Hugging Face space: ${(connectionError as any)?.message}`);
        }
        
        console.log('🔍 DEBUG: Making prediction with parameters:', {
          image: `[Blob ${resizedBlob.size} bytes]`,
          model_repo: finalConfig.model_repo,
          general_thresh: finalConfig.general_thresh,
          general_mcut_enabled: finalConfig.general_mcut_enabled,
          character_thresh: finalConfig.character_thresh,
          character_mcut_enabled: finalConfig.character_mcut_enabled,
        });
        
        // Make the prediction using the correct API format with timeout
        let result;
        const predictionTimeout = 60000; // 60 seconds for API call
        const predictionPromise = client.predict("/predict", {
          image: resizedBlob,
          model_repo: finalConfig.model_repo,
          general_thresh: finalConfig.general_thresh,
          general_mcut_enabled: finalConfig.general_mcut_enabled,
          character_thresh: finalConfig.character_thresh,
          character_mcut_enabled: finalConfig.character_mcut_enabled,
        });
        const predictionTimeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('API prediction timeout after 60 seconds')), predictionTimeout)
        );
        
        try {
          console.log('🔍 DEBUG: Starting API prediction call...');
          result = await Promise.race([predictionPromise, predictionTimeoutPromise]);
          console.log('🔍 DEBUG: API prediction completed successfully');
        } catch (predictionError) {
          console.error('❌ DEBUG: API prediction failed:', predictionError);
          console.error('❌ DEBUG: Prediction error details:', {
            name: (predictionError as any)?.name,
            message: (predictionError as any)?.message,
            stack: (predictionError as any)?.stack,
            isTimeout: (predictionError as any)?.message?.includes('timeout')
          });
          throw predictionError;
        }

        console.log('🔍 DEBUG: Raw API response:', result);
        console.log('🔍 DEBUG: API response type:', typeof result);
        console.log('🔍 DEBUG: API response data:', result?.data);
        console.log('🔍 DEBUG: API response data type:', typeof result?.data);
        console.log('🔍 DEBUG: API response data length:', Array.isArray(result?.data) ? result.data.length : 'not array');

        // Validate response structure before parsing
        if (!result || !result.data || !Array.isArray(result.data)) {
          console.error('❌ DEBUG: Invalid API response structure:', {
            hasResult: !!result,
            hasData: !!(result?.data),
            dataType: typeof result?.data,
            isArray: Array.isArray(result?.data)
          });
          throw new Error('Invalid API response structure');
        }

        // Parse the response from the real API
        try {
          console.log('🔍 DEBUG: Starting response parsing...');
          parsedResult = this.parseTagsFromResponse(result);
          console.log('✅ DEBUG: Response parsing completed successfully');
          console.log('✅ DEBUG: Parsed result:', {
            generalTagsCount: parsedResult.generalTags.length,
            characterTagsCount: parsedResult.characterTags.length,
            rating: parsedResult.rating,
            rawOutputLength: parsedResult.rawOutput.length
          });
        } catch (parseError) {
          console.error('❌ DEBUG: Response parsing failed:', parseError);
          console.error('❌ DEBUG: Parse error details:', {
            name: (parseError as any)?.name,
            message: (parseError as any)?.message,
            stack: (parseError as any)?.stack
          });
          throw new Error(`Failed to parse API response: ${(parseError as any)?.message}`);
        }
        
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