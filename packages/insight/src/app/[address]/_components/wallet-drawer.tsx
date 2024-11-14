'use client'

import { Drawer, DrawerClose, DrawerContent } from '~/components/core/drawer'
import { WalletInput } from '~/components/wallet-input'

export function WalletDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      {children}
      <DrawerContent>
        <div className="flex flex-col gap-8 px-4 py-8">
          <WalletInput />
          <DrawerClose className="text-zinc-800 text-sm font-medium underline">
            Close overlay
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
