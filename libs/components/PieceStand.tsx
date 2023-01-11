import { Button, Text } from "@chakra-ui/react";
import { PieceType, PlayerTurn } from "../shogi";
import { PieceSvg } from "./PieceSvg";

type Props = {
    pieceInHand: Map<PieceType, number>,
    turn: boolean,
    disabled: boolean,
    selected: boolean,
    handleDropPiece: (pieceType: PieceType, turn: PlayerTurn) => void,
};

const PieceStand = (props: Props) => {

  const {
    pieceInHand,
    turn,
    disabled,
    selected,
    handleDropPiece,
  } = props;

  return <>
  {
    Array.from(pieceInHand.entries()).map(([type, val]) => {
      const handleClick = () => handleDropPiece(type, turn);
      return (
        <Button key={type} colorScheme={selected ? 'blue' : undefined} onClick={handleClick} disabled={disabled}>
          <PieceSvg key={type} width={40} height={40} turn={turn} type={type} /> x{val}
        </Button>
      );
    })
  }
  </>
};
export { PieceStand }
