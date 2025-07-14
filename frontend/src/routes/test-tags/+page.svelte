<script lang="ts">
  import { onMount } from 'svelte';

  let message = 'Loading...';
  let data = null;

  onMount(async () => {
    console.log('Test page mounted');
    message = 'Testing API call...';
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/tags');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        data = result;
        message = 'API call successful!';
      } else {
        message = `API error: ${response.status}`;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message = `Fetch error: ${error.message}`;
    }
  });
</script>

<svelte:head>
  <title>Test Tags - CustomBooru</title>
</svelte:head>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    <h1 class="text-3xl font-bold text-gray-900 mb-4">Test Tags Page</h1>
    
    <div class="bg-white shadow rounded-lg p-6">
      <p class="text-lg mb-4">{message}</p>
      
      {#if data}
        <div class="bg-green-50 border border-green-200 rounded-md p-4">
          <h2 class="text-lg font-medium text-green-800 mb-2">Raw API Data:</h2>
          <pre class="text-sm text-green-700 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      {/if}
    </div>
  </div>
</div>