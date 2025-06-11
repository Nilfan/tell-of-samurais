import { PresentType } from "./presents.model";

export type CharacterAllegiance = "neutral" | "player1" | "player2";

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

export const getInitialCharacters: () => Character[] = () => [
    // 2-card characters
    {
        type: "type2_0",
        value: 2,
        allegiance: "neutral",
        isBlocked: false,
        cardsPlayedBy: { player1: 0, player2: 0 },
    },
    {
        type: "type2_1",
        value: 2,
        allegiance: "neutral",
        isBlocked: false,
        cardsPlayedBy: { player1: 0, player2: 0 },
    },
    {
        type: "type2_2",
        value: 2,
        allegiance: "neutral",
        isBlocked: false,
        cardsPlayedBy: { player1: 0, player2: 0 },
    },
    // 3-card characters
    {
        type: "type3_0",
        value: 3,
        allegiance: "neutral",
        isBlocked: false,
        cardsPlayedBy: { player1: 0, player2: 0 },
    },
    {
        type: "type3_1",
        value: 3,
        allegiance: "neutral",
        isBlocked: false,
        cardsPlayedBy: { player1: 0, player2: 0 },
    },
    // 4-card character
    {
        type: "type4_0",
        value: 4,
        allegiance: "neutral",
        isBlocked: false,
        cardsPlayedBy: { player1: 0, player2: 0 },
    },
    // 5-card character
    {
        type: "type5_0",
        value: 5,
        allegiance: "neutral",
        isBlocked: false,
        cardsPlayedBy: { player1: 0, player2: 0 },
    },
];
