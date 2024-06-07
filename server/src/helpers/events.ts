export enum ServerEvent {
    // entry data
    InitPlayer = "initPlayer",

    // system
    Connect = "connect",

    StartGame = "startGame",

    // regular player update
    UpdateHand = "updateHand",
    UpdateTable = "updateTable",
    UpdatePlayerActions = "updatePlayerActions",
    ChangePlayerTurn = "changePlayerTurn",

    // exceptions
    WrongAction = "wrongAction",

    // choose request answering
    AskPlayerToChooseOneCard = "askPlayerToChooseOneCard",
    AskPlayerToChooseCounpleCards = "askPlayerToChooseCounpleCards",
}

export enum ClientEvent {
    // entry
    CreateRoom = "createRoom",
    JoinGame = "joinGame",

    // system
    ChatTest = "chatTest",
    Disconnect = "disconnect",

    // actions
    PlayerMove = "playerMove",
    ChooseOneCard = "chooseOneCard",
    ChooseCoupleCards = "chooseCoupleCards",
}
