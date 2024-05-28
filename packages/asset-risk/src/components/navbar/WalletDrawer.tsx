'use client'

import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import { formatAddress } from '~/utils/formatAddress'
import { AddressForm } from '../AddressForm'
import { ChangeButton } from '../ChangeButton'
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '../Drawer'

export function WalletDrawer() {
  return (
    <Drawer>
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
      <DrawerContent>
        <div className="py-8 px-4 flex flex-col gap-8">
          <AddressForm />
          <DrawerClose className="text-zinc-800 font-medium text-sm underline">
            Close overlay
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
