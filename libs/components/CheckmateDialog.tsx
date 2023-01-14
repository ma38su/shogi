import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text } from "@chakra-ui/react";
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
    <Modal isOpen={true} onClose={handleReset} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{turn ? '先手' : '後手'}の勝ち</ModalHeader>
        <ModalBody>
          <Text>{move}手 詰み</Text>
          <PlayerModeSelector playersMode={playersMode} setPlayersMode={setPlayersMode} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleReset}>再戦</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { CheckmateDialog }