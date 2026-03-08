import { Game } from "../shogi";
import { PlayerMode } from "../shogi-ai";
import { PlayerModeSelector } from "./PlayerModeSelector";

type Props = {
  game: Game,
  playersMode: [PlayerMode, PlayerMode],
  setPlayersMode: React.Dispatch<React.SetStateAction<[PlayerMode, PlayerMode]>>,
  handleReset: () => void,
};

function CheckmateDialog(props: Props) {
  const {
    game: { turn, move },
    playersMode,
    handleReset,
    setPlayersMode,
  } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleReset} />
      <div className="relative bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <h2 className="text-lg font-bold mb-4">{turn ? '先手' : '後手'}の勝ち</h2>
        <p>{move}手 詰み</p>
        <PlayerModeSelector playersMode={playersMode} setPlayersMode={setPlayersMode} />
        <div className="flex justify-end mt-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer" onClick={handleReset}>再戦</button>
        </div>
      </div>
    </div>
  );
}

export { CheckmateDialog }
