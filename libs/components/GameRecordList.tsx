import { Text } from "@chakra-ui/react";
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
    <>
      <Text>棋譜</Text>
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

          return <Text key={move}>{move}手目 {turn ? '▲' : '△'} {xyToLabel(x, y)} {piece}{ behavior }</Text>
        })
      }
    </>
  )
});

export { GameRecordList, xyToLabel, indexToLabel };