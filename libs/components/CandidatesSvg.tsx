import React from "react";
import { createRectanglePolygon, XY, XYArray } from "../geometry";
import { PlayerColor, PieceType, getMoveCandidateList, xyToIndex } from "../shogi";
import { polylineToPoints } from "../svg";

function filterCandidates(x0: number, y0: number, color: PlayerColor, position: Map<number, [PieceType, PlayerColor]>, list: XYArray) {
  const candidates: XY[] = [];
  for (const xy of list) {
    const [dx, dy] = xy;
    const x = x0 + dx;
    const y = y0 + dy;
    if (x < 0 || x >= 9 || y < 0 || y >= 9) {
      break;
    }

    const index = xyToIndex(x, y);
    const state = position.get(index);
    if (state != null) {
      if (color !== state[1]) {
        candidates.push(xy);
      }
      break;
    }
    candidates.push(xy);
  }
  return candidates;
}

type SubProps = {
  x0: number,
  y0: number,
  // index: number,
  piece: PieceType,
  color: PlayerColor,
  candidates: XYArray,
  position: Map<number, [PieceType, PlayerColor]>,
  onClick: (x: number, y: number, color: PlayerColor, type: PieceType) => void
};

const CandidateLineSvg = React.memo(function CandidateLineSvg(props: SubProps) {
  const {
    x0,
    y0,
    piece,
    color,
    position,
    candidates,
    onClick,
  } = props;

  return (
    <>
    {
      filterCandidates(x0, y0, color, position, candidates)
        .map(([dx, dy], i) => {
          const x = x0 + dx;
          const y = y0 + dy;

          const handleClick = function() {
            onClick(x, y, color, piece);
          };
          return (
            <g key={`${x}${y}`} transform={`translate(${8-x},${y})`} onClick={handleClick}>
              <polygon points={polylineToPoints(createRectanglePolygon(1, 1))} fill='#C49958' fill-opacity="0.5" />
            </g>
          )
        })
    }
    </>
  );
});

type Props = {
  index: number,
  piece: PieceType,
  color: PlayerColor,
  position: Map<number, [PieceType, PlayerColor]>,
  onClick: (x: number, y: number, color: PlayerColor, type: PieceType) => void
};

const CandidatesSvg = React.memo(function CandidatesSvg(props: Props) {
  const {
    index,
    piece,
    color,
    position,
    onClick,
  } = props;

  const x0 = Math.floor(index / 9);
  const y0 = index % 9;

  const candidates = getMoveCandidateList(piece, color);

  return (<>
    {
      candidates
        .map((list, i) => <CandidateLineSvg key={i} x0={x0} y0={y0} piece={piece} candidates={list} color={color} position={position} onClick={onClick} />)
    }
  </>);
});
export { CandidatesSvg };
