'use client'

import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { type ReactNode } from 'react'
import { WagmiProvider, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { env } from '~/env'

const walletConnectProjectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!walletConnectProjectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
}

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet],
    ssr: true,

    // Required API Keys
    walletConnectProjectId,

    // Required App Info
    appName: 'L2BEAT',

    // Optional App Info
    // appDescription: 'Your App Description',
    // appUrl: 'https://l2beat.com', // your app's url
    // appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
)

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiProvider>
  )
}
