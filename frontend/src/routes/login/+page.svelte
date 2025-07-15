<script>
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { tokens } from '$lib/design-system/tokens';

	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	onMount(() => {
		// Redirect if already logged in
		if ($authStore.isAuthenticated) {
			goto('/');
		}
	});

	async function handleLogin() {
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;
		error = '';

		try {
			await authStore.login(email, password);
			goto('/');
		} catch (err) {
			error = err.message || 'Login failed. Please check your credentials.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In - CustomBooru</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
	<!-- Background Elements -->
	<div class="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50"></div>
	<div class="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

	<div class="relative max-w-md w-full space-y-8">
		<!-- Header -->
		<div class="text-center">
			<div class="flex justify-center mb-6">
				<div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
			<p class="text-gray-600">Sign in to your CustomBooru account</p>
		</div>

		<!-- Login Form -->
		<div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
			<form on:submit|preventDefault={handleLogin} class="space-y-6">
				<!-- Email Field -->
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
						Email address
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
							</svg>
						</div>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent {tokens.colors.glass.white} {tokens.colors.glass.backdrop} text-gray-900 placeholder-gray-500 transition-all duration-200 shadow-sm hover:shadow"
							placeholder="Enter your email"
						/>
					</div>
				</div>

				<!-- Password Field -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						Password
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<input
							id="password"
							type="password"
							bind:value={password}
							required
							class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent {tokens.colors.glass.white} {tokens.colors.glass.backdrop} text-gray-900 placeholder-gray-500 transition-all duration-200 shadow-sm hover:shadow"
							placeholder="Enter your password"
						/>
					</div>
				</div>

				<!-- Error Message -->
				{#if error}
					<div class="bg-red-50 border border-red-200 rounded-xl p-4">
						<div class="flex items-center">
							<svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span class="text-red-800 text-sm">{error}</span>
						</div>
					</div>
				{/if}

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={loading}
					class="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white {tokens.colors.brand.gradient.primary} {tokens.colors.brand.gradient.primaryHover} {tokens.focusRing.default} disabled:opacity-50 disabled:cursor-not-allowed {tokens.transitions.default} {tokens.animations.scaleOnHover}"
				>
					{#if loading}
						<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Signing in...
					{:else}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
						</svg>
						Sign in
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-2 bg-white text-gray-500">New to CustomBooru?</span>
				</div>
			</div>

			<!-- Register Link -->
			<div class="text-center">
				<a href="/register" class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors">
					Create an account
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</div>