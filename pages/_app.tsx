// pages/_app.js
import type { AppProps } from 'next/app'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

import '../styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
