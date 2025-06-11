import { cloneDeep } from "lodash";
import { PresentCard } from "../models/presentCard.model";
import { presentsService } from "./presentsService";
import { Player } from "./Player";
import { PlayerAction } from "../helpers/playerActions";
import { ClientEvent, ServerEvent } from "../helpers/events";
import { Socket } from "socket.io";
import { Character, getInitialCharacters } from "../models/character.model";

const INITIAL_HAND_CAPACITY = 10;
const MIN_CARD_INDEX = 0;
const MAX_TRIPLE_CHOOSE_CARD_INDEX = 2;
const MAX_DOUBLE_SPLIT_CARDS_INDEX = 1;

export class GameField {
    initialDeck: PresentCard[];
    deck: PresentCard[];
    outOfGameCard: PresentCard;
    characters: Character[] = getInitialCharacters();

    player1: Player;
    player2: Player;

    constructor() {}

    addFirstPlayer(socket: Socket) {
        this.player1 = new Player(socket);
    }

    addSecondPlayer(socket: Socket) {
        this.player2 = new Player(socket);
    }

    startNewRound(): void {
        // Reset character states except allegiance
        this.characters.forEach((char) => {
            char.isBlocked = false;
            char.cardsPlayedBy.player1 = 0;
            char.cardsPlayedBy.player2 = 0;
        });

        const deck = presentsService.generateCardDeck();
        this.initialDeck = cloneDeep(deck);

        const hand1 = deck.splice(0, INITIAL_HAND_CAPACITY);
        const hand2 = deck.splice(1, INITIAL_HAND_CAPACITY);

        console.log("hand1", hand1);
        console.log("hand2", hand2);

        this.player1.handManager.updateHand(hand1);
        this.player2.handManager.updateHand(hand2);

        this.player1.actionsManager.resetActions();
        this.player2.actionsManager.resetActions();

        // Emit character states to both players
        this.emitCharacterStates();
    }

    proceedPlayerMove(
        initiator: Player,
        action: PlayerAction,
        cards: PresentCard[],
    ): void {
        if (!initiator.actionsManager.isActionAvailable(action)) {
            initiator.socketEmit(ServerEvent.WrongAction, action);
            return;
        }

        initiator.actionsManager.closeActionAvailability(action);
        switch (action) {
            case PlayerAction.HoldSecretCard:
                this.proceedHoldSecretCard(initiator, cards);
                break;
            case PlayerAction.TripleChoose:
                this.proceedTripleChoose(initiator, cards);
                break;
            case PlayerAction.DoubleSplit:
                this.proceedDoubleSplit(initiator, cards);
                break;
            case PlayerAction.TwoCardsBlockTransition:
                this.proceedTwoCardsBlockTransition(initiator, cards);
                break;
            default:
                return;
        }
    }

    proceedHoldSecretCard(initiator: Player, cards: PresentCard[]): void {
        initiator.holdSecretCard(cards[0]);
        this.changePlayersTurn(initiator);
    }

    proceedTripleChoose(initiator: Player, cards: PresentCard[]): void {
        // update initiator hand
        initiator.handManager.deleteCardsFromHand(cards);

        const receivePlayer = this.findNextTurnPlayer(initiator);

        receivePlayer
            .subscribeOnEvent(ClientEvent.ChooseOneCard)
            .then((cardNum: number) => {
                // if answer is out of boundary
                if (
                    cardNum < MIN_CARD_INDEX ||
                    cardNum > MAX_TRIPLE_CHOOSE_CARD_INDEX
                ) {
                    this.proceedTripleChoose(initiator, cards);
                    return;
                }
                const receivePlayerCard = cards.splice(cardNum, 1);
                receivePlayer.tableManager.addCardToTable(receivePlayerCard);

                initiator.tableManager.addCardToTable(cards);
                this.updateCharacterState(
                    cards.concat(receivePlayerCard),
                    initiator.id,
                );
                this.changePlayersTurn(initiator);
            });

        // ask receive-player to choose card
        receivePlayer.socketEmit(ServerEvent.AskPlayerToChooseOneCard);
    }

