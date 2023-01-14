import { Button, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { PieceType, PlayerTurn } from "../shogi";
import { PieceSvg } from "./PieceSvg";

type Props = {
    pieceInHand: Map<PieceType, number>,
    turn: boolean,
    disabled: boolean,
    selected: boolean,
    handleSelectPiece: (pieceType: PieceType) => void,
};

const PieceStand = (props: Props) => {

  const {
    pieceInHand,
    turn,
    disabled,
    selected,
    handleSelectPiece,
  } = props;

  return (
    <Wrap>
    {
      Array.from(pieceInHand.entries()).map(([type, val]) => {
        const handleClick = () => handleSelectPiece(type);
        return (
          <WrapItem key={type}>
            <Button colorScheme={selected ? 'blue' : undefined} onClick={handleClick} disabled={disabled}>
              <PieceSvg key={type} width={40} height={40} turn={turn} type={type} /> x{val}
            </Button>
          </WrapItem>
        );
      })
    }
    </Wrap>
  );
};
export { PieceStand }
