import { indexToLabel, xyToLabel } from "./components/GameRecordList";
import { XY, XYArray } from "./geometry";

type PlayerTurn = true | false;

type PieceType = '歩' | '桂' | '香' | '角' | '飛' | '銀' | '金' | '王' | '玉' | 'と' | '成香' | '成桂' | '成銀' | '馬' | '龍';

type BehaviorType = '成' | '不成' | '' | '打';

type GameRecord = {
  move: number, // index
  x: number,
  y: number,
  piece: PieceType,
  turn: PlayerTurn, // true: 先手, false: 後手
  behavior?: BehaviorType,  // true: 成り, false: 不成, undefined: 未選択
}

type PiecePosition = {
  type: PieceType,
  turn: boolean,
}

type Game = {
  position: Map<number, PiecePosition>,
  pieceInHand: [Map<PieceType, number>, Map<PieceType, number>],
  move: number,
  turn: PlayerTurn,
  records: GameRecord[],
}

const yLabels = ['一', '二', '三', '四', '五', '六', '七', '八', '九'] as const;

const CapturablePieceList: readonly PieceType[] = [
  '歩',
  '桂',
  '香',
  '角',
  '飛',
  '銀',
  '金',
] as const;

const promotablePieceSet: Set<PieceType> = new Set([
  '歩',
  '桂',
  '香',
  '角',
  '飛',
  '銀',
] satisfies PieceType[]);

function yToLabel(y: number) {
  return yLabels[y];
}

function xToLabel(x: number) {
  return `${x+1}`;
}


function inverse(positions: readonly XYArray[]): XYArray[] {
  return positions.map(position => position.map(([x, y]) => [x, -y]))
}

const RookMove: readonly XYArray[] = [
  [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8]],
  [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]],
  [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]],
  [[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0]],
] as const;

const BishopMove: readonly XYArray[] = [
  [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8]],
  [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8]],
  [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8]],
  [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8]],
] as const;

const GoldMove: readonly XYArray[] = [
  [[-1, 0]],
  [[-1, -1]],
  [[0, -1]],
  [[1, -1]],
  [[1, 0]],
  [[0, 1]]
] as const;

const KingMove: readonly XYArray[] = [
  [[-1, -1]],
  [[-1, 0]],
  [[-1, 1]],
  [[0, -1]],
  [[0, 1]],
  [[1, -1]],
  [[1, 0]],
  [[1, 1]],
] as const;

const moveMap: Map<PieceType, readonly XYArray[]> = new Map([
  [ '歩', [ [[0, -1]] ] ],
  [
    '香',
    [
      [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]],
    ],
  ],
  [
    '桂',
    [
      [[1, -2]],
      [[-1, -2]],
    ],
  ],
  [
    '銀',
    [
      [[-1, -1]],
      [[-1, 1]],
      [[0, -1]],
      [[1, -1]],
      [[1, 1]],
    ],
  ],
  ['金', GoldMove],
  ['と', GoldMove],
  ['成香', GoldMove],
  ['成桂', GoldMove],
  ['成銀', GoldMove],
  ['飛', RookMove],
  ['角', BishopMove],
  [
    '馬',
    [
      ...BishopMove,
      [[-1, 0]],
      [[0, -1]],
      [[0, 1]],
      [[1, 0]],
    ],
  ],
  [
    '龍',
    [
      ...RookMove,
      [[-1, -1]],
      [[-1, 1]],
      [[1, -1]],
      [[1, 1]],
    ],
  ],
  ['王', KingMove],
  ['玉', KingMove],
]);

const promoteMap = new Map<PieceType, PieceType>([
  ['歩', 'と'],
  ['香', '成香'],
  ['桂', '成桂'],
  ['銀', '成銀'],
  ['飛', '龍'],
  ['角', '馬'],
]);

function promote(type: PieceType) {
  return promoteMap.get(type);
}

function isPromotable(lastRecord: GameRecord | null | undefined): lastRecord is GameRecord {
  if (lastRecord == null) return false;

  const { piece, y, turn, behavior } = lastRecord;
  if (behavior != null) return false;
  if (!promotablePieceSet.has(piece)) return false;

  return turn ? (y <= 2) : (y >= 6);
}

function getMoveRangeList(piece: PieceType, turn: PlayerTurn) {
  const list = moveMap.get(piece) ?? [];
  return turn ? list : inverse(list);
}

