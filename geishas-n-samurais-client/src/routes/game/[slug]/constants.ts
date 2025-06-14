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

export const characterInfo: Record<PresentType, { name: string; value: number }> = {
	type2_0: { name: 'Samurai', value: 2 },
	type2_1: { name: 'Ninja', value: 2 },
	type2_2: { name: 'Ronin', value: 2 },
	type3_0: { name: 'Shogun', value: 3 },
	type3_1: { name: 'Daimyo', value: 3 },
	type4_0: { name: 'Emperor', value: 4 },
	type5_0: { name: 'Dragon', value: 5 }
};

export const charactersCardColor: {
	type: PresentType;
	color: string;
	name: string;
	value: number;
}[] = Object.keys(charactersCardColorDict).map((type) => ({
	type: type as PresentType,
	color: charactersCardColorDict[type as PresentType],
	name: characterInfo[type as PresentType].name,
	value: characterInfo[type as PresentType].value
}));
