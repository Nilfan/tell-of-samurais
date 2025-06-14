import type { PresentType } from './presents.model';

export type CharacterAllegiance = 'neutral' | 'player1' | 'player2';

export interface Character {
	id: PresentType;
	name: string;
	totalCards: number;
	value: number;
	allegiance: CharacterAllegiance;
	isBlocked: boolean;
	cardsPlayedBy: {
		player1: number;
		player2: number;
	};
}

export interface CharacterState {
	characters: Record<PresentType, Character>;
	blockedCharacters: Set<PresentType>;
}

export const characterValues: Record<PresentType, number> = {
	type2_0: 2,
	type2_1: 2,
	type2_2: 2,
	type3_0: 3,
	type3_1: 3,
	type4_0: 4,
	type5_0: 5
};

export const characterNames: Record<PresentType, string> = {
	type2_0: 'Samurai 1',
	type2_1: 'Samurai 2',
	type2_2: 'Samurai 3',
	type3_0: 'Geisha 1',
	type3_1: 'Geisha 2',
	type4_0: 'Ninja',
	type5_0: 'Shogun'
};
