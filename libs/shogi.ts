import { XYArray } from "./geometry";

type PieceType = '歩' | '桂' | '香' | '角' | '飛' | '馬' | 'と' | '龍' | '銀' | '金' | '王' | '玉';

type PlayerTurn = true | false;

function inverse(positions: XYArray[]): XYArray[] {
  return positions.map(position => position.map(([x, y]) => [x, -y]))
}

const KingMove: XYArray[] = [
  [
    [-1, -1],
  ],
  [
    [-1, 0],
  ],
  [
    [-1, 1],
  ],
  [
    [0, -1],
  ],
  [
    [0, 1],
  ],
  [
    [1, -1],
  ],
  [
    [1, 0],
  ],
  [
    [1, 1],
  ]
];

const moveMap: Map<PieceType, XYArray[]> = new Map(Object.entries({
  '歩': [
    [
      [0, -1]
    ]
  ],
  '香': [
    [
      [0, -1],
      [0, -2],
      [0, -3],
      [0, -4],
      [0, -5],
      [0, -6],
      [0, -7],
      [0, -8],
    ],
  ],
  '桂': [
    [
      [1, -2],
    ],
    [
      [-1, -2],
    ],
  ],
  '飛': [
    [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
    ],
    [
      [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8],
    ],
    [
      [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0],
    ],
    [
      [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0],
    ],
  ],
  '角': [
    [
      [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8],
    ],
    [
      [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8],
    ],
    [
      [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8],
    ],
    [
      [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8],
    ],
  ],
  '銀': [
    [
      [-1, -1],
    ],
    [
      [-1, 1],
    ],
    [
      [0, -1],
    ],
    [
      [1, -1],
    ],
    [
      [1, 1],
    ],
  ],
  '金': [
    [
      [-1, 0],
    ],
    [
      [-1, -1],
    ],
    [
      [0, -1],
    ],
    [
      [1, -1],
    ],
    [
      [1, 0],
    ],
    [
      [0, 1],
    ]
  ],
  '王': KingMove,
  '玉': KingMove,
})) as Map<PieceType, XYArray[]>;
  
function getMoveCandidateList(piece: PieceType, turn: PlayerTurn) {
  const list = moveMap.get(piece) ?? [];
  return turn ? list : inverse(list);
}

function xyToIndex(x: number, y: number) {
  return (x * 9) + y;
}

type Game = {
  position: Map<number, [PieceType, PlayerTurn]>,
  pieceInHand: [Map<PieceType, number>, Map<PieceType, number>],
  move: number,
  turn: PlayerTurn,
}
  
export { getMoveCandidateList, xyToIndex }
export type { PieceType, PlayerTurn, Game }