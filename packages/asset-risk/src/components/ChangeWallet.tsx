import { ConnectKitButton } from 'connectkit'
import { cn } from '~/utils/cn'

export function ChangeWallet() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show }) => {
        return (
          isConnected && (
            <div
              className={cn(
                'w-full flex flex-row gap-2 border border-[#A3A3A3]',
                'text-[#A3A3A3] text-2xs font-semibold rounded px-[8px] py-[4px] cursor-pointer',
              )}
              onClick={show}
            >
              CHANGE
            </div>
          )
        )
      }}
    </ConnectKitButton.Custom>
  )
}
