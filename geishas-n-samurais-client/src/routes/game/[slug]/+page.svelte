<script lang="ts">
	import { onMount } from 'svelte';
	import type { PresentCard } from '../../../models';
	import { socketService } from '@lib/socket-service';
	import { goto } from '$app/navigation';
	import Button from '@components/Button.svelte';
	import { PlayerAction, playerActionsCollection } from '@lib/playerAction';
	import { charactersCardColor, charactersCardColorDict } from './constants';
	import { gameManager } from '@lib/GameManager';

	const actionsCollection = playerActionsCollection;

	onMount(() => {
		socketService.roomId.subscribe((roomIdValue) => {
			if (!roomIdValue) {
				goto('/', { replaceState: true });
			}
		});

		gameManager.subscribeOnPlayerProps({
			handCallback: (res) => (hand = res || []),
			tableCallback: (res) => (table = res || []),
			oppositeTableCallback: (res) => (oppositeTable = res || []),
			availableActionsCallback: (res) => (availableActions = res || [])
		});
	});

	function emitAction(action: PlayerAction): void {
		isChooseCardsMode = true;
		// switch (action) {
		// 	case PlayerAction.HoldSecretCard:
		// 		this.proceedHoldSecretCard(initiator, cards);
		// 		playerManager.
		// 	case PlayerAction.TwoCardsBlockTransition:
		// 		this.proceedTwoCardsBlockTransition(initiator, cards);
		// 	case PlayerAction.TripleChoose:
		// 		this.proceedTripleChoose(initiator, cards);
		// 	case PlayerAction.DoubleSplit:
		// 		this.proceedDoubleSplit(initiator, cards);
		// 	default:
		// 		return;
		// }
	}

	function chooseCard(card: PresentCard): void {
		cardsInChoose.push(card);
		cardsInChoose = [...cardsInChoose];
	}

	function deleteFromChoose(card: PresentCard): void {
		cardsInChoose = cardsInChoose.filter((item) => item.id !== card.id);
	}

	function handWithoutCardsInChoose(cards: PresentCard[]): PresentCard[] {
		const result = hand.filter((card) => !cards.some((item) => item.id === card.id));
		console.log('handWithoutCardsInChoose result :>>', result);

		return result;
	}

	$: isChooseCardsMode = false;

	$: table = [] as PresentCard[];
	$: hand = [] as PresentCard[];
	$: oppositeTable = [] as PresentCard[];
	$: availableActions = [] as PlayerAction[];
	$: cardsInChoose = [] as PresentCard[];
	$: handView = handWithoutCardsInChoose(cardsInChoose);
</script>

<div class="game-field-container">
	<div class="present-cards-container">
		<span> Opposite Player Table </span>
		{#each oppositeTable as card}
			<div class="present-card" style={`background-color: ${charactersCardColorDict[card.type]}`}>
				{card.type}
			</div>
		{/each}
	</div>

	<br />

	<div class="characters-cards-container">
		<span> Characters </span>
		{#each charactersCardColor as character}
			<div class="character-card" style={`background-color: ${character.color}`}>
				{character.type}
			</div>
		{/each}
	</div>

	<br />

	<div class="present-cards-container">
		<span> Player Table </span>
		{#each table as card}
			<div class="present-card" style={`background-color: ${charactersCardColorDict[card.type]}`}>
				{card.type}
			</div>
		{/each}
	</div>

	<br />

	<div class="present-cards-container">
		<span> Cards in Hand </span>

		{#each handView as card}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore missing-declaration -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="present-card"
				style={`background-color: ${charactersCardColorDict[card.type]}`}
				on:click={() => isChooseCardsMode && chooseCard(card)}
			>
				{card.type}
			</div>
		{/each}
	</div>

	<div class="available-actions-container">
		<span> Available Actions </span>
		{#each actionsCollection as action}
			<Button
				title={action}
				disabled={!availableActions.includes(action)}
				onClick={() => emitAction(action)}
			/>
		{/each}
	</div>

	<div class="present-cards-container">
		<span> Cards in Choose </span>
		{#each cardsInChoose as card}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore missing-declaration -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="present-card"
				style={`background-color: ${charactersCardColorDict[card.type]}`}
				on:click={() => isChooseCardsMode && deleteFromChoose(card)}
			>
				{card.type}
			</div>
		{/each}
	</div>
</div>

<style>
	.game-field-container {
		height: 100%;
		max-height: 100%;
		width: 100%;
	}

	.characters-cards-container {
		display: flex;
	}

	.character-card {
		height: 200px;
		width: 100px;
	}

	.present-cards-container {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.present-card {
		color: white;
		height: 80px;
		width: 60px;
	}
</style>
