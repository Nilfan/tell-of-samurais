import { PresentCard } from "../models/presentCard.model";
import { Player } from "./Player";
export declare class GameField {
    initialDeck: PresentCard[];
    deck: PresentCard[];
    outOfGameCard: PresentCard;
    player1: Player;
    player2: Player;
    constructor();
    startNewRound(): void;
}
