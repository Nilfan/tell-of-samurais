import { writable, type Writable } from 'svelte/store';
import type { PresentCard } from '../models';
import { PlayerAction } from './playerAction';
import { socketService } from './socket-service';

class PlayerManager {
	hand: Writable<PresentCard[] | null> = writable(null);
	availableActions: Writable<PlayerAction[]> = writable([]);
	playerTurn: Writable<boolean> = writable(false);

	reset() {
		this.hand.set(null);
		this.availableActions.set([]);
		this.playerTurn.set(false);
	}

	makePlayerMove(action: PlayerAction, cards: PresentCard[]): void {
		socketService.emitPlayerMove(action, cards);
	}

	updateHand(changes: PresentCard[]) {
		this.hand.set(changes);
	}

	updateActions(changes: PlayerAction[]) {
		this.availableActions.set(changes);
	}

	updatePlayerTurn(changes: boolean) {
		this.playerTurn.set(changes);
	}
}

export const playerManager = new PlayerManager();
