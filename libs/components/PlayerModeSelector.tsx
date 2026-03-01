import { HStack, RadioGroup, Text } from "@chakra-ui/react";
import { PlayerMode } from "../shogi-ai";

type Props = {
  playersMode: [PlayerMode, PlayerMode],
  setPlayersMode: React.Dispatch<React.SetStateAction<[PlayerMode, PlayerMode]>>,
}

function PlayerModeSelector(props: Props) {

  const { playersMode: [senteMode, goteMode], setPlayersMode } = props;

  const handleSenteMode = (e: RadioGroup.ValueChangeDetails) => {
    setPlayersMode(([_, prevGoteMode]) => [e.value as PlayerMode, prevGoteMode]);
  }

  const handleGoteMode = (e: RadioGroup.ValueChangeDetails) => {
    setPlayersMode(([prevSenteMode]) => [prevSenteMode, e.value as PlayerMode]);
  }

  return (
    <>
      <RadioGroup.Root onValueChange={handleSenteMode} value={senteMode}>
        <HStack>
          <Text>先手</Text>
          <RadioGroup.Item value='Player'>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>Player</RadioGroup.ItemText>
          </RadioGroup.Item>
          <RadioGroup.Item value='AI'>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>AI</RadioGroup.ItemText>
          </RadioGroup.Item>
        </HStack>
      </RadioGroup.Root>

      <RadioGroup.Root onValueChange={handleGoteMode} value={goteMode}>
        <HStack>
          <Text>後手</Text>
          <RadioGroup.Item value='Player'>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>Player</RadioGroup.ItemText>
          </RadioGroup.Item>
          <RadioGroup.Item value='AI'>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>AI</RadioGroup.ItemText>
          </RadioGroup.Item>
        </HStack>
      </RadioGroup.Root>
    </>
  );
}

export { PlayerModeSelector }
