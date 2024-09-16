'use client'

import { AddressForm } from '../../_components/address-form'
import { Drawer, DrawerClose, DrawerContent } from '../../_components/drawer'

export function WalletDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      {children}
      <DrawerContent>
        <div className="flex flex-col gap-8 px-4 py-8">
          <AddressForm />
          <DrawerClose className="text-sm font-medium text-zinc-800 underline">
            Close overlay
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
