'use client'

import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import { DrawerTrigger } from '~/app/_components/drawer'
import { formatAddress } from '~/app/utils/format-address'
import { ChangeButton } from '../change-button'

export function NavbarDrawerTrigger() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, address, ensName }) => {
        return isConnected ? (
          <div className="flex items-center gap-3">
            <Link
              className="font-medium text-sm text-black"
              href={`asset-risks/${address}`}
            >
              {ensName ?? (address && formatAddress(address))}
            </Link>
            <DrawerTrigger>
              <ChangeButton />
            </DrawerTrigger>
          </div>
        ) : (
          <DrawerTrigger>
            <button className="px-6 py-2 bg-pink-900 text-white text-xs font-bold rounded">
              Scan assets
            </button>
          </DrawerTrigger>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
