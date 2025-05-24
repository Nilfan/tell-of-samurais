import type { PresentType } from '../../../models';

export const charactersCardColorDict: Record<PresentType, string> = {
	type2_0: '#f3993f',
	type2_1: '#78f33f',
	type2_2: '#e01d1d',
	type3_0: '#1dd3e0',
	type3_1: '#1f850b',
	type4_0: '#210b85',
	type5_0: '#921de0'
};

export const charactersCardColor: { type: PresentType; color: string }[] = Object.keys(
	charactersCardColorDict
).map((type) => ({
	type: type as PresentType,
	color: charactersCardColorDict[type as PresentType]
}));
