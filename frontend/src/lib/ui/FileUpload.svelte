<script lang="ts">
  import { cn, transitions, generateId } from './utils';
  import Button from './Button.svelte';
  import ProgressBar from './ProgressBar.svelte';
  import ErrorMessage from './ErrorMessage.svelte';

  let {
    files = $bindable([]),
    accept = '',
    multiple = false,
    maxSize = undefined,
    maxFiles = undefined,
    disabled = false,
    label = '',
    description = '',
    dragAndDrop = true,
    showPreview = true,
    uploadProgress = {},
    error = '',
    class: className = '',
    id = generateId('file-upload'),
    onFilesChange,
    onFileRemove,
    onUpload,
    ...restProps
  }: {
    files?: File[];
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    maxFiles?: number;
    disabled?: boolean;
    label?: string;
    description?: string;
    dragAndDrop?: boolean;
    showPreview?: boolean;
    uploadProgress?: Record<string, number>;
    error?: string;
    class?: string;
    id?: string;
    onFilesChange?: (files: File[]) => void;
    onFileRemove?: (file: File, index: number) => void;
    onUpload?: (files: File[]) => void;
  } = $props();

  let isDragOver = $state(false);
  let fileInput = $state<HTMLInputElement>();

  const containerClasses = $derived(() => {
    const baseClasses = 'w-full';
    return cn(baseClasses, className);
  });

  const dropzoneClasses = $derived(() => {
    const baseClasses = 'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer';
    const stateClasses = isDragOver 
      ? 'border-purple-400 bg-purple-50' 
      : 'border-gray-300 hover:border-gray-400';
    const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : '';
    
    return cn(baseClasses, stateClasses, disabledClasses, transitions.colors);
  });

  const canAddMoreFiles = $derived(() => {
    return !maxFiles || files.length < maxFiles;
  });

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function validateFile(file: File): string | null {
    if (maxSize && file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });
      
      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }
    
    return null;
  }

  function addFiles(newFiles: FileList | File[]) {
    if (disabled || !canAddMoreFiles) return;
    
    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];
    let errorMessage = '';
    
    for (const file of fileArray) {
      const validation = validateFile(file);
      if (validation) {
        errorMessage = validation;
        break;
      }
      
      if (!multiple && validFiles.length >= 1) break;
      if (maxFiles && files.length + validFiles.length >= maxFiles) break;
      
      validFiles.push(file);
    }
    
    if (errorMessage) {
      error = errorMessage;
      return;
    }
    
    error = '';
    files = multiple ? [...files, ...validFiles] : validFiles;
    onFilesChange?.(files);
  }

  function removeFile(index: number) {
    const removedFile = files[index];
    files = files.filter((_, i) => i !== index);
    onFileRemove?.(removedFile, index);
    onFilesChange?.(files);
  }

  function handleFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      addFiles(target.files);
    }
  }

  function handleDragOver(event: DragEvent) {
    if (!dragAndDrop || disabled) return;
    event.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    if (!dragAndDrop || disabled) return;
    event.preventDefault();
    isDragOver = false;
  }

  function handleDrop(event: DragEvent) {
    if (!dragAndDrop || disabled) return;
    event.preventDefault();
    isDragOver = false;
    
    if (event.dataTransfer?.files) {
      addFiles(event.dataTransfer.files);
    }
  }

  function openFileDialog() {
    if (!disabled) {
      fileInput?.click();
    }
  }

  function handleUpload() {
    if (files.length > 0) {
      onUpload?.(files);
    }
  }
</script>

<div class={containerClasses} {...restProps}>
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
  {/if}
  
  <div
    class={dropzoneClasses}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={openFileDialog}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
    role="button"
    tabindex="0"
    aria-label="Upload files"
  >
    <input
      bind:this={fileInput}
      type="file"
      {id}
      {accept}
      {multiple}
      {disabled}
      class="hidden"
      onchange={handleFileInputChange}
    />
    
    <div class="space-y-2">
      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      
      <div>
        <p class="text-sm text-gray-600">
          {#if dragAndDrop}
            Drop files here or <span class="text-purple-600 font-medium">browse</span>
          {:else}
            <span class="text-purple-600 font-medium">Choose files</span>
          {/if}
        </p>
        
        {#if description}
          <p class="text-xs text-gray-500 mt-1">{description}</p>
        {/if}
        
        {#if accept || maxSize}
          <p class="text-xs text-gray-500 mt-1">
            {#if accept}Accepted: {accept}{/if}
            {#if maxSize}{accept ? ', ' : ''}Max size: {formatFileSize(maxSize)}{/if}
          </p>
        {/if}
      </div>
    </div>
  </div>
  
  {#if error}
    <div class="mt-2">
      <ErrorMessage message={error} />
    </div>
  {/if}
  
  {#if files.length > 0 && showPreview}
    <div class="mt-4 space-y-2">
      <h4 class="text-sm font-medium text-gray-700">Selected Files</h4>
      
      {#each files as file, index}
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p class="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            
            {#if uploadProgress[file.name] !== undefined}
              <div class="mt-1">
                <ProgressBar 
                  value={uploadProgress[file.name]} 
                  size="sm"
                  showLabel={false}
                />
              </div>
            {/if}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onclick={() => removeFile(index)}
            disabled={disabled}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      {/each}
      
      {#if onUpload}
        <div class="flex justify-end mt-4">
          <Button
            onclick={handleUpload}
            disabled={disabled || files.length === 0}
          >
            Upload {files.length} file{files.length !== 1 ? 's' : ''}
          </Button>
        </div>
      {/if}
    </div>
  {/if}
  
  {#if maxFiles}
    <p class="mt-2 text-xs text-gray-500">
      {files.length}/{maxFiles} files selected
    </p>
  {/if}
</div>