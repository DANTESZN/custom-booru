<script lang="ts">
  import { cn, transitions, generateId } from './utils';
  import Badge from './Badge.svelte';
  import Input from './Input.svelte';

  let {
    tags = $bindable([]),
    placeholder = 'Add tags...',
    label = '',
    error = '',
    required = false,
    disabled = false,
    maxTags = undefined,
    allowDuplicates = false,
    separator = ',',
    size = 'md',
    class: className = '',
    id = generateId('tag-input'),
    onTagAdd,
    onTagRemove,
    onTagsChange,
    ...restProps
  }: {
    tags?: string[];
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    maxTags?: number;
    allowDuplicates?: boolean;
    separator?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    class?: string;
    id?: string;
    onTagAdd?: (tag: string) => void;
    onTagRemove?: (tag: string, index: number) => void;
    onTagsChange?: (tags: string[]) => void;
  } = $props();

  let inputValue = $state('');
  let inputElement = $state<HTMLInputElement>();

  const containerClasses = $derived(() => {
    const baseClasses = 'w-full';
    return cn(baseClasses, className);
  });

  const tagsContainerClasses = $derived(() => {
    const baseClasses = 'flex flex-wrap gap-1 mb-2';
    return cn(baseClasses);
  });

  const canAddMoreTags = $derived(() => {
    return !maxTags || tags.length < maxTags;
  });

  function addTag(tag: string) {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    
    if (!allowDuplicates && tags.includes(trimmedTag)) return;
    if (!canAddMoreTags) return;
    
    tags = [...tags, trimmedTag];
    inputValue = '';
    
    onTagAdd?.(trimmedTag);
    onTagsChange?.(tags);
  }

  function removeTag(index: number) {
    const removedTag = tags[index];
    tags = tags.filter((_, i) => i !== index);
    
    onTagRemove?.(removedTag, index);
    onTagsChange?.(tags);
  }

  function handleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === separator) {
      event.preventDefault();
      addTag(inputValue);
    } else if (event.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  function handleInputBlur() {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const newTags = pastedText
      .split(separator)
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    newTags.forEach(tag => addTag(tag));
  }

  function focusInput() {
    inputElement?.focus();
  }
</script>

<div class={containerClasses} {...restProps}>
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {#if required}
        <span class="text-red-500 ml-1">*</span>
      {/if}
    </label>
  {/if}
  
  <div
    class="min-h-[2.5rem] p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 {transitions.colors}"
    onclick={focusInput}
    onkeydown={(e) => e.key === 'Enter' && focusInput()}
    role="textbox"
    tabindex="0"
  >
    {#if tags.length > 0}
      <div class={tagsContainerClasses}>
        {#each tags as tag, index}
          <Badge
            variant="secondary"
            {size}
            removable={!disabled}
            onRemove={() => removeTag(index)}
          >
            {tag}
          </Badge>
        {/each}
      </div>
    {/if}
    
    {#if canAddMoreTags}
      <Input
        bind:this={inputElement}
        bind:value={inputValue}
        {placeholder}
        {disabled}
        {size}
        class="border-none shadow-none focus:ring-0 focus:border-transparent p-0 bg-transparent"
        onkeydown={handleInputKeydown}
        onblur={handleInputBlur}
        onpaste={handlePaste}
      />
    {/if}
  </div>
  
  {#if error}
    <p class="mt-1 text-sm text-red-600" id="{id}-error">
      {error}
    </p>
  {/if}
  
  {#if maxTags}
    <p class="mt-1 text-xs text-gray-500">
      {tags.length}/{maxTags} tags
    </p>
  {/if}
</div>