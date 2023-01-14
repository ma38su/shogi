import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { GameRecord, isPromotable, PieceType, promote } from "../shogi";

type Props = {
  lastRecord: GameRecord,
  handlePromotion: (promoted: boolean) => void,
};

function PromotionDialog(props: Props) {
  const {
    lastRecord,
    handlePromotion,
  } = props;

  const { piece, turn } = lastRecord;

  const handleYes = () => {
    handlePromotion(true);
  };
  const handleNo = () => {
    handlePromotion(false);
  };

  return (
    <Modal isOpen={isPromotable(lastRecord)} onClose={handleNo} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>成りますか？</ModalHeader>
        <ModalBody>
          <Text>
            {turn ? '先手' : '後手'}
          </Text>
          <Text>
            {piece} → {promote(piece)}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleYes}>Yes</Button>
          <Button variant="ghost" onClick={handleNo}>No</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { PromotionDialog }