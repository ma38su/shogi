import React from "react";
import { createRectanglePolygon, XYArray } from "../geometry";
import { PlayerTurn, PieceType } from "../shogi";
import { polylineToPoints } from "../svg";
import { PieceShape } from "./PieceShape";

type Props = {
  type: PieceType,
  index: number,
  turn: PlayerTurn,
  scale: number,
  selected?: boolean,
  onClick: (x: number, y: number, turn: PlayerTurn, type: PieceType) => void
};

const PieceSvgGroup = React.memo(function PieceSvg(props: Props) {
  const {
    type,
    index,
    turn,
    scale,
    selected,
    onClick,
  } = props;

  const x = Math.floor(index / 9);
  const y = index % 9;

  const handleClick = function() {
    onClick(x, y, turn, type);
  };

  return (
    <g transform={turn ? `translate(${8-x},${y})` : `translate(${8-x+1},${y+1}) scale(-1,-1)`} onClick={handleClick}>
      { selected && <polygon points={polylineToPoints(createRectanglePolygon(1, 1))} fill='#CB4829' /> }
      <PieceShape type={type} scale={scale} />
    </g>
  );
});
export { PieceSvgGroup };
