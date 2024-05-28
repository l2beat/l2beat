'use client'
import { ConnectKitButton } from 'connectkit'
import { ChangeButton } from '~/components/ChangeButton'
import { DrawerTrigger } from '~/components/Drawer'
import { WalletDrawer } from '~/components/navbar/WalletDrawer'

export function ChangeWalletButton({ wallet }: { wallet?: string }) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, ensName }) => {
        return (
          isConnected &&
          (wallet ? wallet === address || wallet === ensName : true) && (
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
