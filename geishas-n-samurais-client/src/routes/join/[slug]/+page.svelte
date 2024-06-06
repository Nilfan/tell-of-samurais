<script lang="ts">
	import { onMount } from 'svelte';
	import { socketService } from '@lib/socket-service';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	onMount(() => {
		socketService.allPlayersReadyEmitter.subscribe((isReady) => {
			if (isReady) {
				goto(`/game/${$page.params.slug}`);
			}
		});

		socketService.joinGame($page.params.slug);
	});
</script>

<div>Please wait joining game</div>

<style>
</style>
