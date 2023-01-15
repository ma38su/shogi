import { xyToLabel } from "./components/GameRecordList";
import { Game, GameRecord, getMoveRangeList, indexToXY, isCheck, isPromotable, movePiece, PiecePosition, PieceSelection, PieceType, PlayerTurn, promote, updatePromotion, xyToIndex } from "./shogi";

type PlayerMode = 'Player' | 'AI';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function choiceRandom<T>(array: readonly T[]) {
  const i = getRandomInt(array.length);
  return array[i];
}

type Candidate = [PieceType, number, number];

function calculateNextMove(game: Game): Candidate {
  const moveCandidates = generateNextMoveCandidates(game);

  const { position, turn, pieceInHand } = game;

  let bestScore = Number.NEGATIVE_INFINITY;
  let bestCandidates: Candidate[] = moveCandidates;

  for (const candidate of moveCandidates) {
    const candidatePieceInHand = pieceInHand;

    const [pieceType, prevIndex, nextIndex] = candidate;

    const candidatePosition = new Map(position);
    candidatePosition.delete(prevIndex);

    const position1 = candidatePosition.get(nextIndex);
    if (position1 != null) {
      const { turn: turn1, type } = position1;
      if (turn === turn1) throw new Error();

      if (turn) {
        const nextPieceInHand = new Map(candidatePieceInHand[0]);
        nextPieceInHand.set(type, (nextPieceInHand.get(type) ?? 0) + 1);
        candidatePieceInHand[0] = nextPieceInHand;
      } else {
        const nextPieceInHand = new Map(candidatePieceInHand[1]);
        nextPieceInHand.set(type, (nextPieceInHand.get(type) ?? 0) + 1);
        candidatePieceInHand[1] = nextPieceInHand;
      }
    }
    candidatePosition.set(nextIndex, { type: pieceType, turn });
    if (isCheck(candidatePosition, !turn)) {
      // 王手になるので除外
      continue;
    }

    const nextScore = calculateScore(candidatePosition, candidatePieceInHand, turn);
    if (bestScore < nextScore) {
      bestScore = nextScore;
      bestCandidates = [candidate];
    } else if (bestScore === nextScore) {
      bestCandidates.push(candidate);
    }
  }

  const nextMove = choiceRandom(bestCandidates);
  return nextMove;
}

function moveNextByAi(game: Game) {
  const [piece, index, nextIndex] = calculateNextMove(game);
  const { turn } = game;
  const selection: PieceSelection = { piece, index, turn };
  
  const nextGame = movePiece(game, selection, nextIndex);
  const { records, position } = nextGame;
  const lastRecord = records.length > 0 ? records[records.length - 1] : null;
  if (!isPromotable(lastRecord)) {
    return nextGame;
  }

  const promoted = true;
  const promotedLastRecord = {
    ...records[records.length - 1],
    behavior: promoted ? '成' : '不成'
  } satisfies GameRecord;

  const newPosition = updatePromotion(lastRecord, position);
  return {
    ...nextGame,
    records: [...records.slice(0, records.length - 1), promotedLastRecord],
    position: newPosition
  };
}

function generateNextMoveCandidates(game: Game): [PieceType, number, number][] {

  const { position, turn } = game;

  const results: [PieceType, number, number][] = [];
  for (const [index, piecePosition] of position) {
    const { type: pieceType, turn: pieceTurn } = piecePosition;
    if (turn !== pieceTurn) {
      continue;
    }

    const candidateTable = getMoveRangeList(pieceType, pieceTurn);
    const [x0, y0] = indexToXY(index);

    for (const candidates of candidateTable) {
      for (const [dx, dy] of candidates) {
        const x = x0 + dx;
        const y = y0 + dy;
        if (x < 0 || x >= 9 || y < 0 || y >= 9) {
          break;
        }

        const index1 = xyToIndex(x, y);
        const state1 = position.get(index1);
        if (state1 != null) {
          // 自駒がある場合は移動できない
          // 相手駒がある場合は移動できるが、その先には移動できない
          if (state1.turn !== turn) {
            results.push([pieceType, index, index1]);
          }
          break;
        }

        results.push([pieceType, index, index1]);
      }
    }
  }
  return results;
}

// 移動後、王手にならないかのチェック
function isChecked(position: Map<number, PiecePosition>, candidate: [PieceType, number, number], turn: boolean): boolean {
  const [pieceType, prevIndex, nextIndex] = candidate;

  const candidatePosition = new Map(position);
  candidatePosition.delete(prevIndex);
  candidatePosition.set(nextIndex, { type: pieceType, turn });
  
  return isCheck(candidatePosition, !turn);
}

const pieceScoreTable = new Map<PieceType, number>(
  [
    ['歩', 90],
    ['香', 315],
    ['桂', 405],
    ['銀', 495],
    ['金', 540],
    ['角', 855],
    ['飛', 990],
    ['と', 540],
    ['成香', 540],
    ['成桂', 540],
    ['成銀', 540],
    ['馬', 945],
    ['龍', 1395],
    ['王', 15000],
    ['玉', 15000],
  ],
);

function calculatePiceInHandScore(pieceInHand: Map<PieceType, number>): number {
  let score = 0;
  for (const [pieceType, count] of pieceInHand) {
    const pieceScore = pieceScoreTable.get(pieceType);
    if (pieceScore == null) throw new Error();
    score += pieceScore;
  }
  return score;
}

function calculateScore(position: Map<number, PiecePosition>, pieceInHand: [Map<PieceType, number>, Map<PieceType, number>], turn: boolean): number {
  let score = 0;
  const [ sentePieceInHand, gotePieceInHand ] = pieceInHand;

  for (const { type: pieceType, turn: pieceTurn } of position.values()) {
    const pieceScore = pieceScoreTable.get(pieceType);
    if (pieceScore == null) throw new Error();

    if (turn === pieceTurn) {
      score += pieceScore;
    } else {
      score -= pieceScore;
    }
  }

  // const pieceInHandScore = (calculatePiceInHandScore(sentePieceInHand) - calculatePiceInHandScore(gotePieceInHand)) * 1.1;
  // if (turn) {
  //   score += pieceInHandScore;
  // } else {
  //   score -= pieceInHandScore;
  // }
  return score;
}

export type { PlayerMode };
export { calculateNextMove, moveNextByAi, isChecked };