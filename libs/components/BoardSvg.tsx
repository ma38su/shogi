import React from "react";
import { createRectanglePolygon } from "../geometry";
import { PlayerTurn, PieceType, xyToIndex, Game } from "../shogi";
import { generateGrid, polylineToPoints } from "../svg";
import { VisibilityOption } from "../VisibilityOption";
import { PieceSvg } from "./PieceSvg";
import { CandidatesSvg } from "./CandidatesSvg";

const XLabel = React.memo(function XLabel() {
  return (
    <>
    {
      [1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map((n, i) => <text key={n} fontSize={0.4} textAnchor='middle' transform={`translate(${8.5-i},-0.2)`}>{n}</text>)
    }
    </>
  )
});
const YLabel = React.memo(function YLabel() {
  return (
    <>
    {
      ['一', '二', '三', '四', '五', '六', '七', '八', '九']
        .map((n, i) => <text key={n} fontSize={0.4} textAnchor='middle' transform={`translate(${9.5},${i+0.7})`}>{n}</text>)
    }
    </>
  )
});

const BoardGrid = React.memo(function Grid(props: {size: number, scale: number}) {
  const { size, scale } = props;
  return <path d={generateGrid(9, 9, size)} strokeWidth={1/scale} stroke='#888' fill='none' />
});

type PieceSelection = {
  index: number,
  piece: PieceType,
  turn: PlayerTurn,
};

type Props = {
  game: Game,
  setGame: React.Dispatch<React.SetStateAction<Game>>,
  visibilityOptions?: VisibilityOption[],
};

function BoardSvg(props: Props) {

  const {
    game,
    setGame,
    visibilityOptions,
  } = props;

  const gridSize = 1;
  const margin = 1;
  const scale = 40;
  const widthGuide = 30;
  const heightGuide = 30;
  const boardWidth = (9 * gridSize);
  const boardHeight = (9 * gridSize);

  const width = boardWidth * scale + margin * 2 + widthGuide;
  const height = boardHeight * scale + margin * 2 + heightGuide;

  const [selection, setSelection] = React.useState<PieceSelection | null>(null);

  const onClick = React.useCallback(function onClick(x: number, y: number, turn: PlayerTurn, type: PieceType) {
    if (turn !== game.turn) return;

    const index = xyToIndex(x, y);
    setSelection(prev => {
      if (prev?.index === index) return null;

      return {
        index: xyToIndex(x, y),
        piece: type,
        turn,
      } satisfies PieceSelection;
    });
  }, [game]);

  const handleMove = React.useCallback(function onClick(x: number, y: number, turn: PlayerTurn) {
    if (!selection) throw new Error();

    setGame((prev: Game) => {

      const nextIndex = xyToIndex(x, y);
      const { index, piece } = selection;
      const { position, pieceInHand: [bPieceInHand, wPieceInHand] } = prev;
      
      const captured = position.get(nextIndex);
      console.log('move!!', { index, piece});
      if (captured != null) {
        const [capturedType, capturedTurn] = captured;
        if (turn === capturedTurn) throw new Error();
 
        if (turn) {
          const prevCount = bPieceInHand.get(capturedType) ?? 0;
          bPieceInHand.set(capturedType, prevCount + 1);
        } else {
          const prevCount = wPieceInHand.get(capturedType) ?? 0;
          wPieceInHand.set(capturedType, prevCount + 1);
        }
      }

      const pieceInHand = [new Map(bPieceInHand), new Map(wPieceInHand)];

      console.log(pieceInHand);
  
      position.delete(index);
      position.set(nextIndex, [piece, turn]);

      return {
        turn: !prev.turn,
        move: prev.move + 1,
        position: new Map(position),
        pieceInHand: [new Map(bPieceInHand), new Map(wPieceInHand)],
      } satisfies Game;
    });
  }, [selection, setGame]);

  const selectedIndex = selection?.index;

  const { position } = game;

  React.useEffect(() => {
    setSelection(null);
  }, [game]);

  const candidatesVisible = visibilityOptions?.includes('移動範囲') ?? false;

  return (
    <svg {...{width, height}} className='disable-select'>
      <g transform={`translate(${margin},${margin+heightGuide}) scale(${scale},${scale})`}>

        <XLabel />
        <YLabel />

        <polygon points={polylineToPoints(createRectanglePolygon(boardWidth, boardHeight))} stroke='none' fill='#FCD7A1' />

        {
          Array.from(position.entries()).map(([index, [type, turn]]) => {
            return <PieceSvg key={index} {...{type, index, turn: turn, scale, onClick, selected: selectedIndex === index}} />
          })
        }

        { selection && <CandidatesSvg {...{...selection, position, onClick: handleMove, visible: candidatesVisible}} /> }

        <BoardGrid size={gridSize} scale={scale} />
      </g>
    </svg>
  );
}

export { BoardSvg }