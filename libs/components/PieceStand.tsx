import { Button, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { CapturablePieceList, PieceType, PlayerTurn } from "../shogi";
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
    <Wrap >
    {
      CapturablePieceList
        .filter(piece => pieceInHand.has(piece))
        .map(type => {
          const val = pieceInHand.get(type);
          if (val == null) throw new Error();
          const handleClick = () => handleSelectPiece(type);
          return (
            <WrapItem key={type}>
              <Button style={{width: '4.75em', padding: '0em'}} colorScheme={selected ? 'blue' : undefined} onClick={handleClick} disabled={disabled}>
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
