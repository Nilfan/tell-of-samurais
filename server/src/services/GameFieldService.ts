import { cloneDeep } from "lodash";
import { PresentCard } from "../models/presentCard.model";
import { presentsService } from "./presentsService";
import { Player } from "./Player";

const INITIAL_HAND_CAPACITY = 10;

export class GameField {
    initialDeck: PresentCard[];
    deck: PresentCard[];
    outOfGameCard: PresentCard;

    player1: Player;
    player2: Player;

    constructor() {
        const deck = presentsService.generateCardDeck();

        this.initialDeck = cloneDeep(deck);

        const hand1 = deck.splice(0, INITIAL_HAND_CAPACITY);
        const hand2 = deck.splice(1, INITIAL_HAND_CAPACITY);

        this.player1 = new Player(hand1);
        this.player2 = new Player(hand2);

        // console.log("initialDeck :>> ", this.initialDeck);
        // console.log("outOfGameCard :>> ", this.outOfGameCard);
        // console.log("hand1 :>> ", hand1);
        // console.log("hand2 :>> ", hand2);
    }
}
