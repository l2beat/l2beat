'use client'

import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { type ReactNode } from 'react'
import { createConfig, WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { env } from '~/env'

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet],
    ssr: true,

    // Required API Keys
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

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
