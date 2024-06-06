import { Socket } from "socket.io";
import { PresentCard } from "../models/presentCard.model";
export declare class Player {
    secretCard: PresentCard;
    hand: PresentCard[];
    id: string;
    private socket;
    private actionsAvailability;
    updateHand(hand: PresentCard[]): void;
    resetActions(): void;
    emitAvailableActions(): void;
    setSocket(socket: Socket): void;
    socketEmit(event: string, value?: any): void;
    isInited(): boolean;
}
