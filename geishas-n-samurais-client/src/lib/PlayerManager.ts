import { writable, type Writable } from 'svelte/store';
import type { PresentCard } from '../models';
import type { Character } from '../models/character.model';
import { PlayerAction } from './playerAction';
import { socketService } from './socket-service';
import type { Socket } from 'socket.io-client';
import { ServerEvent } from './events';

export class PlayerManager {	hand: Writable<PresentCard[]> = writable([]);
	table: Writable<PresentCard[]> = writable([]);
	oppositeTable: Writable<PresentCard[]> = writable([]);
	availableActions: Writable<PlayerAction[]> = writable([]);
	playerTurn: Writable<boolean> = writable(false);
	characters: Writable<Character[]> = writable([]);

	socket: Socket;

	constructor(socket: Socket) {
		this.socket = socket;
		this.initSubs();
	}
	initSubs() {
		this.socket.on(ServerEvent.UpdateHand, (response: PresentCard[]) => {
			this.hand.set(response);
		});

		this.socket.on(ServerEvent.UpdatePlayerActions, (response: PlayerAction[]) => {
			console.log('UpdatePlayerActions :>>', response);
			this.availableActions.set(response);
		});

		this.socket.on(ServerEvent.UpdateTable, (response: PresentCard[]) => {
			this.table.set(response);
		});

		this.socket.on(ServerEvent.UpdateOppositeTable, (response: PresentCard[]) => {
			this.oppositeTable.set(response);
		});

		this.socket.on(ServerEvent.UpdateCharacterStates, (response: Character[]) => {
			this.characters.set(response);
		});

		this.socket.on(ServerEvent.ChangePlayerTurn, (response: boolean) => {
			this.playerTurn.set(response);
		});

		this.socket.on(ServerEvent.GameEnd, (response: { winner: string, player1Score: number, player2Score: number }) => {
			console.log('Game ended', response);
			// Handle game end through state management or navigation
		});
	}

	reset() {
		this.hand.set([]);
		this.availableActions.set([]);
		this.playerTurn.set(false);
		this.characters.set([]);
	}
	makePlayerMove(action: PlayerAction, cards: PresentCard[]): void {
		socketService.emitPlayerMove(action, cards);
	}
}
