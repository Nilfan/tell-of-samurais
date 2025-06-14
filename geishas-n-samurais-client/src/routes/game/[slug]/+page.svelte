<script lang="ts">
	import { onMount } from 'svelte';
	import { socketService } from '@lib/socket-service';
	import { PlayerAction } from '@lib/playerAction';
	import type { PresentCard } from '../../../models/presentCard.model';
	import type { Character } from '../../../models/character.model';
	import type { PresentType } from '../../../models/presents.model';
	import { charactersCardColorDict, characterInfo } from './constants';

	let hand: PresentCard[] = [];
	let table: PresentCard[] = [];
	let oppositeTable: PresentCard[] = [];
	let availableActions: PlayerAction[] = [];
	let playerTurn = false;
	let characters: Character[] = [];
	let currentTurn: string | null = null;
	let gameStatus: 'waiting' | 'playing' | 'ended' = 'waiting';
	let winner: string | null = null;

	let cardsInChoose: PresentCard[] = [];

	onMount(() => {
		socketService.gameManager.subscribeOnPlayerProps(
			(newHand) => (hand = newHand),
			(newTable) => (table = newTable),
			(newOppositeTable) => (oppositeTable = newOppositeTable),
			(newActions) => (availableActions = newActions),
			(isPlayerTurn) => (playerTurn = isPlayerTurn),
			(newCharacters) => (characters = newCharacters),
			(newCurrentTurn) => (currentTurn = newCurrentTurn),
			(newGameStatus) => (gameStatus = newGameStatus),
			(newWinner) => (winner = newWinner)
		);
	});

	function emitAction(action: PlayerAction) {
		socketService.gameManager.makePlayerMove(action, cardsInChoose);
		cardsInChoose = [];
	}

	function chooseCard(card: PresentCard) {
		if (cardsInChoose.includes(card)) {
			deleteFromChoose(card);
		} else {
			cardsInChoose = [...cardsInChoose, card];
		}
	}

	function deleteFromChoose(card: PresentCard) {
		cardsInChoose = cardsInChoose.filter((c) => c !== card);
	}

	function handWithoutCardsInChoose() {
		return hand.filter((card) => !cardsInChoose.includes(card));
	}

	function getCharacterInfo(type: PresentType) {
		return characterInfo[type] || { name: 'Unknown', value: 0 };
	}

	function getPlayerScore() {
		if (!Array.isArray(characters)) return { player1: 0, player2: 0 };
		return characters.reduce(
			(acc, char) => {
				if (char.allegiance === 'player1') {
					acc.player1 += char.value;
				} else if (char.allegiance === 'player2') {
					acc.player2 += char.value;
				}
				return acc;
			},
			{ player1: 0, player2: 0 }
		);
	}

	function getAllegianceCount() {
		if (!Array.isArray(characters)) return { player1: 0, player2: 0 };
		return characters.reduce(
			(acc, char) => {
				if (char.allegiance === 'player1') {
					acc.player1++;
				} else if (char.allegiance === 'player2') {
					acc.player2++;
				}
				return acc;
			},
			{ player1: 0, player2: 0 }
		);
	}

	function isCurrentPlayerWinner() {
		let currentPlayerId: string | null = null;
		socketService.playerId.subscribe((id) => (currentPlayerId = id))();
		return winner === currentPlayerId;
	}
</script>

<div class="game-field-container">
	{#if gameStatus === 'waiting'}
		<div class="waiting-message">Waiting for opponent...</div>
	{:else if gameStatus === 'ended'}
		<div class="game-end-message">
			Game Over! {isCurrentPlayerWinner() ? 'You won!' : 'You lost!'}
		</div>
	{:else}
		<div class="game-section opponent-section">
			<h2>Opponent's Table</h2>
			<div class="table">
				{#each oppositeTable as card}
					<div class="present-card" style="background-color: {charactersCardColorDict[card.type]}">
						{#if getCharacterInfo(card.type)}
							{getCharacterInfo(card.type).name}
						{:else}
							Unknown
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<div class="game-section characters-section">
			<h2>Characters</h2>
			<div class="characters">
				{#each characters as character}
					<div class="character-card" class:blocked={character.isBlocked}>
						<div class="character-info">
							{#if getCharacterInfo(character.id)}
								<div class="character-name">{getCharacterInfo(character.id).name}</div>
							{:else}
								<div class="character-name">Unknown</div>
							{/if}
							<div class="character-value">Value: {character.value}</div>
							<div class="character-allegiance">
								Allegiance: {character.allegiance || 'None'}
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="game-stats">
				<div class="score">
					Player 1: {getPlayerScore().player1} points ({getAllegianceCount().player1} characters)
				</div>
				<div class="score">
					Player 2: {getPlayerScore().player2} points ({getAllegianceCount().player2} characters)
				</div>
			</div>
		</div>

		<div class="game-section player-section">
			<h2>Your Table</h2>
			<div class="table">
				{#each table as card}
					<div class="present-card" style="background-color: {charactersCardColorDict[card.type]}">
						{#if getCharacterInfo(card.type)}
							{getCharacterInfo(card.type).name}
						{:else}
							Unknown
						{/if}
					</div>
				{/each}
			</div>

			<h2>Your Hand</h2>
			<div class="hand">
				{#each handWithoutCardsInChoose() as card}
					<div
						class="present-card"
						class:selected={cardsInChoose.includes(card)}
						style="background-color: {charactersCardColorDict[card.type]}"
						on:click={() => chooseCard(card)}
					>
						{#if getCharacterInfo(card.type)}
							{getCharacterInfo(card.type).name}
						{:else}
							Unknown
						{/if}
					</div>
				{/each}
			</div>

			{#if availableActions.length > 0}
				<div class="available-actions">
					<h2>Available Actions</h2>
					{#each availableActions as action}
						<button
							class="action-button"
							disabled={!playerTurn}
							on:click={() => emitAction(action)}
						>
							{action}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.game-field-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2rem;
		height: 100vh;
		background-color: #f5f5f5;
	}

	.waiting-message,
	.game-end-message {
		text-align: center;
		font-size: 2rem;
		margin: 2rem 0;
	}

	.game-section {
		background-color: white;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.opponent-section {
		margin-bottom: 1rem;
	}

	.characters-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.player-section {
		margin-top: 1rem;
	}

	.table,
	.hand {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin: 1rem 0;
	}

	.present-card {
		width: 100px;
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		color: white;
		text-align: center;
		padding: 0.5rem;
		font-weight: bold;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.present-card:hover {
		transform: translateY(-5px);
	}

	.present-card.selected {
		transform: translateY(-10px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		border: 2px solid gold;
	}

	.characters {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.character-card {
		background-color: white;
		border: 2px solid #ddd;
		border-radius: 8px;
		padding: 1rem;
		transition: all 0.2s;
	}

	.character-card.blocked {
		opacity: 0.5;
		background-color: #f0f0f0;
	}

	.character-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.character-name {
		font-weight: bold;
		font-size: 1.2rem;
	}

	.game-stats {
		display: flex;
		justify-content: space-around;
		margin-top: 1rem;
		padding: 1rem;
		background-color: #f8f8f8;
		border-radius: 8px;
	}

	.score {
		font-size: 1.1rem;
		font-weight: 500;
	}

	.available-actions {
		margin-top: 1rem;
	}

	.action-button {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		margin: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.action-button:hover:not(:disabled) {
		background-color: #45a049;
	}

	.action-button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
</style>
