import { PresentCard } from "../models/presentCard.model";
import { presentCountsDict, PresentType } from "../models/presents.model";
import { getUuid } from "../helpers/getUuid";

class PresentsService {
    constructor() {}

    generateCardDeck(): PresentCard[] {
        const deck = [];

        Object.entries(presentCountsDict).forEach(([cardType, count]) => {
            for (let i = 0; i < count; i++) {
                const card: PresentCard = {
                    type: cardType as PresentType,
                    id: getUuid(),
                };

                deck.push(card);
            }
        });

        this.shuffleDeck(deck);

        return deck;
    }

    shuffleDeck(deck: PresentCard[]): void {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
}

export const presentsService = new PresentsService();
