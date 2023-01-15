import { Button, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { CapturablePieceList, PieceSelection, PieceType, PlayerTurn } from "../shogi";
import { PieceSvg } from "./PieceSvg";

type Props = {
    pieceInHand: Map<PieceType, number>,
    turn: boolean,
    disabled: boolean,
    selection: PieceSelection | null,
    handleSelectPiece: (pieceType: PieceType | null) => void,
};

const PieceStand = (props: Props) => {

  const {
    pieceInHand,
    turn,
    disabled,
    selection,
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

          const selected = selection != null && selection.piece === type && selection.turn === turn;
          const handleClick = () => handleSelectPiece(selected ? null : type);
          return (
            <WrapItem key={type}>
              <Button style={{width: '4.75em', padding: '0em'}} colorScheme={selected ? 'blue' : '#C49958'} onClick={handleClick} disabled={disabled}>
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
