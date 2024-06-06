import type { Writable } from 'svelte/store';

export const CORE_CONTEXT = 'core-context';

export type CoreContextType = {
	roomId: Writable<string | null>;
	playerId: Writable<string | null>;
	allPlayersReadyEmitter: Writable<boolean>;
};
