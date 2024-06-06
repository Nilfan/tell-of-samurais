"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const lodash_1 = require("lodash");
const getUuid_1 = require("../helpers/getUuid");
const events_1 = require("../helpers/events");
class Player {
    constructor() {
        this.id = (0, getUuid_1.getUuid)();
    }
    updateHand(hand) {
        this.hand = (0, lodash_1.cloneDeep)(hand);
        this.socket.emit(events_1.ServerEvent.UpdateHand, this.hand);
    }
    resetActions() {
        this.actionsAvailability = Object.values(Player)
            .filter((val) => +val !== val)
            .reduce((acc, action) => {
            acc[action] = true;
            return acc;
        }, {});
    }
    emitAvailableActions() {
        const availableActions = Object.entries(this.actionsAvailability)
            .filter(([_, availability]) => availability)
            .map(([action]) => action);
        this.socket.emit(events_1.ServerEvent.UpdatePlayerActions, availableActions);
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