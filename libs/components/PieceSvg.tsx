import React from "react";
import { PlayerTurn, PieceType } from "../shogi";
import { PieceShape } from "./PieceShape";

type Props = {
  width: number,
  height: number,
  type: PieceType,
  turn: PlayerTurn,
};

const PieceSvg = React.memo(function PieceSvg(props: Props) {
  const {
    type,
    width,
    height,
    turn,
  } = props;

  const scale = 40;
  const margin = 1;

  return (
    <svg {...{width, height}} className='disable-select'>
      <g transform={`translate(${margin},${margin}) scale(${scale},${scale})`}>
        <g transform={turn ? 'translate(0,0)' : 'translate(1,1) scale(-1,-1)'}>
          <PieceShape type={type} scale={scale} />
        </g>
      </g>
    </svg>
  );
});
export { PieceSvg };
