'use client'

import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import { formatAddress } from '~/utils/formatAddress'
import { ChangeButton } from '../ChangeButton'
import { DrawerTrigger } from '../Drawer'

export function NavbarDrawerTrigger() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, address, ensName }) => {
        return isConnected ? (
          <div className="flex items-center gap-3">
            <Link
              className="font-medium text-sm text-black"
              href={`/wallet/${address}`}
            >
              {ensName ? ensName : address ? formatAddress(address) : null}
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
