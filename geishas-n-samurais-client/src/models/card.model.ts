import type { PresentType } from './presents.model';
import { presentCountsDict } from './presents.model';

export interface Card {
	id: string;
	type: PresentType;
}

export interface CardDeck {
	cards: Card[];
	remaining: Card[];
}

export function createCardDeck(): CardDeck {
	const cards: Card[] = [];
	let cardId = 0;

	// Create cards for each character type
	Object.entries(presentCountsDict).forEach(([type, count]) => {
		for (let i = 0; i < count; i++) {
			cards.push({
				id: `card_${cardId++}`,
				type: type as PresentType
			});
		}
	});

	return {
		cards,
		remaining: [...cards]
	};
}

export function dealCards(deck: CardDeck, playerCount: number = 2): Card[][] {
	const hands: Card[][] = Array(playerCount)
		.fill(null)
		.map(() => []);
	const cardsPerPlayer = 10;

	// Shuffle remaining cards
	const shuffled = [...deck.remaining].sort(() => Math.random() - 0.5);

	// Deal cards to each player
	for (let i = 0; i < playerCount; i++) {
		for (let j = 0; j < cardsPerPlayer; j++) {
			const card = shuffled[i * cardsPerPlayer + j];
			if (card) {
				hands[i].push(card);
			}
		}
	}

	// Update remaining cards
	deck.remaining = shuffled.slice(playerCount * cardsPerPlayer);

	return hands;
}