    proceedDoubleSplit(initiator: Player, cards: PresentCard[]): void {
        // update initiator hand
        initiator.handManager.deleteCardsFromHand(cards);

        const receivePlayer = this.findNextTurnPlayer(initiator);

        receivePlayer
            .subscribeOnEvent(ClientEvent.ChooseCoupleCards)
            .then((coupleCardsIndex: number) => {
                // if answer is out of boundary
                if (
                    coupleCardsIndex < MIN_CARD_INDEX ||
                    coupleCardsIndex > MAX_DOUBLE_SPLIT_CARDS_INDEX
                ) {
                    this.proceedDoubleSplit(initiator, cards);
                    return;
                }

                // if answer is okay then update boths tables
                // *multiply index so we could choose index to cut correct pair
                const receivePlayerCard = cards.splice(coupleCardsIndex * 2, 2);
                receivePlayer.tableManager.addCardToTable(receivePlayerCard);

                initiator.tableManager.addCardToTable(cards);
                this.changePlayersTurn(initiator);
            });

        // ask receive-player to choose card
        receivePlayer.socketEmit(ServerEvent.AskPlayerToChooseDoubleCards);
    }
    proceedTwoCardsBlockTransition(
        initiator: Player,
        cards: PresentCard[],
    ): void {
        const cardTypes = cards.map((card) => card.type);
        this.blockCharacters(cardTypes);
        initiator.holdBlockCardTypes(cards);
        this.changePlayersTurn(initiator);
    }

    setOppositeTablesUpdaters(): void {
        if (this.player1 && this.player2) {
            this.player1.tableManager.setUpdateOppositeTableUpdater(
                (cards: PresentCard[]) =>
                    this.player2.socketEmit(
                        ServerEvent.UpdateOppositeTable,
                        cards,
                    ),
            );
            this.player2.tableManager.setUpdateOppositeTableUpdater(
                (cards: PresentCard[]) =>
                    this.player1.socketEmit(
                        ServerEvent.UpdateOppositeTable,
                        cards,
                    ),
            );

            this.player1.tableManager.addCardToTable([]);
            this.player2.tableManager.addCardToTable([]);
        }
    }

    private updateCharacterState(cards: PresentCard[], playerId: string): void {
        // Group cards by character type
        const cardsByType = cards.reduce(
            (acc, card) => {
                acc[card.type] = (acc[card.type] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        // Update cards played for each character
        Object.entries(cardsByType).forEach(([type, count]) => {
            const character = this.characters.find((c) => c.type === type);
            if (character) {
                const playerKey =
                    playerId === this.player1.id ? "player1" : "player2";
                character.cardsPlayedBy[playerKey] += count;
            }
        });

        // Evaluate allegiance changes for unblocked characters
        this.characters
            .filter((char) => !char.isBlocked)
            .forEach((char) => {
                if (char.cardsPlayedBy.player1 > char.cardsPlayedBy.player2) {
                    char.allegiance = "player1";
                } else if (
                    char.cardsPlayedBy.player2 > char.cardsPlayedBy.player1
                ) {
                    char.allegiance = "player2";
                }
                // If equal, allegiance stays the same
            });

        this.emitCharacterStates();
        this.checkWinCondition();
    }

    private blockCharacters(characterTypes: string[]): void {
        characterTypes.forEach((type) => {
            const character = this.characters.find((c) => c.type === type);
            if (character) {
                character.isBlocked = true;
            }
        });
        this.emitCharacterStates();
    }

    private emitCharacterStates(): void {
        const characterStates = cloneDeep(this.characters);
        this.player1.socketEmit(
            ServerEvent.UpdateCharacterStates,
            characterStates,
        );
        this.player2.socketEmit(
            ServerEvent.UpdateCharacterStates,
            characterStates,
        );
    }

    private checkWinCondition(): boolean {
        const getPlayerScore = (playerId: string) => {
            const playerChars = this.characters.filter(
                (char) =>
                    char.allegiance ===
                    (playerId === this.player1.id ? "player1" : "player2"),
            );
            return {
                characterCount: playerChars.length,
                totalValue: playerChars.reduce(
                    (sum, char) => sum + char.value,
                    0,
                ),
            };
        };

        const player1Score = getPlayerScore(this.player1.id);
        const player2Score = getPlayerScore(this.player2.id);

        const player1Wins =
            player1Score.characterCount >= 5 || player1Score.totalValue >= 11;
        const player2Wins =
            player2Score.characterCount >= 5 || player2Score.totalValue >= 11;

        if (player1Wins || player2Wins) {
            const winner = player1Wins ? this.player1 : this.player2;
            this.player1.socketEmit(ServerEvent.GameEnd, {
                winner: winner.id,
                player1Score,
                player2Score,
            });
            this.player2.socketEmit(ServerEvent.GameEnd, {
                winner: winner.id,
                player1Score,
                player2Score,
            });
            return true;
        }

        return false;
    }

    private findNextTurnPlayer(currentTurnPlayer: Player): Player {
        return this.player1.id !== currentTurnPlayer.id
            ? this.player1
            : this.player2;
    }

    private changePlayersTurn(currentTurnPlayer: Player): void {
        currentTurnPlayer.stopMoving();
        const nextTurnPlayer = this.findNextTurnPlayer(currentTurnPlayer);
        nextTurnPlayer.startMoving();
    }
}
