import React from 'react';
import { Box, Button, Center, Container, Divider, Heading, position, Stack, Text } from '@chakra-ui/react'
import Head from 'next/head'

import { InitialPosition } from '../libs/record';
import { ShogiBoardSvg } from '../libs/components/BoardSvg'
import { VisibilityOption, VisibilityOptions } from '../libs/VisibilityOption';
import { Game, GameRecord, indexToXY, isCheck, isCheckmate, isPromotable, movePiece, PiecePosition, PieceSelection, PieceType, promote, updatePromotion, xyToIndex } from '../libs/shogi';
import { PromotionDialog } from '../libs/components/PromotionDialog';
import { GameRecordList, xyToLabel } from '../libs/components/GameRecordList';
import { CheckAlertDialog } from '../libs/components/CheckAlertDialog';
import { CheckmateDialog } from '../libs/components/CheckmateDialog';
import { calculateNextMove, moveNextByAi, PlayerMode } from '../libs/shogi-ai';
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

export default function Home() {
  const [visibilityOptions, setVisibilityOptions] = React.useState<VisibilityOption[]>(['移動範囲']);

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

  const { turn, move, records } = game;

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

    // AI処理
    const lastRecord = records.length > 0 ? records[records.length - 1] : null;
    if (isCheckmate(game)) {
      // 詰んでいる場合は処理しない
      return;
    }

    if (!isPromotable(lastRecord) || checkAlertChecked) {
      if (aiEnabled) {
        setGame(prev => moveNextByAi(prev));
      }
    }
  }, [game, playersMode, checkAlertChecked]);

  const isCheckmated = isCheckmate(game);
  const promotionDialogVisible = isPromotable(lastRecord);
  const checkDialogVisible = !promotionDialogVisible && !isCheckmated && !checkAlertChecked && isCheck(game, !turn);

  const [senteAi, goteAi] = playersMode;

  return (
    <>
      <Head>
        <title>Shogi38</title>
        <meta name="description" content="Shogi Board Prototype" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container maxWidth='40em'>

        { isCheckmated && <CheckmateDialog game={game} handleReset={handleResetGame} playersMode={playersMode} setPlayersMode={setPlayersMode} /> }
        { promotionDialogVisible && lastRecord && <PromotionDialog handlePromotion={handlePromotion} lastRecord={lastRecord} /> }
        { checkDialogVisible && <CheckAlertDialog isOpen={checkDialogVisible} handleClose={() => setCheckAlertChecked(true)} /> }

        <Heading>Shogi38</Heading>
        <Text>Shogi Board Prototype</Text>

        <Divider style={{marginTop: '5px', marginBottom: '10px'}} />

        <ShogiBoardSvg game={game} setGame={setGame} visibilityOptions={visibilityOptions} />

        <Center>
          <Stack>
            <Text>{move+1}手目 {turn ? '先手' : '後手'}番</Text>
            <Box>
              <PlayerModeSelector playersMode={playersMode} setPlayersMode={setPlayersMode} />
            </Box>
            <Button colorScheme='red' onClick={handleResetGame}>投了</Button>
          </Stack>
        </Center>

        <Divider style={{marginTop: '5px', marginBottom: '10px'}} />
          <Center>
            <Stack direction='row'>
            {
                VisibilityOptions.map((option) => {
                  return (
                    <Button key={option} colorScheme={visibilityOptions.includes(option) ? 'green' : 'blackAlpha'} onClick={() => handleVisibilityOptionChange(option)}>
                      {option}
                    </Button>
                  )
                })
              }
            </Stack>
          </Center>
        <GameRecordList records={records} />
      </Container>
    </>
  )
}
