import { writable } from 'svelte/store';
import type { GameState, GameAction } from '../../models/game.model';
import { GameManager } from '../game/GameManager';

const gameManager = new GameManager();
const initialState = gameManager.getState();

function createGameStore() {
	const { subscribe, set, update } = writable<GameState>(initialState);

	return {
		subscribe,
		performAction: (action: GameAction) => {
			const result = gameManager.performAction(action);
			if (result.success) {
				set(result.newState);
			}
			return result;
		},
		reset: () => {
			const newManager = new GameManager();
			set(newManager.getState());
		}
	};
}

export const gameStore = createGameStore();
