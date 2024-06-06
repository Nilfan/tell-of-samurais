import express, { Express } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { getUuid } from "./helpers/getUuid";
import { GameField } from "./services/GameFieldService";
import { attachPlayer } from "./attachPlayer";

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
    socket.on("createRoom", () => {
        const roomId = getUuid();
        (socket as any).playerName = "player_1";

        const gameField = new GameField();
        roomGameMap.set(roomId, gameField);

        attachPlayer(socket, gameField, roomId, gameField.player1);
    });

    socket.on("joinGame", (roomId: string) => {
        (socket as any).playerName = "player_2";
        console.log("roomId :>> ", roomId);

        const gameField = roomGameMap.get(roomId);

        if (!gameField) {
            socket.disconnect();
            return;
        }

        attachPlayer(socket, gameField, roomId, gameField.player2);

        socket.on("isInited", () => {
            io.to(roomId).emit("openGameField");
        });
    });
});

console.log("Server listening");
httpServer.listen(3000);
