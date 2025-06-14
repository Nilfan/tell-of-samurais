import { writable, type Writable } from 'svelte/store';
import type { PresentCard } from '../models';
import type { Character } from '../models/character.model';
import { PlayerAction } from './playerAction';
import type { Socket } from 'socket.io-client';
import { ServerEvent, ClientEvent } from './events';

export class PlayerManager {
	hand: Writable<PresentCard[]> = writable([]);
	table: Writable<PresentCard[]> = writable([]);
	oppositeTable: Writable<PresentCard[]> = writable([]);
	availableActions: Writable<PlayerAction[]> = writable([]);
	playerTurn: Writable<boolean> = writable(false);
	characters: Writable<Character[]> = writable([]);
	currentTurn: Writable<string | null> = writable(null);
	gameStatus: Writable<'waiting' | 'playing' | 'ended'> = writable('waiting');
	winner: Writable<string | null> = writable(null);

	socket: Socket;

	constructor(socket: Socket) {
		this.socket = socket;
		this.initSubs();
	}

	initSubs() {
		this.socket.on(ServerEvent.UpdateHand, (response: PresentCard[]) => {
			const sortedResponse = this.sortCards(response || []);
			console.log('HAND :>> ', response);
			this.hand.set(sortedResponse);
		});

		this.socket.on(ServerEvent.UpdatePlayerActions, (response: PlayerAction[]) => {
			this.availableActions.set(response || []);
		});

		this.socket.on(ServerEvent.UpdateTable, (response: PresentCard[]) => {
			const sortedResponse = this.sortCards(response || []);
			this.table.set(sortedResponse);
		});

		this.socket.on(ServerEvent.UpdateOppositeTable, (response: PresentCard[]) => {
			const sortedResponse = this.sortCards(response || []);
			this.oppositeTable.set(sortedResponse);
		});

		this.socket.on(ServerEvent.UpdateCharacterStates, (response: Character[]) => {
			console.log('characters :>>', response);
			this.characters.set(response);
		});

		this.socket.on(ServerEvent.ChangePlayerTurn, (response: string) => {
			this.currentTurn.set(response);
			this.playerTurn.set(response === this.socket.id);
		});

		this.socket.on(ServerEvent.StartGame, () => {
			this.gameStatus.set('playing');
		});

		this.socket.on(
			ServerEvent.GameEnd,
			(response: { winner: string; player1Score: number; player2Score: number }) => {
				this.gameStatus.set('ended');
				this.winner.set(response.winner);
			}
		);
	}

	reset() {
		this.hand.set([]);
		this.availableActions.set([]);
		this.playerTurn.set(false);
		this.characters.set([]);
		this.currentTurn.set(null);
		this.gameStatus.set('waiting');
		this.winner.set(null);
	}

	makePlayerMove(action: PlayerAction, cards: PresentCard[]): void {
		this.socket.emit(ClientEvent.PlayerMove, { action, cards });
	}

	private sortCards(cards: PresentCard[]): PresentCard[] {
		return [...(cards || [])]
			.filter((c) => c && c.type !== undefined)
			.sort((a, b) => (a.type.toString() > b.type.toString() ? 1 : -1));
	}
}
