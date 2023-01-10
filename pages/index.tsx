import React from 'react';
import { Button, Container, Divider, Heading, Text } from '@chakra-ui/react'

import Head from 'next/head'

import { InitialPosition } from '../record/data';
import { BoardSvg } from '../libs/components/BoardSvg'
import { VisibilityOption, VisibilityOptions } from '../libs/VisibilityOption';

export default function Home() {
  const [visibilityOptions, setVisibilityOptions] = React.useState<VisibilityOption[]>([]);

  const handleVisibilityOptionChange = (option: VisibilityOption) => {
    const state = visibilityOptions.includes(option);
    if (state) {
      setVisibilityOptions(visibilityOptions.filter(op => op !== option));
    } else {
      setVisibilityOptions([...visibilityOptions, option]);
    }
  }

  const [position, setPosition] = React.useState(InitialPosition);
  const handleResetPosition = () => {
    setPosition(new Map(InitialPosition));
  };

  return (
    <>
      <Head>
        <title>Shogi38</title>
        <meta name="description" content="Prototype Shogi AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container>

        <Heading>Shogi38</Heading>
        <Text>Prototype Shogi AI</Text>

        <Divider style={{marginTop: '5px', marginBottom: '10px'}} />

        <BoardSvg position={position} setPosition={setPosition} visibilityOptions={visibilityOptions} />

        <Button colorScheme='red' onClick={handleResetPosition}>Reset</Button>

        {
          VisibilityOptions.map((option) => {
            return (
              <Button key={option} colorScheme={visibilityOptions.includes(option) ? 'blue' : 'gray'} onClick={() => handleVisibilityOptionChange(option)}>
                {option}
              </Button>
            )
          })
        }
      </Container>
    </>
  )
}
