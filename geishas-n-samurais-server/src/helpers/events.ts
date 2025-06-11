export enum ServerEvent {
    // entry data
    InitPlayer = "initPlayer",

    // system
    Connect = "connect",

    StartGame = "startGame",
    GameEnd = "gameEnd",

    // regular player update
    UpdateHand = "updateHand",
    UpdateTable = "updateTable",
    UpdateOppositeTable = "updateOppositeTable",
    UpdatePlayerActions = "updatePlayerActions",
    UpdateCharacterStates = "updateCharacterStates",
    ChangePlayerTurn = "changePlayerTurn",

    // exceptions
    WrongAction = "wrongAction",

    // choose request answering
    AskPlayerToChooseOneCard = "askPlayerToChooseOneCard",
    AskPlayerToChooseCoupleCards = "askPlayerToChooseCoupleCards",
    AskPlayerToChooseDoubleCards = "askPlayerToChooseDoubleCards",
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
