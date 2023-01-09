import { Color, PieceType } from "../libs/shogi";

function toMap(data: { [key: string]: [PieceType, 'B' | 'W']}) {
    const map = new Map<string, [PieceType, 'B' | 'W']>();
    for (const key of Object.keys(data)) {
      map.set(key, data[key]);
    }
    return map;
}

const InitialPosition: Map<string, [PieceType, Color]> = toMap({
    'A1': ['香', 'W'],
    'A2': ['桂', 'W'],
    'A3': ['銀', 'W'],
    'A4': ['金', 'W'],
    'A5': ['玉', 'W'],
    'A6': ['金', 'W'],
    'A7': ['銀', 'W'],
    'A8': ['桂', 'W'],
    'A9': ['香', 'W'],

    'B2': ['角', 'W'],
    'B8': ['飛', 'W'],

    'C1': ['歩', 'W'],
    'C2': ['歩', 'W'],
    'C3': ['歩', 'W'],
    'C4': ['歩', 'W'],
    'C5': ['歩', 'W'],
    'C6': ['歩', 'W'],
    'C7': ['歩', 'W'],
    'C8': ['歩', 'W'],
    'C9': ['歩', 'W'],

    'G1': ['歩', 'B'],
    'G2': ['歩', 'B'],
    'G3': ['歩', 'B'],
    'G4': ['歩', 'B'],
    'G5': ['歩', 'B'],
    'G6': ['歩', 'B'],
    'G7': ['歩', 'B'],
    'G8': ['歩', 'B'],
    'G9': ['歩', 'B'],

    'H2': ['飛', 'B'],
    'H8': ['角', 'B'],

    'I1': ['香', 'B'],
    'I2': ['桂', 'B'],
    'I3': ['銀', 'B'],
    'I4': ['金', 'B'],
    'I5': ['王', 'B'],
    'I6': ['金', 'B'],
    'I7': ['銀', 'B'],
    'I8': ['桂', 'B'],
    'I9': ['香', 'B'],
});

export { InitialPosition };
