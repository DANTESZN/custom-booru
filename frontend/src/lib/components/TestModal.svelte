<script lang="ts">
  import {
    Modal,
    Button,
    Input,
    Textarea,
    Select,
    TagInput,
    FileUpload,
    ProgressBar,
    ErrorMessage,
    Card
  } from '$lib/ui';

  // Props
  let { isOpen = false, onClose }: { isOpen?: boolean; onClose: () => void } = $props();
</script>

<Modal
  {isOpen}
  onClose={onClose}
  title="Test Modal"
  size="xl"
  closable={true}
>
  {#snippet children()}
    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-6">
        <!-- Description -->
        <p class="text-sm text-gray-600 mb-6">
          This is a test modal using the UI components.
        </p>

        <!-- Sample Form -->
        <Card class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Sample Form</h3>
          
          <div class="space-y-4">
            <Input
              placeholder="Enter some text..."
              label="Text Input"
            />

            <Textarea
              placeholder="Enter a description..."
              label="Description"
              rows={3}
            />

            <Select
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' }
              ]}
              placeholder="Select an option"
              label="Select Dropdown"
            />

            <TagInput
              label="Tags"
              placeholder="Add some tags..."
            />
          </div>
        </Card>

        <!-- File Upload -->
        <Card class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">File Upload</h3>
          
          <FileUpload
            accept="image/*"
            multiple={true}
            maxSize={10 * 1024 * 1024}
            label="Select Files"
            description="PNG, JPG, GIF up to 10MB each"
          />
        </Card>

        <!-- Progress Bar -->
        <Card class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Progress</h3>
          
          <ProgressBar
            value={75}
            label="75% complete"
          />
        </Card>

        <!-- Error Message -->
        <ErrorMessage 
          message="This is a sample error message" 
        />
      </div>
    </div>

    <!-- Fixed Footer -->
    <div class="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-end space-x-3">
        <Button
          variant="secondary"
          onclick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
        >
          Save Changes
        </Button>
      </div>
    </div>
  {/snippet}
</Modal>