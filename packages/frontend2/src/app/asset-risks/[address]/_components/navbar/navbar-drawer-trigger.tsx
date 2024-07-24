'use client'

import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import { DrawerTrigger } from '~/app/_components/drawer'
import { formatAddress } from '~/utils/format-address'
import { ChangeButton } from '../change-button'

export function NavbarDrawerTrigger() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, address, ensName }) => {
        return isConnected ? (
          <div className="flex items-center gap-3">
            <Link
              className="text-sm font-medium text-black"
              href={`/asset-risks/${address}`}
            >
              {ensName ?? (address && formatAddress(address))}
            </Link>
            <DrawerTrigger>
              <ChangeButton />
            </DrawerTrigger>
          </div>
        ) : (
          <DrawerTrigger>
            <button className="rounded bg-pink-900 px-6 py-2 text-xs font-bold text-white">
              Scan assets
            </button>
          </DrawerTrigger>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
