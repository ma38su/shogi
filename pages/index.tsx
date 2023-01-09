import Head from 'next/head'
import { Container, Divider, Heading, Text } from '@chakra-ui/react'

import { InitialPosition } from '../data/data';
import { BoardSvg } from '../libs/components/BoardSvg'

export default function Home() {
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

        <BoardSvg position={InitialPosition} visibilityOptions={['Index']} />
      </Container>
    </>
  )
}
