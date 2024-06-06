import { PresentCard } from "../models/presentCard.model";
declare class PresentsService {
    constructor();
    generateCardDeck(): PresentCard[];
    shuffleDeck(deck: PresentCard[]): void;
}
export declare const presentsService: PresentsService;
export {};
