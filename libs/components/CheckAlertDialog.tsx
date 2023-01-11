import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { GameRecord, isPromotable, PieceType, promote } from "../shogi";

type Props = {
  isOpen: boolean,
  handleClose: () => void,
};

function CheckAlertDialog(props: Props) {
  const {
    isOpen,
    handleClose,
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>王手</ModalHeader>
      </ModalContent>
    </Modal>
  );
}

export { CheckAlertDialog }