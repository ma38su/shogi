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

function calculateNextMove(game: Game) {
  const moveCandidates = generateNextMoveCandidates(game);

  const { position, turn } = game;

  const noChecked = moveCandidates.filter(candidate => !isChecked(position, candidate, turn));
  if (noChecked.length > 0) {
    const checkCandidate = noChecked.filter(candidate => isChecked(position, candidate, !turn));
    if (checkCandidate.length > 0) {
      const nextMove = choiceRandom(checkCandidate);
      return nextMove;
    }

    const nextMove = choiceRandom(noChecked);
    return nextMove;
  } else {
    const nextMove = choiceRandom(moveCandidates);
    return nextMove;
  }
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

function isChecked(position: Map<number, PiecePosition>, candidate: [PieceType, number, number], turn: boolean) {
  const [pieceType, prevIndex, nextIndex] = candidate;

  const candidatePosition = new Map(position);
  candidatePosition.delete(prevIndex);
  candidatePosition.set(nextIndex, { type: pieceType, turn });
  
  return isCheck(candidatePosition, !turn);
}

export type { PlayerMode };
export { calculateNextMove, moveNextByAi, isChecked };