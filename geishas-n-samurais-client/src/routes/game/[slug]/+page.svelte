<script lang="ts">
	import { onMount } from 'svelte';
	import type { PresentCard } from '../../../models';
	import { socketService } from '@lib/socket-service';
	import { goto } from '$app/navigation';
	import { playerManager } from '@lib/player-service';

	let hand: PresentCard[] | null = [];

	onMount(() => {
		socketService.roomId.subscribe((roomIdValue) => {
			if (!roomIdValue) {
				goto('/', { replaceState: true });
			}
		});

		playerManager.hand.subscribe((res) => {
			hand = res;
		});
	});

	$: jsonHand = JSON.stringify(hand);
</script>

<div>
	{jsonHand}
</div>

<style>
</style>
