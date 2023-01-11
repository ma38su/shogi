import React from "react";
import { PlayerTurn, PieceType, getMoveRangeList } from "../shogi";
import { CandidateLineSvg } from "./CandidateLineSvg";

type Props = {
  index: number,
  piece: PieceType,
  turn: PlayerTurn,
  position: Map<number, [PieceType, PlayerTurn]>,
  visible: boolean,
  onClick: (x: number, y: number, turn: PlayerTurn) => void
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
});
export { CandidatesSvg };
