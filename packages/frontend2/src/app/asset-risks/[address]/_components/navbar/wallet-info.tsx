'use client'
import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { formatAddress } from '~/utils/format-address'
import { ChangeButton } from '../change-button'

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
              className="text-sm font-medium text-black"
              href={`/asset-risks/${address}`}
            >
              {ensName ?? (address && formatAddress(address))}
            </Link>
            <ChangeButton show={show} />
          </div>
        ) : (
          <button
            onClick={show}
            className="h-10 w-full rounded-lg bg-pink-900 px-8 text-xs font-bold text-white"
          >
            Connect a wallet
          </button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
