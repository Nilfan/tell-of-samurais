import type { Socket } from 'socket.io-client';
import { PlayerManager } from './PlayerManager';
import type { PresentCard } from '../models';
import type { PlayerAction } from './playerAction';

export class GameManager {
	playerManager: PlayerManager | undefined;

	initNewPlayer(socket: Socket): void {
		this.playerManager = new PlayerManager(socket);
	}

	resePlayer(): void {
		this.playerManager = undefined;
	}

	subscribeOnPlayerProps({
		handCallback,
		tableCallback,
		oppositeTableCallback,
		availableActionsCallback
	}: {
		handCallback: (cards: PresentCard[]) => void;
		tableCallback: (cards: PresentCard[]) => void;
		oppositeTableCallback: (cards: PresentCard[]) => void;
		availableActionsCallback: (actions: PlayerAction[]) => void;
	}): void {
		if (this.playerManager) {
			this.playerManager.hand.subscribe(handCallback);
			this.playerManager.table.subscribe(tableCallback);
			this.playerManager.oppositeTable.subscribe(oppositeTableCallback);
			this.playerManager.availableActions.subscribe(availableActionsCallback);
		} else {
			throw new Error('PlayerManager is not initialized. Please call initNewPlayer first.');
		}
	}
}

export const gameManager = new GameManager();
