import { writable, type Writable } from 'svelte/store';
import type { PresentCard } from '../models';

class PlayerService {
	hand: Writable<PresentCard[] | null> = writable(null);

	reset() {
		this.hand.set(null);
	}
}

export const playerService = new PlayerService();
