import { cloneDeep } from "lodash";
import { PresentCard } from "../models/presentCard.model";
import { presentsService } from "./presentsService";
import { Player } from "./Player";
import { PlayerAction } from "src/helpers/playerActions";
import { ClientEvent, ServerEvent } from "src/helpers/events";
import { Socket } from "socket.io";

const INITIAL_HAND_CAPACITY = 10;

const MIN_CARD_INDEX = 0;
const MAX_TRIPLE_CHOOSE_CARD_INDEX = 2;
const MAX_DOUBLE_SPLIT_CARDS_INDEX = 1;

export class GameField {
    initialDeck: PresentCard[];
    deck: PresentCard[];
    outOfGameCard: PresentCard;

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
        const deck = presentsService.generateCardDeck();

        this.initialDeck = cloneDeep(deck);

        const hand1 = deck.splice(0, INITIAL_HAND_CAPACITY);
        const hand2 = deck.splice(1, INITIAL_HAND_CAPACITY);

        this.player1.handManager.updateHand(hand1);
        this.player2.handManager.updateHand(hand2);

        this.player1.actionsManager.resetActions();
        this.player2.actionsManager.resetActions();
    }

    changePlayersTurn(currentTurnPlayer: Player): void {
        currentTurnPlayer.stopMoving();
        const nextTurnPlayer = this.findNextTurnPlayer(currentTurnPlayer);
        nextTurnPlayer.startMoving();
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
            case PlayerAction.TripleChoose:
                this.proceedTripleChoose(initiator, cards);
            case PlayerAction.DoubleSplit:
                this.proceedDoubleSplit(initiator, cards);
            case PlayerAction.TwoCardsBlockTransition:
                this.proceedTwoCardsBlockTransition(initiator, cards);
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

                // if answer is okay then update boths tables
                const receivePlayerCard = cards.splice(cardNum, 1);
                receivePlayer.tableManager.addCardToTable(receivePlayerCard);

                initiator.tableManager.addCardToTable(cards);
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
        receivePlayer.socketEmit(ServerEvent.AskPlayerToChooseCounpleCards);
    }

    proceedTwoCardsBlockTransition(
        initiator: Player,
        cards: PresentCard[],
    ): void {
        initiator.holdBlockCardTypes(cards);
        this.changePlayersTurn(initiator);
    }

    private findNextTurnPlayer(currentTurnPlayer: Player): Player {
        return this.player1.id !== currentTurnPlayer.id
            ? this.player1
            : this.player2;
    }
}
