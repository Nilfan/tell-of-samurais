import { Socket } from "socket.io";
import { GameField } from "./services/GameFieldService";
import { Player } from "./services/Player";

export function attachPlayer(
    socket: Socket,
    gameField: GameField,
    roomId: string,
    player: Player,
): void {
    socket.emit("roomIdUpdate", roomId);
    socket.join(roomId);

    socket.on("chatTest", (str) => console.log("chatTest :>> ", str));

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    player.setSocket(socket);

    socket.send(
        "initPlayer",
        JSON.stringify({
            playerId: player.id,
            hand: player.hand,
        }),
    );

    console.log("attach " + (socket as any).playerName);

    if (
        [gameField.player1, gameField.player2].every((inst) => inst.isInited())
    ) {
        console.log("openGameField event");

        [gameField.player1, gameField.player2].forEach((player, index) => {
            player.socketEmit("openGameField");
            console.log(`Player ${index} :>> `, player);
            player.socketEmit("onHandUpdate", player.hand);
        });
    }
}
