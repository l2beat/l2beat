'use client'
import { ConnectKitButton } from 'connectkit'
import { ChangeButton } from '~/components/ChangeButton'

export function ChangeWalletButton({ wallet }: { wallet?: string }) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, ensName }) => {
        return (
          isConnected &&
          (wallet ? wallet === address || wallet === ensName : true) && (
            <ChangeButton show={show} />
          )
        )
      }}
    </ConnectKitButton.Custom>
  )
}
