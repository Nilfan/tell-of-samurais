import { describe, it, expect } from 'vitest';
import { PlayerAction, playerActionsCollection } from './playerAction';

describe('PlayerAction', () => {
	it('should have all required actions', () => {
		expect(playerActionsCollection).toContain(PlayerAction.HoldSecretCard);
		expect(playerActionsCollection).toContain(PlayerAction.TripleChoose);
		expect(playerActionsCollection).toContain(PlayerAction.DoubleSplit);
		expect(playerActionsCollection).toContain(PlayerAction.TwoCardsBlockTransition);
	});

	it('should have correct number of actions', () => {
		expect(playerActionsCollection.length).toBe(4);
	});

	it('should have unique values', () => {
		const uniqueValues = new Set(playerActionsCollection);
		expect(uniqueValues.size).toBe(playerActionsCollection.length);
	});
});
