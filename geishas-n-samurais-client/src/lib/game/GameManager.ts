import type { GameState, GameAction, GameActionResult, PlayerId } from '../../models/game.model';
import type { Character } from '../../models/character.model';
import type { PresentType } from '../../models/presents.model';
import { createCardDeck, dealCards } from '../../models/card.model';
import { characterValues, characterNames } from '../../models/character.model';

export class GameManager {
	private state: GameState;

	constructor() {
		this.state = this.initializeGame();
	}

	private initializeGame(): GameState {
		const deck = createCardDeck();
		const hands = dealCards(deck);

		// Initialize characters
		const characters: Record<PresentType, Character> = {} as Record<PresentType, Character>;
		Object.entries(characterValues).forEach(([type, value]) => {
			const presentType = type as PresentType;
			characters[presentType] = {
				id: presentType,
				name: characterNames[presentType],
				totalCards: value,
				value,
				allegiance: 'neutral',
				isBlocked: false,
				cardsPlayedBy: {
					player1: 0,
					player2: 0
				}
			};
		});

		return {
			currentRound: 1,
			currentPlayer: 'player1',
			players: {
				player1: {
					id: 'player1',
					hand: hands[0].map((card: { type: PresentType }) => card.type),
					actionsUsed: new Set()
				},
				player2: {
					id: 'player2',
					hand: hands[1].map((card: { type: PresentType }) => card.type),
					actionsUsed: new Set()
				}
			},
			characterState: {
				characters,
				blockedCharacters: new Set<PresentType>()
			},
			gameStatus: 'in_progress',
			winner: null
		};
	}

	public getState(): GameState {
		return { ...this.state };
	}

	public performAction(action: GameAction): GameActionResult {
		if (this.state.gameStatus !== 'in_progress') {
			return {
				success: false,
				error: 'Game is not in progress',
				newState: this.state
			};
		}

		const player = this.state.players[this.state.currentPlayer];

		// Check if action type has already been used
		if (player.actionsUsed.has(action.type)) {
			return {
				success: false,
				error: `Action ${action.type} has already been used`,
				newState: this.state
			};
		}

		// Validate action based on type
		const validationResult = this.validateAction(action);
		if (!validationResult.success) {
			return {
				success: false,
				error: validationResult.error,
				newState: this.state
			};
		}

		// Perform action
		this.executeAction(action);

		// Check if round is complete
		if (this.isRoundComplete()) {
			this.endRound();
		} else {
			// Switch player
			this.state.currentPlayer = this.state.currentPlayer === 'player1' ? 'player2' : 'player1';
		}

		return {
			success: true,
			newState: this.state
		};
	}

	private validateAction(action: GameAction): { success: boolean; error?: string } {
		const player = this.state.players[this.state.currentPlayer];

		switch (action.type) {
			case 'KEEP_ONE':
				if (!player.hand.includes(action.cardId)) {
					return { success: false, error: 'Card not in hand' };
				}
				break;
			case 'PROPOSE_TWO_FROM_FOUR':
				if (action.cards.length !== 4) {
					return { success: false, error: 'Must select exactly 4 cards' };
				}
				if (!action.cards.every((card) => player.hand.includes(card))) {
					return { success: false, error: 'All cards must be in hand' };
				}
				break;
			case 'PROPOSE_ONE_FROM_THREE':
				if (action.cards.length !== 3) {
					return { success: false, error: 'Must select exactly 3 cards' };
				}
				if (!action.cards.every((card) => player.hand.includes(card))) {
					return { success: false, error: 'All cards must be in hand' };
				}
				break;
			case 'BLOCK_CHARACTERS':
				if (action.characters.length !== 2) {
					return { success: false, error: 'Must select exactly 2 characters' };
				}
				if (action.characters[0] === action.characters[1]) {
					return { success: false, error: 'Cannot block the same character twice' };
				}
				break;
		}

		return { success: true };
	}

