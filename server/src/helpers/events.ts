export enum ServerEvent {
    Connect = "connect",
    UpdateHand = "updateHand",
    InitPlayer = "initPlayer",
    StartGame = "startGame",
    UpdatePlayerActions = "updatePlayerActions",
}

export enum ClientEvent {
    CreateRoom = "createRoom",
    JoinGame = "joinGame",
}
