import { cloneDeep } from "lodash";
import { Socket } from "socket.io";
import { getUuid } from "../helpers/getUuid";
import { PresentCard } from "../models/presentCard.model";

export class Player {
    secretCard: PresentCard;
    hand: PresentCard[];
    id = getUuid();

    private socket: Socket;

    constructor(hand: PresentCard[]) {
        this.hand = cloneDeep(hand);
    }

    setSocket(socket: Socket): void {
        this.socket = socket;
    }

    socketEmit(event: string, value?: any): void {
        try {
            this.socket.emit(event, JSON.stringify(value));
        } catch (error) {
            console.log("socketEmit error", error);
            this.socket.emit(event, value);
        }
    }

    isInited(): boolean {
        return !!this.socket;
    }
}
