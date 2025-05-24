import type { PresentType } from './presents.model';

export type CharacterAllegiance = 'neutral' | 'player1' | 'player2';

export interface Character {
    type: PresentType;
    value: number;
    allegiance: CharacterAllegiance;
    isBlocked: boolean;
    cardsPlayedBy: {
        player1: number;
        player2: number;
    };
}

export const characterValues: Record<PresentType, number> = {
    type2_0: 2,
    type2_1: 2,
    type2_2: 2,
    type3_0: 3,
    type3_1: 3,
    type4_0: 4,
    type5_0: 5,
};
