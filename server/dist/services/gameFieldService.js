"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameField = void 0;
const lodash_1 = require("lodash");
const presentsService_1 = require("./presentsService");
const Player_1 = require("./Player");
const INITIAL_HAND_CAPACITY = 10;
class GameField {
    constructor() {
        const deck = presentsService_1.presentsService.generateCardDeck();
        this.initialDeck = (0, lodash_1.cloneDeep)(deck);
        const hand1 = deck.splice(0, INITIAL_HAND_CAPACITY);
        const hand2 = deck.splice(1, INITIAL_HAND_CAPACITY);
        this.player1 = new Player_1.Player(hand1);
        this.player2 = new Player_1.Player(hand2);
        // console.log("initialDeck :>> ", this.initialDeck);
        // console.log("outOfGameCard :>> ", this.outOfGameCard);
        // console.log("hand1 :>> ", hand1);
        // console.log("hand2 :>> ", hand2);
    }
}
exports.GameField = GameField;
//# sourceMappingURL=GameFieldService.js.map