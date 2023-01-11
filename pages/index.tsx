import React from 'react';
import { Box, Button, Container, Divider, Heading, Stack, Text } from '@chakra-ui/react'

import Head from 'next/head'

import { InitialPosition } from '../record/data';
import { BoardSvg } from '../libs/components/BoardSvg'
import { VisibilityOption, VisibilityOptions } from '../libs/VisibilityOption';
import { Game, GameRecord, isCheck, isCheckmate, isPromotable, PieceType, PlayerTurn, promote, xToLabel, xyToIndex, yToLabel } from '../libs/shogi';
import { PieceStand } from '../libs/components/PieceStand';
import { PromotionDialog } from '../libs/components/PromotionDialog';
import { GameRecordList } from '../libs/components/GameRecordList';
import { CheckAlertDialog } from '../libs/components/CheckAlertDialog';
import { CheckmateDialog } from '../libs/components/CheckmateDialog';

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

function updatePromotion(lastRecord: GameRecord, position: Map<number, [PieceType, PlayerTurn]>): Map<number, [PieceType, PlayerTurn]> {
  const { x, y, piece, turn, behavior } = lastRecord;
  if (behavior !== '成') {
    return position;
  }

  const index = xyToIndex(x, y);
  const promotedPiece = promote(piece);
  if (promotedPiece == null) throw new Error();
  position.set(index, [promotedPiece, turn]);
  return new Map(position);
}


export default function Home() {
  const [visibilityOptions, setVisibilityOptions] = React.useState<VisibilityOption[]>(['移動範囲']);

  const [checkAlertChecked, setCheckAlertChecked] = React.useState<boolean>(false);

  const handleVisibilityOptionChange = (option: VisibilityOption) => {
    const state = visibilityOptions.includes(option);
    if (state) {
      setVisibilityOptions(visibilityOptions.filter(op => op !== option));
    } else {
      setVisibilityOptions([...visibilityOptions, option]);
    }
  }

  const [game, setGame] = React.useState<Game>(newGame());
  const handleResetGame = () => {
    setGame(_ => newGame());
  };

  const [selectedPiece, setSelectedPiece] = React.useState<PieceType | null>(null);

  const handleDropPiece = (type: PieceType, turn: PlayerTurn) => {
    if (turn !== game.turn) {
      return;
    }

    console.log(type);
    setSelectedPiece(type);
  };

  const { turn, move, pieceInHand: [bPieceOfHand, wPieceOfHand], records } = game;

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
    setCheckAlertChecked(false);
  }, [game]);

  const isCheckmated = isCheckmate(game);
  const promotionDialogVisible = isPromotable(lastRecord);
  const checkDialogVisible = !promotionDialogVisible && !isCheckmated && !checkAlertChecked && isCheck(game, !turn);

  console.log('check', {
    my: isCheck(game, turn),
    opponent: isCheck(game, !turn),

    a: !promotionDialogVisible,
    b: !isCheckmated,
    c: !checkAlertChecked,
  })

  return (
    <>
      <Head>
        <title>Shogi38</title>
        <meta name="description" content="Shogi Board Prototype" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container>

        { isCheckmated && <CheckmateDialog game={game} handleReset={handleResetGame} /> }
        { promotionDialogVisible && lastRecord && <PromotionDialog handlePromotion={handlePromotion} lastRecord={lastRecord} /> }
        { checkDialogVisible && <CheckAlertDialog isOpen={checkDialogVisible} handleClose={() => setCheckAlertChecked(true)} /> }

        <Heading>Shogi38</Heading>
        <Text>Shogi Board Prototype</Text>

        <Divider style={{marginTop: '5px', marginBottom: '10px'}} />

        <BoardSvg game={game} setGame={setGame} visibilityOptions={visibilityOptions} />

        <Text>{move+1}手目 {turn ? '先手' : '後手'}番</Text>

        <Stack direction='row'>
          <Box width={90}>
            <Text>先手</Text>
            <PieceStand pieceInHand={bPieceOfHand} turn={true} disabled={!game.turn} selected={false} handleDropPiece={handleDropPiece}/>
          </Box>
          <Box width={90}>
            <Text>後手</Text>
            <PieceStand pieceInHand={wPieceOfHand} turn={false} disabled={game.turn} selected={false} handleDropPiece={handleDropPiece} />
          </Box>
          <Button colorScheme='red' onClick={handleResetGame}>投了</Button>
        </Stack>

        <Divider style={{marginTop: '5px', marginBottom: '10px'}} />

        <Stack direction='row'>
        <Text>表示</Text>
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

        <GameRecordList records={records} />
      </Container>
    </>
  )
}
