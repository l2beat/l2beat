'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { env } from '~/env'

const config = getDefaultConfig({
  appName: 'L2BEAT',
  chains: [mainnet],
  ssr: true,
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
    </WagmiProvider>
  )
}
