import type { PresentCard } from '../models';
import type { Character } from '../models/character.model';
import { PlayerAction } from './playerAction';
import type { Socket } from 'socket.io-client';
import { PlayerManager } from './PlayerManager';

export class GameManager {
	private playerManager: PlayerManager;

	constructor(socket: Socket) {
		this.playerManager = new PlayerManager(socket);
	}

	subscribeOnPlayerProps(
		handCallback: (hand: PresentCard[]) => void,
		tableCallback: (table: PresentCard[]) => void,
		oppositeTableCallback: (oppositeTable: PresentCard[]) => void,
		availableActionsCallback: (availableActions: PlayerAction[]) => void,
		playerTurnCallback: (playerTurn: boolean) => void,
		charactersCallback: (characters: Character[]) => void,
		currentTurnCallback: (currentTurn: string | null) => void,
		gameStatusCallback: (status: 'waiting' | 'playing' | 'ended') => void,
		winnerCallback: (winner: string | null) => void
	) {
		this.playerManager.hand.subscribe(handCallback);
		this.playerManager.table.subscribe(tableCallback);
		this.playerManager.oppositeTable.subscribe(oppositeTableCallback);
		this.playerManager.availableActions.subscribe(availableActionsCallback);
		this.playerManager.playerTurn.subscribe(playerTurnCallback);
		this.playerManager.characters.subscribe(charactersCallback);
		this.playerManager.currentTurn.subscribe(currentTurnCallback);
		this.playerManager.gameStatus.subscribe(gameStatusCallback);
		this.playerManager.winner.subscribe(winnerCallback);
	}

	makePlayerMove(action: PlayerAction, cards: PresentCard[]): void {
		this.playerManager.makePlayerMove(action, cards);
	}

	reset(): void {
		this.playerManager.reset();
	}
}
