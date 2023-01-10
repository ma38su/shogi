import React from "react";
import { createRectanglePolygon, XY, XYArray } from "../geometry";
import { PieceType, PlayerTurn, xyToIndex } from "../shogi";
import { polylineToPoints } from "../svg";

function filterCandidates(x0: number, y0: number, turn: PlayerTurn, position: Map<number, [PieceType, PlayerTurn]>, list: XYArray) {
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
        if (turn !== state[1]) {
          candidates.push(xy);
        }
        break;
      }
      candidates.push(xy);
    }
    return candidates;
  }
  
  type SubProps = {
    x: number,
    y: number,
    piece: PieceType,
    turn: PlayerTurn,
    candidates: XYArray,
    position: Map<number, [PieceType, PlayerTurn]>,
    onClick: (x: number, y: number, turn: PlayerTurn, type: PieceType) => void
  };

  const CandidateLineSvg = React.memo(function CandidateLineSvg(props: SubProps) {
    const {
      x: x0,
      y: y0,
      piece,
      turn,
      position,
      candidates,
      onClick,
    } = props;
  
    return (
      <>
      {
        filterCandidates(x0, y0, turn, position, candidates)
          .map(([dx, dy], i) => {
            const x = x0 + dx;
            const y = y0 + dy;
  
            const handleClick = function() {
              onClick(x, y, turn, piece);
            };
            return (
              <g key={`${x}${y}`} transform={`translate(${8-x},${y})`} onClick={handleClick}>
                <polygon points={polylineToPoints(createRectanglePolygon(1, 1))} fill='#C49958' fillOpacity="0.5" />
              </g>
            )
          })
      }
      </>
    );
  });

  export { CandidateLineSvg }