<script lang="ts">
	import Button from '@components/Button.svelte';
	import { socketService } from '@lib/socket-service';
	import { goto } from '$app/navigation';

	function onCreateRoom() {
		socketService.createRoom().then(() => {
			try {
				goto(`waiting`);
			} catch (error) {
				console.log('error :>>', error);
			}
		});
	}
</script>

<div class="page-holder">
	<Button title="Start Game" onClick={onCreateRoom} />
</div>

<style>
	.page-holder {
		width: 100%;
		display: flex;
		justify-content: center;
		padding-top: 40vh;
	}
</style>
