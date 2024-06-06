import { PresentCard } from "src/models/presentCard.model";
export declare class Player {
    secretCard: PresentCard;
    hand: PresentCard[];
    constructor(hand: PresentCard[]);
}
