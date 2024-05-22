'use client'

import { ConnectKitButton } from 'connectkit'
import { ChangeWalletButton } from '~/components/ChangeWalletButton'

export function ChangeWallet({ wallet }: { wallet: string }) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, ensName }) => {
        return (
          isConnected &&
          (wallet === address || wallet === ensName) && (
            <ChangeWalletButton show={show} />
          )
        )
      }}
    </ConnectKitButton.Custom>
  )
}
