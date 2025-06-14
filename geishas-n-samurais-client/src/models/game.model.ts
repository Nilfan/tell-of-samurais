import type { PresentType } from './presents.model';
import type { CharacterState } from './character.model';

export type PlayerId = 'player1' | 'player2';

export type GameAction =
	| { type: 'KEEP_ONE'; cardId: PresentType }
	| { type: 'PROPOSE_TWO_FROM_FOUR'; cards: PresentType[] }
	| { type: 'PROPOSE_ONE_FROM_THREE'; cards: PresentType[] }
	| { type: 'BLOCK_CHARACTERS'; characters: [PresentType, PresentType] };

export interface Player {
	id: PlayerId;
	hand: PresentType[];
	actionsUsed: Set<GameAction['type']>;
}

export interface GameState {
	currentRound: number;
	currentPlayer: PlayerId;
	players: Record<PlayerId, Player>;
	characterState: CharacterState;
	gameStatus: 'not_started' | 'in_progress' | 'finished';
	winner: PlayerId | null;
}

export interface GameActionResult {
	success: boolean;
	error?: string;
	newState: GameState;
}
