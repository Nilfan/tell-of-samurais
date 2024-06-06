export type PresentType =
    | "flute"
    | "fan"
    | "scroll"
    | "umbrella"
    | "shamisen"
    | "teaSet"
    | "flower";

export const presentCountsDict: Record<PresentType, number> = {
    flute: 2,
    fan: 2,
    scroll: 2,
    umbrella: 3,
    shamisen: 3,
    teaSet: 4,
    flower: 5,
};

export const presentTypesArray = Object.keys(presentCountsDict);
