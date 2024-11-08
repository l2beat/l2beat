'use client'

import { Drawer, DrawerClose, DrawerContent } from '../../_components/drawer'
import { WalletInput } from '../../_components/wallet-input'

export function WalletDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      {children}
      <DrawerContent>
        <div className="flex flex-col gap-8 px-4 py-8">
          <WalletInput />
          <DrawerClose className="text-sm font-medium text-zinc-800 underline">
            Close overlay
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
