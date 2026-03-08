import { GameRecord, isPromotable, promote } from "../shogi";

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

  if (!isPromotable(lastRecord)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => handlePromotion(false)} />
      <div className="relative bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <h2 className="text-lg font-bold mb-4">成りますか？</h2>
        <p>{turn ? '先手' : '後手'}</p>
        <p>{piece} → {promote(piece)}</p>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer" onClick={() => handlePromotion(true)}>Yes</button>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded cursor-pointer" onClick={() => handlePromotion(false)}>No</button>
        </div>
      </div>
    </div>
  );
}

export { PromotionDialog }
