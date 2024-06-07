export enum ServerEvent {
	Connect = 'connect',
	UpdateHand = 'updateHand',
	InitPlayer = 'initPlayer',
	StartGame = 'startGame',
	UpdatePlayerActions = 'updatePlayerActions',
	ChangePlayerTurn = 'changePlayerTurn'
}

export enum ClientEvent {
	CreateRoom = 'createRoom',
	JoinGame = 'joinGame',
	ChatTest = 'chatTest',
	Disconnect = 'disconnect',
	PlayerMove = 'playerMove'
}
