import React from "react";
import { createRectanglePolygon, XYArray } from "../geometry";
import { PlayerColor, PieceType } from "../shogi";
import { polylineToPoints } from "../svg";

function createPiece(): XYArray {
  return [
    [0.5, 0.1],
    [0.8, 0.25],
    [0.9, 0.9],
    [0.1, 0.9],
    [0.2, 0.25],
  ]
}

const piecePoints = polylineToPoints(createPiece());

type Props = {
  type: PieceType,
  index: number,
  color: PlayerColor,
  scale: number,
  selected: boolean,
  onClick: (x: number, y: number, color: PlayerColor, type: PieceType) => void
};

const PieceSvg = React.memo(function PieceSvg(props: Props) {
  const {
    type,
    index,
    color,
    scale,
    selected,
    onClick,
  } = props;

  const x = Math.floor(index / 9);
  const y = index % 9;

  const handleClick = function() {
    onClick(x, y, color, type);
  };

  return (
    <g transform={color === 'B' ? `translate(${8-x},${y})` : `translate(${8-x+1},${y+1}) scale(-1,-1)`} onClick={handleClick}>
      { selected && <polygon points={polylineToPoints(createRectanglePolygon(1, 1))} fill='#CB4829' /> }
      <polygon points={piecePoints} strokeWidth={1/scale} stroke='#222' fill='#F9C270' />
      <text fontFamily={'Noto Serif JP, serif'} fontSize={0.55} textAnchor='middle' transform={`translate(0.5,0.75)`}>{type}</text>
    </g>
  );
});
export { PieceSvg };
