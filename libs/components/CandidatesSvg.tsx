import React from "react";
import { createRectanglePolygon } from "../geometry";
import { PlayerTurn, PieceType, getMoveRangeList, PiecePosition, indexToXY, RangeIndex, generateDropCandidateIndexes, dropCandidateIndexesPawnEnabledX } from "../shogi";
import { polylineToPoints } from "../svg";
import { CandidateLineSvg } from "./CandidateLineSvg";

type Props = {
  index: number | null,
  piece: PieceType,
  turn: PlayerTurn,
  position: Map<number, PiecePosition>,
  visible: boolean,
  onClick: (x: number, y: number) => void
};

const CandidatesSvg = React.memo(function CandidatesSvg(props: Props) {

  const {
    index,
    piece,
    turn,
    position,
    visible,
    onClick,
  } = props;

  if (index == null) {
    const dropCandidates = generateDropCandidateIndexes(position);
    if (piece === '歩') {
      const enabledX = dropCandidateIndexesPawnEnabledX(position, turn);
      return (
        <>
          {
            dropCandidates.map(index => indexToXY(index))
              .filter(([x, y]) => enabledX.includes(x))
              .map(([x, y]) => {
                const handleClick = () => onClick(x, y);
                return (
                  <g key={`${x}${y}`} transform={`translate(${8-x},${y})`} onClick={handleClick}>
                    <polygon points={polylineToPoints(createRectanglePolygon(1, 1))} fill='#C49958' fillOpacity={visible ? 0.5 : 0} />
                  </g>
                )
              })
          }
        </>
      );
    } else {
      return (
        <>
          {
            dropCandidates.map(index => indexToXY(index))
              .map(([x, y]) => {
                const handleClick = () => onClick(x, y);
                return (
                  <g key={`${x}${y}`} transform={`translate(${8-x},${y})`} onClick={handleClick}>
                    <polygon points={polylineToPoints(createRectanglePolygon(1, 1))} fill='#C49958' fillOpacity={visible ? 0.5 : 0} />
                  </g>
                )
              })
          }
        </>
      );
    }
  } else {
    const x = Math.floor(index / 9);
    const y = index % 9;
    const candidates = getMoveRangeList(piece, turn);
  
    return (
      <>
        {
          candidates
            .map((line, i) => <CandidateLineSvg key={i} {...{x, y, candidates: line, turn, position, onClick, visible}} />)
        }
      </>
    );
  }
});
export { CandidatesSvg };
