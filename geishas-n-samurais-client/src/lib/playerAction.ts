export enum PlayerAction {
	HoldSecretCard = 'HoldSecretCard',
	TripleChoose = 'TripleChoose',
	DoubleSplit = 'DoubleSplit',
	TwoCardsBlockTransition = 'TwoCardsBlockTransition'
}

const ActionsDictionary: Record<PlayerAction, string> = {
	HoldSecretCard: 'Hold a secret card',
	TripleChoose: 'Choose three cards',
	DoubleSplit: 'Split into two groups',
	TwoCardsBlockTransition: 'Block transition with two cards'
}

export const playerActionsCollection: PlayerAction[] = Object.keys(ActionsDictionary) as PlayerAction[];
