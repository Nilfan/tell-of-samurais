"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presentsService = void 0;
const presents_model_1 = require("../models/presents.model");
const getUuid_1 = require("../helpers/getUuid");
class PresentsService {
    constructor() { }
    generateCardDeck() {
        const deck = [];
        Object.entries(presents_model_1.presentCountsDict).forEach(([cardType, count]) => {
            for (let i = 0; i < count; i++) {
                const card = {
                    type: cardType,
                    id: (0, getUuid_1.getUuid)(),
                };
                deck.push(card);
            }
        });
        this.shuffleDeck(deck);
        return deck;
    }
    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
}
exports.presentsService = new PresentsService();
//# sourceMappingURL=presentsService.js.map