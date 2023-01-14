import { xyToLabel } from "./components/GameRecordList";
import { Game, getMoveRangeList, indexToXY, isPromotable, movePiece, PiecePosition, PieceSelection, PieceType, PlayerTurn, promote, updatePromotion, xyToIndex } from "./shogi";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function choiceRandom<T>(array: readonly T[]) {
  const i = getRandomInt(array.length);
  return array[i];
}

function calculateNextMove(game: Game) {
  const { position, turn } = game;
  if (turn) {
    console.log('sente AI');
  } else {
    console.log('gote AI');
  }

  const moveCandidates = generateNextMoveCandidates(position, turn);
  
  const nextMove = choiceRandom(moveCandidates);

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

  const newPosition = updatePromotion(lastRecord, position);
  return {
    ...nextGame,
    position: newPosition
  };
}

function generateNextMoveCandidates(position: Map<number, PiecePosition>, turn: boolean): [PieceType, number, number][] {
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

export { calculateNextMove, moveNextByAi }