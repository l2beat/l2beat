'use client'
import { useIsClient } from '~/hooks/use-is-client'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { ArrowRightIcon } from '~/icons/arrow-right'
import { CloseIcon } from '~/icons/close'
import { cn } from '~/utils/cn'
import { OutLink } from './out-link'

const localStorageTag = 'top-banner'
const purpose = 'fraud-proof-wars'

export function Banner({ className }: { className?: string }) {
  const isClient = useIsClient()
  const [isHidden, setIsHidden] = useLocalStorage(
    `${localStorageTag}-${purpose}-is-hidden`,
    false,
  )

  if (isHidden || !isClient) {
    return null
  }

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center gap-1 bg-gradient-to-r from-[#7F39B6] to-[#CD1BD3] py-1.5 text-white dark:text-white md:flex-row md:gap-3',
        className,
      )}
    >
      <div className="absolute right-3">
        <CloseIcon
          onClick={() => setIsHidden(true)}
          className="size-[12px] cursor-pointer fill-white transition-colors duration-200 hover:fill-white/90 md:size-[16px]"
        />
      </div>
      <div className="flex gap-1 text-sm">
        <span>New release:</span>
        <span className="font-medium">Fraud Proof Wars</span>
      </div>
      <BannerActionButton />
    </div>
  )
}

function BannerActionButton() {
  return (
    <OutLink
      href="https://x.com/l2beat/status/1826617479554310625"
      variant="plain"
      underline={false}
      className="text-white dark:text-white"
    >
      <div className="flex items-center justify-center gap-1 rounded-lg border border-[#9360BC] bg-[#53227A] px-5 py-1 transition-colors duration-200 hover:bg-[#53227A]/80">
        <span className="text-xs font-medium">Give it a read</span>
        <ArrowRightIcon fill="white" width={12} height={12} />
      </div>
    </OutLink>
  )
}
