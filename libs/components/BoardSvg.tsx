import React from "react";
import { createRectanglePolygon } from "../geometry";
import { PlayerColor, PieceType, xyToIndex } from "../shogi";
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

const Grid = React.memo(function Grid(props: {size: number, scale: number}) {
  const { size, scale } = props;
  return <path d={generateGrid(9, 9, size)} strokeWidth={1/scale} stroke='#888' fill='none' />
});

type PiecePtr = {
  index: number,
  piece: PieceType,
  color: PlayerColor,
};

type Props = {
  position: Map<number, [PieceType, PlayerColor]>,
  visibilityOptions?: VisibilityOption[],
};

function BoardSvg(props: Props) {

  const { position: initPosition, visibilityOptions } = props;

  const [position, setPosition] = React.useState(initPosition);
  const gridSize = 1;
  const margin = 1;
  const scale = 40;
  const widthGuide = 30;
  const heightGuide = 30;
  const boardWidth = (9 * gridSize);
  const boardHeight = (9 * gridSize);

  const width = boardWidth * scale + margin * 2 + widthGuide;
  const height = boardHeight * scale + margin * 2 + heightGuide;

  const [ptr, setPtr] = React.useState<PiecePtr | null>(null);

  const onClick = React.useCallback(function onClick(x: number, y: number, color: PlayerColor, type: PieceType) {
    setPtr({
      index: (x * 9) + y,
      piece: type,
      color,
    });
  }, []);

  const handleMove = React.useCallback(function onClick(x: number, y: number, color: PlayerColor, type: PieceType) {
    if (!ptr) throw new Error();

    const index1 = xyToIndex(x, y);
    const { index, piece } = ptr;
    position.delete(index);
    position.set(index1, [piece, color]);
    setPosition(new Map(position));
    setPtr(null);
  }, [ptr, position]);

  const selectedIndex = ptr?.index;

  return (
    <svg {...{width, height}} className='disable-select'>
      <g transform={`translate(${margin},${margin+heightGuide}) scale(${scale},${scale})`}>

        <XLabel />
        <YLabel />

        <polygon points={polylineToPoints(createRectanglePolygon(boardWidth, boardHeight))} stroke='none' fill='#FCD7A1' />

        {
          Array.from(position.entries()).map(([index, [type, color]]) => {
            return <PieceSvg key={index} {...{type, index, color, scale, onClick, selected: selectedIndex === index}} />
          })
        }

        { ptr && <CandidatesSvg {...{...ptr, position, onClick: handleMove}} /> }

        <Grid size={gridSize} scale={scale} />
      </g>
    </svg>
  );
}

export { BoardSvg }