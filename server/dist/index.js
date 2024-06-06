"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const getUuid_1 = require("./helpers/getUuid");
const GameFieldService_1 = require("./services/GameFieldService");
const attachPlayer_1 = require("./attachPlayer");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
});
const roomGameMap = new Map();
io.on("connection", (socket) => {
    socket.on("createRoom", () => {
        const roomId = (0, getUuid_1.getUuid)();
        socket.playerName = "player_1";
        const gameField = new GameFieldService_1.GameField();
        roomGameMap.set(roomId, gameField);
        (0, attachPlayer_1.attachPlayer)(socket, gameField, roomId, gameField.player1);
    });
    socket.on("joinGame", (roomId) => {
        socket.playerName = "player_2";
        console.log("roomId :>> ", roomId);
        const gameField = roomGameMap.get(roomId);
        if (!gameField) {
            socket.disconnect();
            return;
        }
        (0, attachPlayer_1.attachPlayer)(socket, gameField, roomId, gameField.player2);
        socket.on("isInited", () => {
            io.to(roomId).emit("openGameField");
        });
    });
});
console.log("Server listening");
httpServer.listen(3000);
//# sourceMappingURL=index.js.map