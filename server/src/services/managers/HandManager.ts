import { cloneDeep } from "lodash";
import { Socket } from "socket.io";
import { ServerEvent } from "../../helpers/events";
import { PresentCard } from "../../models/presentCard.model";

export class HandManager {
    private socket: Socket;
    private hand: PresentCard[];

    constructor(socket: Socket) {
        this.socket = socket;
    }

    updateHand(hand: PresentCard[]) {
        this.hand = cloneDeep(hand);
        this.socket.emit(ServerEvent.UpdateHand, this.hand);
    }

    deleteCardsFromHand(cards: PresentCard[]): void {
        const idsToDelete = cards.map((card) => card.id);
        const hand = this.hand.filter((item) => !idsToDelete.includes(item.id));
        this.updateHand(hand);
    }
}
