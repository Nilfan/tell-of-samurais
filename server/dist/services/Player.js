"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const lodash_1 = require("lodash");
const getUuid_1 = require("../helpers/getUuid");
class Player {
    constructor(hand) {
        this.id = (0, getUuid_1.getUuid)();
        this.hand = (0, lodash_1.cloneDeep)(hand);
    }
    setSocket(socket) {
        this.socket = socket;
    }
    socketEmit(event, value) {
        try {
            this.socket.emit(event, JSON.stringify(value));
        }
        catch (error) {
            console.log("socketEmit error", error);
            this.socket.emit(event, value);
        }
    }
    isInited() {
        return !!this.socket;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map