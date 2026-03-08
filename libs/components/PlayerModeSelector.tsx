import { PlayerMode } from "../shogi-ai";

type Props = {
  playersMode: [PlayerMode, PlayerMode],
  setPlayersMode: React.Dispatch<React.SetStateAction<[PlayerMode, PlayerMode]>>,
}

function PlayerModeSelector(props: Props) {

  const { playersMode: [senteMode, goteMode], setPlayersMode } = props;

  const handleSenteMode = (value: PlayerMode) => {
    setPlayersMode(([_, prevGoteMode]) => [value, prevGoteMode]);
  }

  const handleGoteMode = (value: PlayerMode) => {
    setPlayersMode(([prevSenteMode]) => [prevSenteMode, value]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span>先手</span>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name="sente" value="Player" checked={senteMode === 'Player'} onChange={() => handleSenteMode('Player')} />
          Player
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name="sente" value="AI" checked={senteMode === 'AI'} onChange={() => handleSenteMode('AI')} />
          AI
        </label>
      </div>

      <div className="flex items-center gap-3">
        <span>後手</span>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name="gote" value="Player" checked={goteMode === 'Player'} onChange={() => handleGoteMode('Player')} />
          Player
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name="gote" value="AI" checked={goteMode === 'AI'} onChange={() => handleGoteMode('AI')} />
          AI
        </label>
      </div>
    </div>
  );
}

export { PlayerModeSelector }