function xyToIndex(x: number, y: number) {
  return (x * 9) + y;
}

function indexToXY(index: number): [number, number] {
  const x = Math.floor(index / 9);
  const y = index % 9;
  return [x, y];
}

function isKind(piece: PieceType) {
  return piece === '王' || piece === '玉';
}

function searchKingIndex(position: Map<number, PiecePosition>, turn: PlayerTurn) {
  for (const [index, {type: p, turn: t}] of position) {
    if (t === turn && isKind(p)) {
      return indexToXY(index);
    }
  }
  throw new Error();
}

/** 王手 */
function isCheck(game: Game, turn0: PlayerTurn): boolean {
  const { position } = game;

  const [kingX, kingY] = searchKingIndex(position, !turn0);
  for (const [index, {type: piece, turn}] of position) {
    if (turn !== turn0) continue;

    const [x0, y0] = indexToXY(index);

    const moveRangeList = getMoveRangeList(piece, turn);
    for (const moveRange of moveRangeList) {
      for (const [dx, dy] of moveRange) {
        const x = x0 + dx;
        const y = y0 + dy;
        if (x < 0 || x >= 9 || y < 0 || y >= 9) {
          break;
        }
      
        const moveIndex = xyToIndex(x, y);

        if (x === kingX && y === kingY) {
          return true;
        }
        if (position.has(moveIndex)) {
          break;
        }
      }
    }
  }
  return false;
}

/**
 * TODO 詰みの判定
 */
function isCheckmate(game: Game): boolean {
  const { turn } = game;
  return isCheck(game, turn);
}

type PieceSelection = InHandPieceSelection | BoardPieceSelection;

type BoardPieceSelection = {
  index: number,
  piece: PieceType,
  turn: PlayerTurn,
};

type InHandPieceSelection = {
  index: null,
  piece: PieceType,
  turn: PlayerTurn,
};

function movePiece(game: Game, selection: PieceSelection, nextIndex: number): Game {
  const { index, piece, turn } = selection;
  const {
    position,
    pieceInHand: [sentePieceInHand, gotePieceInHand],
    records
  } = game;

  const newPosition = new Map(position);
  const newSentePieceInHand = new Map(sentePieceInHand);
  const newGotePieceInHand = new Map(gotePieceInHand);

  const captured = position.get(nextIndex);
  if (captured != null) {
    const { type: capturedType, turn: capturedTurn } = captured;
    if (turn === capturedTurn) {
      console.log(captured);
      throw new Error(`${piece}: ${index && indexToLabel(index)} => ${indexToLabel(nextIndex)}`);
    }

    if (turn) {
      const prevCount = newSentePieceInHand.get(capturedType) ?? 0;
      newSentePieceInHand.set(capturedType, prevCount + 1);
    } else {
      const prevCount = newGotePieceInHand.get(capturedType) ?? 0;
      newGotePieceInHand.set(capturedType, prevCount + 1);
    }
  }

  if (index != null) {
    newPosition.delete(index);
  } else {
    // in hand piece
  }
  newPosition.set(nextIndex, { type: piece, turn } satisfies PiecePosition);

  const nextMove = game.move + 1;

  const [x, y] = indexToXY(nextIndex);
  const newRecord: GameRecord = {
    x,
    y,
    turn,
    piece,
    move: nextMove,
  }
  return {
    turn: !game.turn,
    move: nextMove,
    position: newPosition,
    pieceInHand: [newSentePieceInHand, newGotePieceInHand],
    records: [...records, newRecord],
  }
}


function updatePromotion(lastRecord: GameRecord, position: Map<number, PiecePosition>): Map<number, PiecePosition> {
  const { x, y, piece, turn, behavior } = lastRecord;
  if (behavior !== '成') {
    return position;
  }

  const index = xyToIndex(x, y);
  const promotedPiece = promote(piece);
  if (promotedPiece == null) throw new Error();

  const newPosition = new Map(position);
  newPosition.set(index, { type: promotedPiece, turn });
  return newPosition;
}

export { CapturablePieceList, isCheck, isCheckmate, getMoveRangeList, xyToIndex, indexToXY, promote, isPromotable, xToLabel, yToLabel, movePiece, updatePromotion }
export type { PieceType, PlayerTurn, Game, GameRecord, PiecePosition, PieceSelection }
