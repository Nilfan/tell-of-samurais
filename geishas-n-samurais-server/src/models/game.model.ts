import { Socket } from "socket.io";

export type PresentType =
    | "type2_0"
    | "type2_1"
    | "type2_2"
    | "type3_0"
    | "type3_1"
    | "type4_0"
    | "type5_0";

export type CharacterAllegiance = "neutral" | "player1" | "player2";

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

export interface Player {
    id: string;
    socket: Socket;
    hand: PresentType[];
    actionsUsed: Set<GameActionType>;
}

export type GameActionType =
    | "KEEP_ONE"
    | "PROPOSE_TWO_FROM_FOUR"
    | "PROPOSE_ONE_FROM_THREE"
    | "BLOCK_CHARACTERS";

export interface GameAction {
    type: GameActionType;
    cardId?: PresentType;
    cards?: PresentType[];
    characters?: [PresentType, PresentType];
}

export interface GameState {
    id: string;
    currentRound: number;
    currentPlayer: string;
    players: Map<string, Player>;
    characters: Map<PresentType, Character>;
    blockedCharacters: Set<PresentType>;
    gameStatus: "waiting" | "in_progress" | "finished";
    winner: string | null;
}

export interface GameEvent {
    type: "game_state_update" | "action_result" | "error";
    payload: any;
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

export const characterNames: Record<PresentType, string> = {
    type2_0: "Samurai 1",
    type2_1: "Samurai 2",
    type2_2: "Samurai 3",
    type3_0: "Geisha 1",
    type3_1: "Geisha 2",
    type4_0: "Ninja",
    type5_0: "Shogun",
};
