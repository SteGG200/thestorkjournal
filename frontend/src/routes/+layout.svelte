<script>
	const { children } = $props()
</script>

<svelte:head>
	<title>Page Title</title>
  <meta name="description" content="Page Description" />
</svelte:head>

{@render children()}