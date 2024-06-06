<script lang="ts">
	import { goto } from '$app/navigation';
	import { socketService } from '@lib/socket-service';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let roomId = '';

	onMount(() => {
		socketService.roomId.subscribe((roomIdValue) => {
			if (!roomIdValue) {
				goto('/', { replaceState: true });
			} else {
				roomId = roomIdValue;
			}
		});

		socketService.allPlayersReadyEmitter.subscribe((isReady) => {
			if (isReady) {
				goto(`game/${roomId}`);
			}
		});
	});

	$: inviteLink = `${$page.url.origin}/join/${roomId}`;
</script>

<div>
	<div>Please wait for other players connection</div>
	<div>Invite second player with link <a href={inviteLink}>{inviteLink}</a></div>
</div>
