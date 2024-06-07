import { cloneDeep } from "lodash";
import { Socket } from "socket.io";
import { ServerEvent } from "src/helpers/events";
import { PresentCard } from "src/models/presentCard.model";

export class TableManager {
    private socket: Socket;
    private table: PresentCard[] = [];

    constructor(socket: Socket) {
        this.socket = socket;
    }

    addCardToTable(cards: PresentCard[]): void {
        this.table = cloneDeep([...this.table, ...cards]);
        this.socket.emit(ServerEvent.UpdateTable, this.table);
    }

    getTable(): PresentCard[] {
        return cloneDeep(this.table);
    }
}
