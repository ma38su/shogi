import React from "react";
import { PlayerColor, PieceType, getMoveCandidateList } from "../shogi";
import { CandidateLineSvg } from "./CandidateLineSvg";

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

  const x = Math.floor(index / 9);
  const y = index % 9;
  const candidates = getMoveCandidateList(piece, color);

  return (
    <>
      {
        candidates
          .map((list, i) => <CandidateLineSvg key={i} x={x} y={y} piece={piece} candidates={list} color={color} position={position} onClick={onClick} />)
      }
    </>
  );
});
export { CandidatesSvg };
