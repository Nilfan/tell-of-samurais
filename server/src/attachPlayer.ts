import { Socket } from "socket.io";
import { GameField } from "./services/GameFieldService";
import { Player } from "./services/Player";
import { ClientEvent, ServerEvent } from "./helpers/events";
import { PlayerAction } from "./helpers/playerActions";
import { PresentCard } from "./models/presentCard.model";

export function attachPlayer(
    socket: Socket,
    gameField: GameField,
    roomId: string,
    player: Player,
): void {
    player.setSocket(socket);
    socket.join(roomId);

    subscribePlayer(socket, player, gameField);

    socket.emit(ServerEvent.InitPlayer, {
        playerId: player.id,
        roomId,
    });

    console.log("attach " + (socket as any).playerName);

    if (gameField.player1.isInited() && gameField.player2.isInited()) {
        console.log("openGameField event");
        gameField.player1.socketEmit(ServerEvent.StartGame);
        gameField.player2.socketEmit(ServerEvent.StartGame);

        gameField.startNewRound();
    }
}

function subscribePlayer(
    socket: Socket,
    player: Player,
    gameField: GameField,
): void {
    socket.on(ClientEvent.ChatTest, (str) => console.log("chatTest :>> ", str));

    socket.on(ClientEvent.Disconnect, () => {
        console.log("user disconnected");
    });

    socket.on(
        ClientEvent.PlayerMove,
        ({ action, cards }: { action: PlayerAction; cards: PresentCard[] }) => {
            gameField.proceedPlayerMove(player, action, cards);
        },
    );
}
