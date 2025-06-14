import express, { Express } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { getUuid } from "./helpers/getUuid";
import { GameField } from "./services/GameFieldService";
import { attachPlayer } from "./attachPlayer";
import { ClientEvent } from "./helpers/events";
import { ServerEvent } from "./helpers/events";

const app: Express = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
});

const roomGameMap = new Map();

io.on("connection", (socket: Socket) => {
    socket.on(ClientEvent.CreateRoom, () => {
        const roomId = getUuid();
        (socket as any).playerName = "player_1";

        const gameField = new GameField();

        gameField.addFirstPlayer(socket);
        roomGameMap.set(roomId, gameField);

        attachPlayer(socket, gameField, roomId, gameField.player1);
    });

    socket.on(ClientEvent.JoinGame, (roomId: string) => {
        (socket as any).playerName = "player_2";
        console.log("roomId :>> ", roomId);

        const gameField = roomGameMap.get(roomId);

        if (!gameField) {
            socket.disconnect();
            return;
        }

        gameField.addSecondPlayer(socket);
        attachPlayer(socket, gameField, roomId, gameField.player2);

        // Initialize game after both players have joined
        try {
            gameField.setOppositeTablesUpdaters();
            gameField.startNewRound();
            console.log("Game started successfully");
        } catch (error) {
            console.error("Failed to start game:", error);
            // Notify both players about the error
            gameField.player1.socketEmit(
                ServerEvent.GameError,
                "Failed to start game",
            );
            gameField.player2.socketEmit(
                ServerEvent.GameError,
                "Failed to start game",
            );
        }
    });
});

console.log("Server listening");
httpServer.listen(3030);
