'use client'
import { ConnectKitButton } from 'connectkit'
import { DrawerTrigger } from '~/app/_components/drawer'
import { ChangeButton } from './change-button'
import { WalletDrawer } from './wallet-drawer'

export function ChangeWalletButton({ wallet }: { wallet?: string }) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, ensName }) => {
        return (
          isConnected &&
          (!wallet || wallet === address || wallet === ensName) && (
            <>
              <div className="hidden md:flex items-center">
                <ChangeButton show={show} />
              </div>
              <div className="md:hidden flex items-center">
                <WalletDrawer>
                  <DrawerTrigger>
                    <ChangeButton />
                  </DrawerTrigger>
                </WalletDrawer>
              </div>
            </>
          )
        )
      }}
    </ConnectKitButton.Custom>
  )
}
