import { v4 as uuidv4 } from "uuid";
import type { Socket } from "socket.io";
import type {
    GameState,
    Player,
    GameAction,
    GameEvent,
    PresentType,
    Character,
} from "../models/game.model";
import { characterValues, characterNames } from "../models/game.model";

export class GameService {
    private games: Map<string, GameState> = new Map();

    createGame(): string {
        const gameId = uuidv4();
        const gameState: GameState = {
            id: gameId,
            currentRound: 1,
            currentPlayer: "",
            players: new Map(),
            characters: this.initializeCharacters(),
            blockedCharacters: new Set(),
            gameStatus: "waiting",
            winner: null,
        };
        this.games.set(gameId, gameState);
        return gameId;
    }

    private initializeCharacters(): Map<PresentType, Character> {
        const characters = new Map<PresentType, Character>();
        Object.entries(characterValues).forEach(([type, value]) => {
            const presentType = type as PresentType;
            characters.set(presentType, {
                id: presentType,
                name: characterNames[presentType],
                totalCards: value,
                value,
                allegiance: "neutral",
                isBlocked: false,
                cardsPlayedBy: {
                    player1: 0,
                    player2: 0,
                },
            });
        });
        return characters;
    }

    joinGame(
        gameId: string,
        socket: Socket,
    ): { success: boolean; error?: string } {
        const game = this.games.get(gameId);
        if (!game) {
            return { success: false, error: "Game not found" };
        }

        if (game.players.size >= 2) {
            return { success: false, error: "Game is full" };
        }

        const playerId = socket.id;
        const player: Player = {
            id: playerId,
            socket,
            hand: [],
            actionsUsed: new Set(),
        };

        game.players.set(playerId, player);

        // If this is the second player, start the game
        if (game.players.size === 2) {
            this.startGame(gameId);
        }

        return { success: true };
    }

    private startGame(gameId: string): void {
        const game = this.games.get(gameId);
        if (!game) return;

        game.gameStatus = "in_progress";
        game.currentPlayer = Array.from(game.players.keys())[0];

        // Deal cards to players
        const deck = this.createDeck();
        const hands = this.dealCards(deck);

        let playerIndex = 0;
        for (const player of game.players.values()) {
            player.hand = hands[playerIndex++];
        }

        this.broadcastGameState(game);
    }

    private createDeck(): PresentType[] {
        const deck: PresentType[] = [];
        Object.entries(characterValues).forEach(([type, count]) => {
            for (let i = 0; i < count; i++) {
                deck.push(type as PresentType);
            }
        });
        return this.shuffleDeck(deck);
    }

    private shuffleDeck(deck: PresentType[]): PresentType[] {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private dealCards(deck: PresentType[]): PresentType[][] {
        const hands: PresentType[][] = [[], []];
        const cardsPerPlayer = 10;

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < cardsPerPlayer; j++) {
                const card = deck[i * cardsPerPlayer + j];
                if (card) {
                    hands[i].push(card);
                }
            }
        }

