import React from "react";
import { createRectanglePolygon } from "../geometry";
import { PlayerTurn, PieceType, xyToIndex, Game, promote, GameRecord, yToLabel, PiecePosition, PieceSelection, movePiece } from "../shogi";
import { generateGrid, polylineToPoints } from "../svg";
import { VisibilityOption } from "../VisibilityOption";
import { PieceSvgGroup } from "./PieceSvgGroup";
import { CandidatesSvg } from "./CandidatesSvg";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { PieceStand } from "./PieceStand";

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
      [0, 1, 2, 3, 4, 5, 6, 7, 8]
        .map((n, i) => <text key={n} fontSize={0.4} textAnchor='middle' transform={`translate(${9.5},${i+0.7})`}>{yToLabel(n)}</text>)
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

  const standWidth = 100;
  const standHeight = 150;

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
  const candidatesVisible = visibilityOptions?.includes('移動範囲') ?? false;

  const handleSelectInHandPiece = (type: PieceType) => {
    setSelection({
      index: null,
      piece: type,
      turn: game.turn,
    });
  };

  const standColor = '#C49958';
  return (
    <Stack direction='row'>
      <Flex alignItems='start'>
        <Stack direction='column' style={{width: standWidth, height: standHeight, backgroundColor: standColor}}>
          <PieceStand pieceInHand={wPieceOfHand} turn={false} disabled={game.turn} selected={false} handleSelectPiece={handleSelectInHandPiece} />
          <Text>後手</Text>
        </Stack>
      </Flex>

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

          { (selection && selection.index != null) && <CandidatesSvg {...{...selection, position, onClick: handleMove, visible: candidatesVisible}} /> }

          <BoardGrid size={gridSize} scale={scale} />
        </g>
      </svg>

      <Flex alignItems='end'>
        <Stack direction='column' style={{width: standWidth, height: standHeight, backgroundColor: standColor}}>
          <Text>先手</Text>
          <PieceStand pieceInHand={bPieceOfHand} turn={true} disabled={!game.turn} selected={false} handleSelectPiece={handleSelectInHandPiece}/>
        </Stack>
      </Flex>
    </Stack>
  );
}

export { ShogiBoardSvg }