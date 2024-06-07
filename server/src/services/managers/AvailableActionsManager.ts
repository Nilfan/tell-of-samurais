import { Socket } from "socket.io";
import { ServerEvent } from "src/helpers/events";
import { PlayerAction } from "src/helpers/playerActions";
import { Player } from "../Player";

export class AvailableActionsManager {
    private socket: Socket;
    private actionsAvailability: Record<PlayerAction, boolean>;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    closeActionAvailability(action: PlayerAction): void {
        this.actionsAvailability[action] = false;
        this.emitAvailableActions();
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
        this.socket.emit(ServerEvent.UpdatePlayerActions, availableActions);
    }

    isActionAvailable(action: PlayerAction): boolean {
        return this.actionsAvailability[action];
    }
}