        return hands;
    }

    performAction(
        gameId: string,
        playerId: string,
        action: GameAction,
    ): { success: boolean; error?: string } {
        const game = this.games.get(gameId);
        if (!game) {
            return { success: false, error: "Game not found" };
        }

        if (game.gameStatus !== "in_progress") {
            return { success: false, error: "Game is not in progress" };
        }

        if (game.currentPlayer !== playerId) {
            return { success: false, error: "Not your turn" };
        }

        const player = game.players.get(playerId);
        if (!player) {
            return { success: false, error: "Player not found" };
        }

        // Validate action
        const validationResult = this.validateAction(game, player, action);
        if (!validationResult.success) {
            return validationResult;
        }

        // Execute action
        this.executeAction(game, player, action);

        // Check if round is complete
        if (this.isRoundComplete(game)) {
            this.endRound(game);
        } else {
            // Switch player
            game.currentPlayer =
                Array.from(game.players.keys()).find((id) => id !== playerId) ||
                "";
        }

        this.broadcastGameState(game);
        return { success: true };
    }

    private validateAction(
        game: GameState,
        player: Player,
        action: GameAction,
    ): { success: boolean; error?: string } {
        if (player.actionsUsed.has(action.type)) {
            return {
                success: false,
                error: `Action ${action.type} has already been used`,
            };
        }

        switch (action.type) {
            case "KEEP_ONE":
                if (!action.cardId || !player.hand.includes(action.cardId)) {
                    return { success: false, error: "Invalid card selection" };
                }
                break;
            case "PROPOSE_TWO_FROM_FOUR":
                if (
                    !action.cards ||
                    action.cards.length !== 4 ||
                    !action.cards.every((card) => player.hand.includes(card))
                ) {
                    return { success: false, error: "Invalid card selection" };
                }
                break;
            case "PROPOSE_ONE_FROM_THREE":
                if (
                    !action.cards ||
                    action.cards.length !== 3 ||
                    !action.cards.every((card) => player.hand.includes(card))
                ) {
                    return { success: false, error: "Invalid card selection" };
                }
                break;
            case "BLOCK_CHARACTERS":
                if (
                    !action.characters ||
                    action.characters.length !== 2 ||
                    action.characters[0] === action.characters[1]
                ) {
                    return {
                        success: false,
                        error: "Invalid character selection",
                    };
                }
                break;
        }

        return { success: true };
    }

    private executeAction(
        game: GameState,
        player: Player,
        action: GameAction,
    ): void {
        player.actionsUsed.add(action.type);

        switch (action.type) {
            case "KEEP_ONE":
                if (action.cardId) {
                    player.hand = player.hand.filter(
                        (card) => card !== action.cardId,
                    );
                    const character = game.characters.get(action.cardId);
                    if (character) {
                        character.cardsPlayedBy[
                            player.id === game.currentPlayer
                                ? "player1"
                                : "player2"
                        ]++;
                    }
                }
                break;
            case "PROPOSE_TWO_FROM_FOUR":
            case "PROPOSE_ONE_FROM_THREE":
                if (action.cards) {
                    player.hand = player.hand.filter(
                        (card) => !action.cards?.includes(card),
                    );
                }
                break;
            case "BLOCK_CHARACTERS":
                if (action.characters) {
                    action.characters.forEach((char) => {
                        const character = game.characters.get(char);
                        if (character) {
                            character.isBlocked = true;
                            game.blockedCharacters.add(char);
                        }
                    });
                }
                break;
        }
    }

    private isRoundComplete(game: GameState): boolean {
        return Array.from(game.players.values()).every(
            (player) => player.actionsUsed.size === 4,
        );
    }

    private endRound(game: GameState): void {
        // Update character allegiances
        for (const character of game.characters.values()) {
            if (character.isBlocked) {
                character.isBlocked = false;
                continue;
            }

            if (
                character.cardsPlayedBy.player1 >
                character.cardsPlayedBy.player2
            ) {
                character.allegiance = "player1";
            } else if (
                character.cardsPlayedBy.player2 >
                character.cardsPlayedBy.player1
            ) {
                character.allegiance = "player2";
            }
        }

        // Clear blocked characters
        game.blockedCharacters.clear();

        // Check for winner
        const winner = this.checkWinner(game);
        if (winner) {
            game.gameStatus = "finished";
            game.winner = winner;
        } else {
            // Start new round
            game.currentRound++;
            game.currentPlayer = Array.from(game.players.keys())[0];

            // Reset player actions
            for (const player of game.players.values()) {
                player.actionsUsed.clear();
            }

            // Deal new cards
            const deck = this.createDeck();
            const hands = this.dealCards(deck);

            let playerIndex = 0;
            for (const player of game.players.values()) {
                player.hand = hands[playerIndex++];
            }
        }
    }

    private checkWinner(game: GameState): string | null {
        const player1Characters = Array.from(game.characters.values()).filter(
            (char) => char.allegiance === "player1",
        ).length;
        const player2Characters = Array.from(game.characters.values()).filter(
            (char) => char.allegiance === "player2",
        ).length;

        // Check for 5 characters
        if (player1Characters >= 5) return Array.from(game.players.keys())[0];
        if (player2Characters >= 5) return Array.from(game.players.keys())[1];

        // Check for 11+ points
        const player1Points = Array.from(game.characters.values())
            .filter((char) => char.allegiance === "player1")
            .reduce((sum, char) => sum + char.value, 0);
        const player2Points = Array.from(game.characters.values())
            .filter((char) => char.allegiance === "player2")
            .reduce((sum, char) => sum + char.value, 0);

        if (player1Points >= 11) return Array.from(game.players.keys())[0];
        if (player2Points >= 11) return Array.from(game.players.keys())[1];

        return null;
    }

    private broadcastGameState(game: GameState): void {
        const gameState = {
            id: game.id,
            currentRound: game.currentRound,
            currentPlayer: game.currentPlayer,
            characters: Array.from(game.characters.values()),
            blockedCharacters: Array.from(game.blockedCharacters),
            gameStatus: game.gameStatus,
            winner: game.winner,
        };

        for (const player of game.players.values()) {
            const playerState = {
                ...gameState,
                hand: player.hand,
                actionsUsed: Array.from(player.actionsUsed),
            };
            player.socket.emit("game_state_update", playerState);
        }
    }

    leaveGame(gameId: string, playerId: string): void {
        const game = this.games.get(gameId);
        if (!game) return;

        game.players.delete(playerId);
        if (game.players.size === 0) {
            this.games.delete(gameId);
        } else {
            game.gameStatus = "waiting";
            this.broadcastGameState(game);
        }
    }
}
