import { Socket } from "socket.io";
import { GameField } from "./services/GameFieldService";
import { Player } from "./services/Player";
export declare function attachPlayer(socket: Socket, gameField: GameField, roomId: string, player: Player): void;
