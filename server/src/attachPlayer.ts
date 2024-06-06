import { Socket } from "socket.io";
import { GameField } from "./services/GameFieldService";
import { Player } from "./services/Player";
import { ServerEvent } from "./helpers/events";

export function attachPlayer(
    socket: Socket,
    gameField: GameField,
    roomId: string,
    player: Player,
): void {
    socket.join(roomId);

    socket.on("chatTest", (str) => console.log("chatTest :>> ", str));

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    player.setSocket(socket);

    socket.emit(ServerEvent.InitPlayer, {
        playerId: player.id,
        roomId,
    });

    console.log("attach " + (socket as any).playerName);

    if (
        [gameField.player1, gameField.player2].every((inst) => inst.isInited())
    ) {
        console.log("openGameField event");

        [gameField.player1, gameField.player2].forEach((player) => {
            player.socketEmit(ServerEvent.StartGame);
            player.socketEmit(ServerEvent.UpdateHand, player.hand);
        });

        gameField.startNewRound();
    }
}
