import { Button, Dialog, Text } from "@chakra-ui/react";
import { Game, isPromotable } from "../shogi";
import { PlayerMode } from "../shogi-ai";
import { PlayerModeSelector } from "./PlayerModeSelector";

type Props = {
  game: Game,
  playersMode: [PlayerMode, PlayerMode],
  setPlayersMode: React.Dispatch<React.SetStateAction<[PlayerMode, PlayerMode]>>,
  handleReset: () => void,
};

function CheckmateDialog(props: Props) {
  const {
    game: { turn, move },
    playersMode,
    handleReset,
    setPlayersMode,
  } = props;

  return (
    <Dialog.Root open={true} onOpenChange={(e) => { if (!e.open) handleReset(); }} placement="center">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>{turn ? '先手' : '後手'}の勝ち</Dialog.Header>
          <Dialog.Body>
            <Text>{move}手 詰み</Text>
            <PlayerModeSelector playersMode={playersMode} setPlayersMode={setPlayersMode} />
          </Dialog.Body>
          <Dialog.Footer>
            <Button colorScheme="green" mr={3} onClick={handleReset}>再戦</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export { CheckmateDialog }
