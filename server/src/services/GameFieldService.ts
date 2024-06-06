import { cloneDeep } from "lodash";
import { PresentCard } from "../models/presentCard.model";
import { presentsService } from "./presentsService";
import { Player } from "./Player";

const INITIAL_HAND_CAPACITY = 10;

export class GameField {
    initialDeck: PresentCard[];
    deck: PresentCard[];
    outOfGameCard: PresentCard;

    player1: Player = new Player();
    player2: Player = new Player();

    constructor() {}

    startNewRound(): void {
        const deck = presentsService.generateCardDeck();

        this.initialDeck = cloneDeep(deck);

        const hand1 = deck.splice(0, INITIAL_HAND_CAPACITY);
        const hand2 = deck.splice(1, INITIAL_HAND_CAPACITY);

        this.player1.updateHand(hand1);
        this.player2.updateHand(hand2);

        this.player1.resetActions();
        this.player2.resetActions();
    }
}
