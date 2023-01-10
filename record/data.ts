import { PlayerTurn as PlayerTurn, PieceType } from "../libs/shogi";

const keyLabel = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

function toIndex(key: string) {
  const i = key.substring(0, 1);
  const j = key.substring(1);

  const y = keyLabel.findIndex(value => value === i);
  const x = Number(j) - 1;
  return (x * 9) + y;
}

function toMap(data: { [key: string]: [PieceType, PlayerColor0]}) {
    const map = new Map<number, [PieceType, PlayerTurn]>();
    for (const key of Object.keys(data)) {
      const [ type, color ] = data[key];
      const i = toIndex(key)
      map.set(i, [type, color === 'B']);
    }
    return map;
}

type PlayerColor0 = 'B' | 'W';

/** 初期配置 */
const InitialPosition: Map<number, [PieceType, PlayerTurn]> = toMap({
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
