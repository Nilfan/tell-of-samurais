import { cloneDeep } from "lodash";
import { Socket } from "socket.io";
import { getUuid } from "../helpers/getUuid";
import { PresentCard } from "../models/presentCard.model";
import { PlayerAction } from "../helpers/playerActions";
import { ClientEvent, ServerEvent } from "../helpers/events";
import { PresentType } from "src/models/presents.model";
import { TableManager } from "./managers/TableManager";
import { HandManager } from "./managers/HandManager";
import { AvailableActionsManager } from "./managers/AvailableActionsManager";

export class Player {
    secretCard: PresentCard = null;
    blokedPresentTypes: PresentType[] = [];
    id = getUuid();

    tableManager: TableManager;
    handManager: HandManager;
    actionsManager: AvailableActionsManager;

    private socket: Socket;

    get isInited(): boolean {
        return !!this.socket;
    }

    constructor(socket: Socket) {
        this.socket = socket;
        this.tableManager = new TableManager(socket);
        this.handManager = new HandManager(socket);
        this.actionsManager = new AvailableActionsManager(socket);
    }

    stopMoving(): void {
        this.socket.emit(ServerEvent.ChangePlayerTurn, false);
    }

    startMoving(): void {
        this.socket.emit(ServerEvent.ChangePlayerTurn, true);
    }

    holdSecretCard(card: PresentCard): void {
        this.secretCard = card;

        this.handManager.deleteCardsFromHand([card]);
    }

    holdBlockCardTypes(cards: PresentCard[]): void {
        const cardTypesSet = new Set<PresentType>();
        cards.forEach(({ type }) => cardTypesSet.add(type));
        this.blokedPresentTypes = Array.from(cardTypesSet);

        this.handManager.deleteCardsFromHand(cards);
    }

    socketEmit(event: string, value?: any): void {
        try {
            this.socket.emit(event, JSON.stringify(value));
        } catch (error) {
            console.log("socketEmit error", error);
            this.socket.emit(event, value);
        }
    }

    subscribeOnEvent<T>(event: ClientEvent): Promise<T> {
        return new Promise((res) => {
            this.socket.once(event, (response) => res(response));
        });
    }
}
