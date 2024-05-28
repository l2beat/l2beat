'use client'
import { AddressForm } from '../AddressForm'
import { Drawer, DrawerClose, DrawerContent } from '../Drawer'

export function WalletDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      {children}
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
