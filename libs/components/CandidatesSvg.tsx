import React from "react";
import { PlayerTurn, PieceType, getMoveCandidateList } from "../shogi";
import { CandidateLineSvg } from "./CandidateLineSvg";

type Props = {
  index: number,
  piece: PieceType,
  turn: PlayerTurn,
  position: Map<number, [PieceType, PlayerTurn]>,
  onClick: (x: number, y: number, turn: PlayerTurn, type: PieceType) => void
};

const CandidatesSvg = React.memo(function CandidatesSvg(props: Props) {
  const {
    index,
    piece,
    turn,
    position,
    onClick,
  } = props;

  const x = Math.floor(index / 9);
  const y = index % 9;
  const candidates = getMoveCandidateList(piece, turn);

  return (
    <>
      {
        candidates
          .map((list, i) => <CandidateLineSvg key={i} x={x} y={y} piece={piece} candidates={list} turn={turn} position={position} onClick={onClick} />)
      }
    </>
  );
});
export { CandidatesSvg };
