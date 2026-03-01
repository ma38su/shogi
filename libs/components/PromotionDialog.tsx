import { Button, Dialog, Text } from "@chakra-ui/react";
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
    <Dialog.Root open={isPromotable(lastRecord)} onOpenChange={(e) => { if (!e.open) handleNo(); }} placement="center">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>成りますか？</Dialog.Header>
          <Dialog.Body>
            <Text>
              {turn ? '先手' : '後手'}
            </Text>
            <Text>
              {piece} → {promote(piece)}
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button colorScheme="blue" mr={3} onClick={handleYes}>Yes</Button>
            <Button variant="ghost" onClick={handleNo}>No</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export { PromotionDialog }
