import { Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { PlayerMode } from "../shogi-ai";

type Props = {
  playersMode: [PlayerMode, PlayerMode],
  setPlayersMode: React.Dispatch<React.SetStateAction<[PlayerMode, PlayerMode]>>,
}

function PlayerModeSelector(props: Props) {

  const { playersMode: [senteMode, goteMode], setPlayersMode } = props;
  
  const handleSenteMode = (nextValue: PlayerMode) => {
    setPlayersMode(([_, prevGoteMode]) => [nextValue, prevGoteMode]);
  }

  const handleGoteMode = (nextValue: PlayerMode) => {
    setPlayersMode(([prevSenteMode]) => [prevSenteMode, nextValue as PlayerMode]);
  }

  return (
    <>
      <RadioGroup onChange={handleSenteMode} value={senteMode}>
        <Stack direction='row'>
          <Text>先手</Text>
          <Radio value='Player'>Player</Radio>
          <Radio value='AI'>NPC</Radio>
        </Stack>
      </RadioGroup>

      <RadioGroup onChange={handleGoteMode} value={goteMode}>
        <Stack direction='row'>
          <Text>後手</Text>
          <Radio value='Player'>Player</Radio>
          <Radio value='AI'>NPC</Radio>
        </Stack>
      </RadioGroup>
    </>
  );
}

export { PlayerModeSelector }