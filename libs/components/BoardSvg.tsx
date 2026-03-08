import React from "react";
import { createRectanglePolygon } from "../geometry";
import { PlayerTurn, PieceType, xyToIndex, Game, yToLabel, PieceSelection, movePiece, RangeXY } from "../shogi";
import { generateGrid, polylineToPoints } from "../svg";
import { VisibilityOption } from "../VisibilityOption";
import { PieceSvgGroup } from "./PieceSvgGroup";
import { CandidatesSvg } from "./CandidatesSvg";
import { PieceStand } from "./PieceStand";

const XLabel = React.memo(function XLabel() {
  return (
    <>
    {
      RangeXY
        .map((i) => <text key={i} fontSize={0.4} textAnchor='middle' transform={`translate(${8.5-i},-0.2)`}>{i+1}</text>)
    }
    </>
  )
});
const YLabel = React.memo(function YLabel() {
  return (
    <>
    {
      RangeXY
        .map((i) => <text key={i} fontSize={0.4} textAnchor='middle' transform={`translate(${9.5},${i+0.7})`}>{yToLabel(i)}</text>)
    }
    </>
  )
});

const BoardGrid = React.memo(function Grid(props: {size: number, scale: number}) {
  const { size, scale } = props;
  return <path d={generateGrid(9, 9, size)} strokeWidth={1/scale} stroke='#888' fill='none' />
});

type Props = {
  game: Game,
  setGame: React.Dispatch<React.SetStateAction<Game>>,
  visibilityOptions?: VisibilityOption[],
};

function selectPiece(x: number, y: number, type: PieceType, turn: PlayerTurn, prev: PieceSelection | null) {
  const index = xyToIndex(x, y);
  if (prev?.index === index) return null;

  return {
    index: xyToIndex(x, y),
    piece: type,
    turn,
  } satisfies PieceSelection;
}

function ShogiBoardSvg(props: Props) {

  const {
    game,
    setGame,
    visibilityOptions,
  } = props;

  const standWidth = 185;
  const standHeight = 240;

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

  const handleSelect = React.useCallback(function onClick(x: number, y: number, turn: PlayerTurn, type: PieceType) {
    if (turn !== game.turn) return;

    setSelection(prev => selectPiece(x, y, type, turn, prev));
  }, [game]);

  const handleMove = React.useCallback(function onClick(x: number, y: number) {
    if (!selection) throw new Error();
    setGame((prev: Game) => movePiece(prev, selection, xyToIndex(x, y)));
  }, [selection, setGame]);

  React.useEffect(() => {
    setSelection(null);
  }, [game]);

  const { position, pieceInHand: [bPieceOfHand, wPieceOfHand] } = game;
  const selectedIndex = selection?.index;
  const candidatesVisible = visibilityOptions?.includes('移動候補表示') ?? false;

  const handleSelectInHandPiece = (type: PieceType | null) => {
    if (type == null) {
      setSelection(null);
    } else {
      setSelection({
        index: null,
        piece: type,
        turn: game.turn,
      });
    }
  };

  const standColor = '#C49958';
  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      <div className="self-start">
        <div className="flex flex-col p-2.5" style={{width: standWidth, height: standHeight, backgroundColor: standColor}}>
          <PieceStand pieceInHand={wPieceOfHand} turn={false} disabled={game.turn} selection={selection} handleSelectPiece={handleSelectInHandPiece} />
          <p>後手</p>
        </div>
      </div>
      <div>
        <svg {...{width, height}} className='disable-select'>
          <g transform={`translate(${margin},${margin+heightGuide}) scale(${scale},${scale})`}>

            <XLabel />
            <YLabel />

            <polygon points={polylineToPoints(createRectanglePolygon(boardWidth, boardHeight))} stroke='none' fill='#FCD7A1' />

            {
              Array.from(position.entries()).map(([index, {type, turn}]) => {
                return <PieceSvgGroup key={index} {...{type, index, turn, scale, onClick: handleSelect, selected: selectedIndex === index}} />
              })
            }

            { (selection && <CandidatesSvg {...{...selection, position, onClick: handleMove, visible: candidatesVisible}} />) }

            <BoardGrid size={gridSize} scale={scale} />
          </g>
        </svg>
      </div>
      <div className="self-end">
        <div className="flex flex-col p-2.5" style={{width: standWidth, height: standHeight, backgroundColor: standColor}}>
          <p>先手</p>
          <PieceStand pieceInHand={bPieceOfHand} turn={true} disabled={!game.turn} selection={selection} handleSelectPiece={handleSelectInHandPiece} />
        </div>
      </div>
    </div>
  );
}

export { ShogiBoardSvg }
