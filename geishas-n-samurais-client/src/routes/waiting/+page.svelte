<script lang="ts">
	import { goto } from '$app/navigation';
	import { socketService } from '@lib/socket-service';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Button from '@components/Button.svelte';

	let roomId = '';

	onMount(() => {
		socketService.subscribeOnGameStart().then(() => goto(`game/${roomId}`));

		socketService.roomId.subscribe((roomIdValue) => {
			if (!roomIdValue) {
				goto('/', { replaceState: true });
			} else {
				roomId = roomIdValue;
			}
		});
	});

	$: inviteLink = `${$page.url.origin}/join/${roomId}`;

	function copyInviteLink() {
		navigator.clipboard.writeText('This is the text to be copied').then(
			() => {
				console.log('Content copied to clipboard');
				navigator.clipboard.writeText(inviteLink);
			},
			() => {
				console.error('Failed to copy');
			}
		);
	}
</script>

<div class="waiting-page">
	<div class="common-message">Please wait for other players connection:</div>

	<div class="invite">
		<div class="invite-link">{inviteLink}</div>
		<Button title="Copy" onClick={copyInviteLink} />
	</div>
</div>

<style>
	.waiting-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		margin-top: 30vh;
		font-size: 18px;
	}

	.common-message {
		margin-bottom: 30px;
	}

	.invite {
		background-color: rgb(58, 56, 56);
		padding: 6px 12px;
		border-radius: 12px;
		display: flex;
		padding-right: 4px;
		align-items: center;
	}

	.invite-link {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		margin-right: 10px;
		color: white;
	}
</style>
