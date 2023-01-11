import { Text } from "@chakra-ui/react";
import React from "react";
import { GameRecord, xToLabel, yToLabel } from "../shogi";

type Props = {
  records: GameRecord[],
};

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

          return <Text key={move}>{move}手目 {turn ? '▲' : '△'} {xToLabel(x)}{yToLabel(y)} {piece}{ behavior }</Text>
        })
      }
    </>
  )
});

export { GameRecordList };