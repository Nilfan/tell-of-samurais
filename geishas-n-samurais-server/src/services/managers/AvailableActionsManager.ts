import { Socket } from "socket.io";
import { ServerEvent } from "../../helpers/events";
import { PlayerAction } from "../../helpers/playerActions";

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
        this.actionsAvailability = Object.values(PlayerAction).reduce(
            (acc, action) => {
                acc[action] = true;
                return acc;
            },
            {} as Record<PlayerAction, boolean>,
        );

        console.log("this.actionsAvailability :>> ", this.actionsAvailability);

        this.emitAvailableActions();
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
