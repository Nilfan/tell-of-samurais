export type PresentType =
    | "type2_0"
    | "type2_1"
    | "type2_2"
    | "type3_0"
    | "type3_1"
    | "type4_0"
    | "type5_0";

export const presentCountsDict: Record<PresentType, number> = {
    type2_0: 2,
    type2_1: 2,
    type2_2: 2,
    type3_0: 3,
    type3_1: 3,
    type4_0: 4,
    type5_0: 5,
};

export const presentTypesArray = Object.keys(presentCountsDict);
