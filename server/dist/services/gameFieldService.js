"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameField = void 0;
const lodash_1 = require("lodash");
const presentsService_1 = require("./presentsService");
const Player_1 = require("./Player");
const INITIAL_HAND_CAPACITY = 10;
class GameField {
    constructor() {
        this.player1 = new Player_1.Player();
        this.player2 = new Player_1.Player();
    }
    startNewRound() {
        const deck = presentsService_1.presentsService.generateCardDeck();
        this.initialDeck = (0, lodash_1.cloneDeep)(deck);
        const hand1 = deck.splice(0, INITIAL_HAND_CAPACITY);
        const hand2 = deck.splice(1, INITIAL_HAND_CAPACITY);
        this.player1.updateHand(hand1);
        this.player2.updateHand(hand2);
        this.player1.resetActions();
        this.player2.resetActions();
    }
}
exports.GameField = GameField;
//# sourceMappingURL=GameFieldService.js.map