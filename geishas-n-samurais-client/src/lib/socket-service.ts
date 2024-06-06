import { io, Socket } from 'socket.io-client';
import { writable, type Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import {
	type CoreContextType,
	type PlayerContextType,
	CORE_CONTEXT,
	PLAYER_CONTEXT
} from '../models';
import { playerService } from './player-service';
import { goto } from '$app/navigation';

const serverAddress = 'http://localhost:3000';

class SocketService {
	socket: Socket;

	roomId: Writable<string | null> = writable(null);
	playerId: Writable<string | null> = writable(null);
	allPlayersReadyEmitter: Writable<boolean> = writable(false);

	constructor() {
		this.socket = io(serverAddress, { transports: ['websocket'] });
		this.initSubs();
	}

	reset(): void {
		this.roomId.set(null);
		this.playerId.set(null);
		this.allPlayersReadyEmitter.set(false);
	}

	initSubs() {
		this.socket.on('connect', () => this.onConnected());

		this.socket.on('roomIdUpdate', (roomId) => {
			this.roomId.set(roomId);
		});

		this.socket.on('onHandUpdate', (response) => {
			console.log('onHandUpdate', response);
			playerService.hand.set(response);
		});

		this.socket.on('initPlayer', (playerId) => {
			this.playerId.set(playerId);
		});

		this.socket.on('openGameField', () => this.allPlayersReadyEmitter.set(true));
	}

	createRoom() {
		this.socket.emit('createRoom');
	}

	joinGame(roomId: string) {
		this.socket.emit('joinGame', roomId);
	}

	private onConnected() {
		console.log('Connection successfuly created');
	}
}

export const socketService = new SocketService();
