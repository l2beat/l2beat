'use client'
import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { formatAddress } from '~/utils/formatAddress'
import { ChangeButton } from '../ChangeButton'

export function WalletInfo() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, ensName }) => {
        return isConnected ? (
          <div className="flex items-center gap-2">
            {address && (
              <Jazzicon diameter={28} seed={jsNumberForAddress(address)} />
            )}
            <Link
              className="font-medium text-sm text-black"
              href={`/wallet/${address}`}
            >
              {ensName ?? (address && formatAddress(address))}
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
