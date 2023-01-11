import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Game, isPromotable } from "../shogi";

type Props = {
  game: Game,
  handleReset: () => void,
};

function CheckmateDialog(props: Props) {
  const {
    game,
    handleReset,
  } = props;

  return (
    <Modal isOpen={true} onClose={handleReset} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>詰み</ModalHeader>
        <ModalBody>
          詰みました。
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleReset}>再戦</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { CheckmateDialog }