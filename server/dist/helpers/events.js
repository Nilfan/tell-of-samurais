"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEvent = exports.ServerEvent = void 0;
var ServerEvent;
(function (ServerEvent) {
    ServerEvent["Connect"] = "connect";
    ServerEvent["UpdateHand"] = "updateHand";
    ServerEvent["InitPlayer"] = "initPlayer";
    ServerEvent["StartGame"] = "startGame";
    ServerEvent["UpdatePlayerActions"] = "updatePlayerActions";
})(ServerEvent || (exports.ServerEvent = ServerEvent = {}));
var ClientEvent;
(function (ClientEvent) {
    ClientEvent["CreateRoom"] = "createRoom";
    ClientEvent["JoinGame"] = "joinGame";
})(ClientEvent || (exports.ClientEvent = ClientEvent = {}));
//# sourceMappingURL=events.js.map