import { io, Socket } from 'socket.io-client';
import { writable, type Writable } from 'svelte/store';
import { ServerEvent, ClientEvent } from './events';
import type { PlayerAction } from './playerAction';
import type { PresentCard } from '../models';
import { gameManager } from './GameManager';

const serverAddress = 'http://localhost:3030';

class SocketService {
	socket: Socket;

	roomId: Writable<string | null> = writable(null);
	playerId: Writable<string | null> = writable(null);

	constructor() {
		this.socket = io(serverAddress, { transports: ['websocket'] });

		this.socket.on(ServerEvent.Connect, () => {});
	}

	reset(): void {
		this.roomId.set(null);
		this.playerId.set(null);
		gameManager.resePlayer();
	}

	emitPlayerMove(action: PlayerAction, cards: PresentCard[]): void {
		this.socket.emit(ClientEvent.PlayerMove, { action, cards });
	}

	createRoom(): Promise<void> {
		const promise = this.subscribeOnPlayerInit();
		gameManager.initNewPlayer(this.socket);

		this.socket.emit(ClientEvent.CreateRoom);
		return promise;
	}

	joinGame(roomId: string): Promise<void> {
		const promise = this.subscribeOnPlayerInit();
		gameManager.initNewPlayer(this.socket);

		this.socket.emit(ClientEvent.JoinGame, roomId);
		return promise;
	}

	subscribeOnGameStart(): Promise<void> {
		return new Promise<void>((res) => {
			this.socket.once(ServerEvent.StartGame, () => {
				console.log('StartGame event');

				res();
			});
		});
	}

	disconnect(): void {
		this.socket.disconnect();
	}

	private subscribeOnPlayerInit(): Promise<void> {
		return new Promise<void>((res) =>
			this.socket.once(ServerEvent.InitPlayer, ({ playerId, roomId }) => {
				this.playerId.set(playerId);
				this.roomId.set(roomId);
				res();
			})
		);
	}
}

export const socketService = new SocketService();
