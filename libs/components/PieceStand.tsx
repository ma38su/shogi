import { CapturablePieceList, PieceSelection, PieceType } from "../shogi";
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
    <div className="flex flex-wrap gap-1">
    {
      CapturablePieceList
        .filter(piece => pieceInHand.has(piece))
        .map(type => {
          const val = pieceInHand.get(type);
          if (val == null) throw new Error();

          const selected = selection != null && selection.piece === type && selection.turn === turn;
          const handleClick = () => handleSelectPiece(selected ? null : type);
          return (
            <button
              key={type}
              className={`flex items-center px-1 py-0.5 rounded cursor-pointer ${
                selected ? 'bg-blue-600 text-white' : 'bg-[#C49958] hover:bg-[#b08848]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleClick}
              disabled={disabled}
              style={{width: '4.75em'}}
            >
              <PieceSvg key={type} width={40} height={40} turn={turn} type={type} /> x{val}
            </button>
          );
        })
    }
    </div>
  );
};
export { PieceStand }
