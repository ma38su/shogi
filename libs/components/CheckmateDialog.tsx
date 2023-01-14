import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { Game, isPromotable } from "../shogi";

type Props = {
  game: Game,
  handleReset: () => void,
};

function CheckmateDialog(props: Props) {
  const {
    game: { turn, move },
    handleReset,
  } = props;

  return (
    <Modal isOpen={true} onClose={handleReset} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{move}手 詰み</ModalHeader>
        <ModalBody>
          <Text>
          {turn ? '先手' : '後手'}の勝ち
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleReset}>再戦</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { CheckmateDialog }