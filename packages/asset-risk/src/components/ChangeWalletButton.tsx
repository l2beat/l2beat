'use client'
import { ConnectKitButton } from 'connectkit'
import { cn } from '~/utils/cn'

export function ChangeWalletButton({ wallet }: { wallet?: string }) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, ensName }) => {
        return (
          isConnected &&
          (wallet ? wallet === address || wallet === ensName : true) && (
            <button
              className={cn(
                'w-16 h-5 flex items-center justify-center border border-[#A3A3A3]',
                'text-[#A3A3A3] text-2xs font-semibold rounded px-[8px] py-[4px] cursor-pointer',
              )}
              onClick={show}
            >
              CHANGE
            </button>
          )
        )
      }}
    </ConnectKitButton.Custom>
  )
}