	private executeAction(action: GameAction): void {
		const player = this.state.players[this.state.currentPlayer];
		player.actionsUsed.add(action.type);

		switch (action.type) {
			case 'KEEP_ONE':
				this.keepOneCard(action.cardId);
				break;
			case 'PROPOSE_TWO_FROM_FOUR':
				this.proposeTwoFromFour(action.cards);
				break;
			case 'PROPOSE_ONE_FROM_THREE':
				this.proposeOneFromThree(action.cards);
				break;
			case 'BLOCK_CHARACTERS':
				this.blockCharacters(action.characters);
				break;
		}
	}

	private keepOneCard(cardId: PresentType): void {
		const player = this.state.players[this.state.currentPlayer];
		player.hand = player.hand.filter((card) => card !== cardId);
		this.state.characterState.characters[cardId].cardsPlayedBy[this.state.currentPlayer]++;
	}

	private proposeTwoFromFour(cards: PresentType[]): void {
		// This would be handled by the UI to let the opponent pick
		// For now, we'll just remove the cards from hand
		const player = this.state.players[this.state.currentPlayer];
		player.hand = player.hand.filter((card) => !cards.includes(card));
	}

	private proposeOneFromThree(cards: PresentType[]): void {
		// This would be handled by the UI to let the opponent pick
		// For now, we'll just remove the cards from hand
		const player = this.state.players[this.state.currentPlayer];
		player.hand = player.hand.filter((card) => !cards.includes(card));
	}

	private blockCharacters(characters: [PresentType, PresentType]): void {
		characters.forEach((char) => {
			this.state.characterState.characters[char].isBlocked = true;
			this.state.characterState.blockedCharacters.add(char);
		});
	}

	private isRoundComplete(): boolean {
		const player1 = this.state.players.player1;
		const player2 = this.state.players.player2;
		return player1.actionsUsed.size === 4 && player2.actionsUsed.size === 4;
	}

	private endRound(): void {
		// Update character allegiances
		Object.values(this.state.characterState.characters).forEach((char) => {
			if (char.isBlocked) {
				char.isBlocked = false;
				return;
			}

			const player1Cards = char.cardsPlayedBy.player1;
			const player2Cards = char.cardsPlayedBy.player2;

			if (player1Cards > player2Cards) {
				char.allegiance = 'player1';
			} else if (player2Cards > player1Cards) {
				char.allegiance = 'player2';
			}
		});

		// Clear blocked characters
		this.state.characterState.blockedCharacters.clear();

		// Check for winner
		const winner = this.checkWinner();
		if (winner) {
			this.state.gameStatus = 'finished';
			this.state.winner = winner;
		} else {
			// Start new round
			this.state.currentRound++;
			this.state.currentPlayer = 'player1';

			// Reset player actions
			this.state.players.player1.actionsUsed.clear();
			this.state.players.player2.actionsUsed.clear();

			// Deal new cards
			const deck = createCardDeck();
			const hands = dealCards(deck);
			this.state.players.player1.hand = hands[0].map((card) => card.type);
			this.state.players.player2.hand = hands[1].map((card) => card.type);
		}
	}

	private checkWinner(): PlayerId | null {
		const player1Characters = Object.values(this.state.characterState.characters).filter(
			(char) => char.allegiance === 'player1'
		).length;
		const player2Characters = Object.values(this.state.characterState.characters).filter(
			(char) => char.allegiance === 'player2'
		).length;

		// Check for 5 characters
		if (player1Characters >= 5) return 'player1';
		if (player2Characters >= 5) return 'player2';

		// Check for 11+ points
		const player1Points = Object.values(this.state.characterState.characters)
			.filter((char) => char.allegiance === 'player1')
			.reduce((sum, char) => sum + char.value, 0);
		const player2Points = Object.values(this.state.characterState.characters)
			.filter((char) => char.allegiance === 'player2')
			.reduce((sum, char) => sum + char.value, 0);

		if (player1Points >= 11) return 'player1';
		if (player2Points >= 11) return 'player2';

		return null;
	}
}
