import React from 'react';
import { Box, Button, Container, Divider, Heading, Stack, Text } from '@chakra-ui/react'

import Head from 'next/head'

import { InitialPosition } from '../record/data';
import { BoardSvg } from '../libs/components/BoardSvg'
import { VisibilityOption, VisibilityOptions } from '../libs/VisibilityOption';
import { Game, PieceType } from '../libs/shogi';
import { PieceStand } from '../libs/components/PieceStand';

function newGame(): Game {
  return {
    turn: true,
    move: 0,
    pieceInHand: [
      new Map<PieceType, number>(),
      new Map<PieceType, number>(),
    ],
    position: new Map(InitialPosition),
  } satisfies Game;
}

export default function Home() {
  const [visibilityOptions, setVisibilityOptions] = React.useState<VisibilityOption[]>(['移動範囲']);

  const handleVisibilityOptionChange = (option: VisibilityOption) => {
    const state = visibilityOptions.includes(option);
    if (state) {
      setVisibilityOptions(visibilityOptions.filter(op => op !== option));
    } else {
      setVisibilityOptions([...visibilityOptions, option]);
    }
  }

  const [game, setGame] = React.useState<Game>(newGame());
  const handleResetPosition = () => {
    setGame(_ => newGame());
  };

  const { turn, move, pieceInHand: [bPieceOfHand, wPieceOfHand] } = game;
  return (
    <>
      <Head>
        <title>Shogi38</title>
        <meta name="description" content="Shogi Board Prototype" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container>

        <Heading>Shogi38</Heading>
        <Text>Shogi Board Prototype</Text>

        <Divider style={{marginTop: '5px', marginBottom: '10px'}} />

        <BoardSvg game={game} setGame={setGame} visibilityOptions={visibilityOptions} />

        <Text>{move+1}手目 {turn ? '先手' : '後手'}番</Text>

        <Stack direction='row'>
          <Box width={90}>
            <Text>先手</Text>
            <PieceStand pieceInHand={bPieceOfHand}/>
          </Box>
          <Box width={90}>
            <Text>後手</Text>
            <PieceStand pieceInHand={wPieceOfHand}/>
          </Box>
          <Button colorScheme='red' onClick={handleResetPosition}>投了</Button>
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

      </Container>
    </>
  )
}
