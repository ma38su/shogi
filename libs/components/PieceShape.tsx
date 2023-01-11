import React from "react";
import { createRectanglePolygon, XYArray } from "../geometry";
import { PlayerTurn, PieceType } from "../shogi";
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
  scale: number,
};

function PieceShape(props: Props) {
  const {
    type,
    scale,
  } = props;

  return (
    <>
      <polygon points={piecePoints} strokeWidth={1/scale} stroke='#222' fill='#F9C270' />

      {
        type.length === 1 ? (
          <text fontFamily={'Noto Serif JP, serif'} fontSize={0.55} textAnchor='middle' transform={`translate(0.5,0.75)`}>{type}</text>
          ) : (
          <>
            <text fontFamily={'Noto Serif JP, serif'} fontSize={0.34} textAnchor='middle' transform={`translate(0.5,0.5)`}>{type.substring(0, 1)}</text>
            <text fontFamily={'Noto Serif JP, serif'} fontSize={0.34} textAnchor='middle' transform={`translate(0.5,0.82)`}>{type.substring(1, 2)}</text>
          </>
        )
      }
    </>
  );
}
export { PieceShape };
