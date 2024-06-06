<script lang="ts">
	import { onMount } from 'svelte';
	import type { PresentCard } from '../../../models';
	import { playerService } from '@lib/player-service';
	import { socketService } from '@lib/socket-service';
	import { goto } from '$app/navigation';

	let hand: PresentCard[] | null = [];

	onMount(() => {
		socketService.roomId.subscribe((roomIdValue) => {
			if (!roomIdValue) {
				goto('/', { replaceState: true });
			}
		});

		playerService.hand.subscribe((res) => {
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
