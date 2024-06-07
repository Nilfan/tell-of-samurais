import { cloneDeep } from "lodash";
import { Socket } from "socket.io";
import { getUuid } from "../helpers/getUuid";
import { PresentCard } from "../models/presentCard.model";
import { PlayerAction } from "../helpers/playerActions";
import { ServerEvent } from "../helpers/events";
import { PresentType } from "src/models/presents.model";

export class Player {
    secretCard: PresentCard = null;
    blokedPresentTypes: PresentType[] = [];
    hand: PresentCard[];
    id = getUuid();
    table: PresentCard[] = [];

    private socket: Socket;
    private actionsAvailability: Record<PlayerAction, boolean>;

    updateHand(hand: PresentCard[]) {
        this.hand = cloneDeep(hand);
        this.socket.emit(ServerEvent.UpdateHand, this.hand);
    }

    resetActions() {
        this.actionsAvailability = Object.values(Player)
            .filter((val) => +val !== val)
            .reduce((acc, action) => {
                acc[action] = true;
                return acc;
            }, {});
    }

    isActionAvailable(action: PlayerAction): boolean {
        return this.actionsAvailability[action];
    }

    holdSecretCard(card: PresentCard): void {
        this.secretCard = card;

        this.deleteCardsFromHand([card]);
    }

    holdBlockCardTypes(cards: PresentCard[]): void {
        const cardTypesSet = new Set<PresentType>();
        cards.forEach(({ type }) => cardTypesSet.add(type));
        this.blokedPresentTypes = Array.from(cardTypesSet);

        this.deleteCardsFromHand(cards);
    }

    emitAvailableActions() {
        const availableActions = Object.entries(this.actionsAvailability)
            .filter(([_, availability]) => availability)
            .map(([action]) => action);
        this.socket.emit(ServerEvent.UpdatePlayerActions, availableActions);
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

    private deleteCardsFromHand(cards: PresentCard[]): void {
        const idsToDelete = cards.map((card) => card.id);
        const hand = this.hand.filter((item) => !idsToDelete.includes(item.id));
        this.updateHand(hand);
    }
}
