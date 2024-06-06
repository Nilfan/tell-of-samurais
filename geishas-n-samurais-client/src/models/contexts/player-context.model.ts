import type { Writable } from 'svelte/store';
import type { PresentCard } from '../presentCard.model';

export const PLAYER_CONTEXT = 'player-context';

export type PlayerContextType = {
	hand: Writable<PresentCard[] | null>;
};
