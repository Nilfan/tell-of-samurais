"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPlayer = void 0;
const events_1 = require("./helpers/events");
function attachPlayer(socket, gameField, roomId, player) {
    socket.join(roomId);
    socket.on("chatTest", (str) => console.log("chatTest :>> ", str));
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    player.setSocket(socket);
    socket.emit(events_1.ServerEvent.InitPlayer, {
        playerId: player.id,
        roomId,
    });
    console.log("attach " + socket.playerName);
    if ([gameField.player1, gameField.player2].every((inst) => inst.isInited())) {
        console.log("openGameField event");
        [gameField.player1, gameField.player2].forEach((player) => {
            player.socketEmit(events_1.ServerEvent.StartGame);
            player.socketEmit(events_1.ServerEvent.UpdateHand, player.hand);
        });
        gameField.startNewRound();
    }
}
exports.attachPlayer = attachPlayer;
//# sourceMappingURL=attachPlayer.js.map