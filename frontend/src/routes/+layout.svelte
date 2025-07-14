<script>
	import '../app.css';
	import { authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	
	let { children } = $props();
	
	// Use stores for reactivity (Svelte 5 + runes compatibility)
	const dropdownStore = writable(false);
	const logoutNotificationStore = writable(false);

	onMount(() => {
		// Initialize auth store
		authStore.init();
		
		// Listen for auth logout events
		if (typeof window !== 'undefined') {
			window.addEventListener('auth-logout', () => {
				logoutNotificationStore.set(true);
				// Hide notification after 5 seconds
				setTimeout(() => {
					logoutNotificationStore.set(false);
				}, 5000);
			});
			
			// Check token validity when page regains focus
			window.addEventListener('focus', async () => {
				if ($authStore.isAuthenticated) {
					const isValid = await authStore.checkToken();
					if (!isValid) {
						// Token is invalid, user will be logged out via auth-logout event
						console.log('Token check failed on page focus');
					}
				}
			});
		}
	});

	function toggleDropdown() {
		dropdownStore.update(n => !n);
	}

	function closeDropdown() {
		dropdownStore.set(false);
	}

	async function handleLogout() {
		await authStore.logout();
		closeDropdown();
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			closeDropdown();
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
	<!-- Token Expiration Notification -->
	{#if $logoutNotificationStore}
		<div class="fixed top-4 right-4 z-50 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
			</svg>
			<span class="font-medium">Session expired. Please log in again.</span>
			<button 
				on:click={() => logoutNotificationStore.set(false)}
				class="ml-2 text-orange-200 hover:text-white"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	{/if}
	<!-- Modern Navigation -->
	<nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 overflow-visible">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
			<div class="flex justify-between items-center h-16 overflow-visible">
				<!-- Logo/Brand -->
				<div class="flex items-center space-x-2">
					<div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
					<a href="/" class="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
						CustomBooru
					</a>
				</div>

				<!-- Navigation Links -->
				<div class="hidden md:flex items-center space-x-1">
					<a href="/" class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
						</svg>
						Home
					</a>
					<a href="/aliases" class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						Artists
					</a>
					<a href="/images" class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						Gallery
					</a>
					<a href="/tags" class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
						</svg>
						Tags
					</a>
					<a href="/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						Search
					</a>
				</div>

				<!-- Auth Section -->
				<div class="flex items-center space-x-3">
					{#if $authStore.isAuthenticated && $authStore.user}
						<!-- User Profile Dropdown -->
						<div class="relative dropdown-container">
							<button
								on:click={toggleDropdown}
								class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
							>
								<!-- Avatar -->
								<div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
									{$authStore.user.email.charAt(0).toUpperCase()}
								</div>
								<span class="hidden sm:block">{$authStore.user.email}</span>
								<svg class="w-4 h-4 transition-transform duration-200" class:rotate-180={$dropdownStore} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>

							<!-- Dropdown Menu -->
							{#if $dropdownStore}
								<div class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
									<!-- User Info -->
									<div class="px-4 py-3 border-b border-gray-200">
										<div class="flex items-center space-x-3">
											<div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
												{$authStore.user.email.charAt(0).toUpperCase()}
											</div>
											<div>
												<p class="text-sm font-medium text-gray-900">{$authStore.user.email}</p>
												<p class="text-xs text-gray-500">Signed in</p>
											</div>
										</div>
									</div>

									<!-- Menu Items -->
									<div class="py-1">
										<a href="/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
											<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
											Profile Settings
										</a>
										<a href="/dashboard" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
											<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
											</svg>
											Dashboard
										</a>
										<div class="border-t border-gray-200 my-1"></div>
										<button on:click={handleLogout} class="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors text-left">
											<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
											</svg>
											Sign Out
										</button>
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<!-- Login/Register Links -->
						<a href="/login" class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
							Sign In
						</a>
						<a href="/register" class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
							Get Started
						</a>
					{/if}
				</div>
			</div>
		</div>

		<!-- Mobile Navigation -->
		<div class="md:hidden px-4 pb-3 space-y-1">
			<a href="/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">Home</a>
			<a href="/aliases" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">Artists</a>
			<a href="/images" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">Gallery</a>
			<a href="/tags" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">Tags</a>
			<a href="/search" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">Search</a>
		</div>
	</nav>
	
	
	<!-- Main Content -->
	<main class="relative">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="bg-white/80 backdrop-blur-md border-t border-gray-200/50 mt-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="text-center text-sm text-gray-600">
				<p>&copy; 2025 CustomBooru. Built with ❤️ using SvelteKit & Rails.</p>
			</div>
		</div>
	</footer>
</div>