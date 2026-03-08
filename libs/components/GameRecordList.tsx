import React from "react";
import { GameRecord, indexToXY, xToLabel, yToLabel } from "../shogi";

type Props = {
  records: GameRecord[],
};

function indexToLabel(index: number) {
  return xyToLabel(...indexToXY(index));
}

function xyToLabel(x: number, y: number) {
 return `${xToLabel(x)}${yToLabel(y)}`;
}

const GameRecordList = React.memo(function GameRecordList(props: Props) {
  const { records } = props;
  return (
    <div className="mt-4">
      <p className="font-bold">棋譜</p>
      {
        records.map(record => {
          const {
            move,
            x,
            y,
            piece,
            turn,
            behavior,
          } = record;

          return <p key={move}>{move}手目 {turn ? '▲' : '△'} {xyToLabel(x, y)} {piece}{ behavior }</p>
        })
      }
    </div>
  )
});

export { GameRecordList, xyToLabel, indexToLabel };
