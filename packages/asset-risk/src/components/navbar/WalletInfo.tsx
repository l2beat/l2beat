'use client'
import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import { formatAddress } from '~/utils/formatAddress'
import { ChangeButton } from '../ChangeButton'

export function WalletInfo() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, ensName }) => {
        return isConnected ? (
          <div className="flex items-center gap-3">
            <Link
              className="font-medium text-sm text-black"
              href={`/wallet/${address}`}
            >
              {ensName ? ensName : address ? formatAddress(address) : null}
            </Link>
            <ChangeButton show={show} />
          </div>
        ) : (
          <button
            onClick={show}
            className="w-full h-10 bg-pink-900 text-white font-bold text-xs px-8 rounded-lg"
          >
            Connect a wallet
          </button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
