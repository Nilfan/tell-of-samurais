import { cloneDeep } from "lodash";
import { Socket } from "socket.io";
import { ServerEvent } from "../../helpers/events";
import { PresentCard } from "../../models/presentCard.model";

export class TableManager {
    private socket: Socket;
    private table: PresentCard[] = [];
    private oppositeTableUpdater: (cards: PresentCard[]) => void;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    setUpdateOppositeTableUpdater(
        updater: (cards: PresentCard[]) => void,
    ): void {
        this.oppositeTableUpdater = updater;
    }

    addCardToTable(cards: PresentCard[]): void {
        this.table = cloneDeep([...this.table, ...cards]);
        this.socket.emit(ServerEvent.UpdateTable, this.table);
        if (this.oppositeTableUpdater) {
            this.oppositeTableUpdater(this.table);
        } else {
            console.error("Opposite table updater not defined");
        }
    }

    getTable(): PresentCard[] {
        return cloneDeep(this.table);
    }
}
