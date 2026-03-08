import React from 'react';

import { InitialPosition } from '../libs/record';
import { ShogiBoardSvg } from '../libs/components/BoardSvg';
import { VisibilityOption, VisibilityOptions } from '../libs/VisibilityOption';
import { Game, GameRecord, isCheck, isCheckmate, isPromotable, PieceType, updatePromotion } from '../libs/shogi';
import { PromotionDialog } from '../libs/components/PromotionDialog';
import { GameRecordList } from '../libs/components/GameRecordList';
import { CheckAlertDialog } from '../libs/components/CheckAlertDialog';
import { CheckmateDialog } from '../libs/components/CheckmateDialog';
import { moveNextByAi, PlayerMode } from '../libs/shogi-ai';
import { PlayerModeSelector } from '../libs/components/PlayerModeSelector';

function newGame(): Game {
  return {
    turn: true,
    move: 0,
    pieceInHand: [
      new Map<PieceType, number>(),
      new Map<PieceType, number>(),
    ],
    position: new Map(InitialPosition),
    records: [],
  } satisfies Game;
}

export default function App() {
  const [visibilityOptions, setVisibilityOptions] = React.useState<VisibilityOption[]>(['移動候補表示']);

  const [checkAlertChecked, setCheckAlertChecked] = React.useState<boolean>(false);

  const [playersMode, setPlayersMode] = React.useState<[PlayerMode, PlayerMode]>(['Player', 'AI']);

  const handleVisibilityOptionChange = (option: VisibilityOption) => {
    const state = visibilityOptions.includes(option);
    if (state) {
      setVisibilityOptions(visibilityOptions.filter(op => op !== option));
    } else {
      setVisibilityOptions([...visibilityOptions, option]);
    }
  }

  const [game, setGame] = React.useState<Game>(newGame());
  const handleResetGame = () => setGame(newGame());

  const { position, turn, move, records } = game;

  const lastRecord = records.length > 0 ? records[records.length - 1] : null;

  const handlePromotion = (promoted: boolean) => {
    setGame(prev => {
      const { position, records } = prev;
      if (records.length === 0) throw new Error();

      const lastRecord = {
        ...records[records.length - 1],
        behavior: promoted ? '成' : '不成'
      } satisfies GameRecord;

      const newPosition = updatePromotion(lastRecord, position);
      return {
        ...prev,
        position: newPosition,
        records: [...prev.records.slice(0, prev.records.length - 1), lastRecord],
      } satisfies Game;
    });
  }

  React.useEffect(() => {
    const [ senteAi, goteAi ] = playersMode;
    const { turn, records } = game;

    const aiEnabled = (senteAi === 'AI' && turn) || (goteAi === 'AI' && !turn);
    if (!aiEnabled) {
      setCheckAlertChecked(false);
    }
    const lastRecord = records.length > 0 ? records[records.length - 1] : null;
    if (isCheckmate(game)) {
      return;
    }

    if (!isPromotable(lastRecord)) {
      if (aiEnabled) {
        setTimeout(() => {
          setGame(moveNextByAi(game));
        }, 0);
      }
    }
  }, [game, playersMode]);

  const isCheckmated = isCheckmate(game);
  const promotionDialogVisible = isPromotable(lastRecord);
  const checkDialogVisible = !promotionDialogVisible && !isCheckmated && !checkAlertChecked && isCheck(position, !turn);

  const [ senteAi, goteAi ] = playersMode;
  const aiEnabled = (senteAi === 'AI' && turn) || (goteAi === 'AI' && !turn);

  return (
    <div className="max-w-[55em] mx-auto px-4 py-4">

      { isCheckmated && <CheckmateDialog game={game} handleReset={handleResetGame} playersMode={playersMode} setPlayersMode={setPlayersMode} /> }
      { promotionDialogVisible && lastRecord && <PromotionDialog handlePromotion={handlePromotion} lastRecord={lastRecord} /> }
      { checkDialogVisible && !aiEnabled && <CheckAlertDialog isOpen={checkDialogVisible} handleClose={() => setCheckAlertChecked(true)} /> }

      <h1 className="text-2xl font-bold">Shogi38</h1>
      <p className="text-gray-600">Shogi Board Prototype</p>

      <hr className="my-2" />

      <ShogiBoardSvg game={game} setGame={setGame} visibilityOptions={visibilityOptions} />

      <div className="flex justify-center mt-4">
        <div className="flex flex-col items-center gap-2">
          <p>{move+1}手目 {turn ? '先手' : '後手'}番</p>
          <div>
            <PlayerModeSelector playersMode={playersMode} setPlayersMode={setPlayersMode} />
          </div>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
            onClick={handleResetGame}
          >
            投了
          </button>
        </div>
      </div>

      <hr className="my-2" />
      <div className="flex justify-center">
        <div className="flex flex-row gap-2">
          {
            VisibilityOptions.map((option) => {
              return (
                <button
                  key={option}
                  className={`px-3 py-1.5 rounded cursor-pointer ${
                    visibilityOptions.includes(option)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                  onClick={() => handleVisibilityOptionChange(option)}
                >
                  {option}
                </button>
              )
            })
          }
        </div>
      </div>
      <GameRecordList records={records} />
    </div>
  )
}
