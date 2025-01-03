'use client'
import { useIsClient } from '~/hooks/use-is-client'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { CloseIcon } from '~/icons/close'
import { cn } from '~/utils/cn'
import { CustomLink } from './link/custom-link'

const localStorageTag = 'top-banner'
const purpose = 'gg-22'

const enabled = false

export function Banner({ className }: { className?: string }) {
  const isClient = useIsClient()
  const [isHidden, setIsHidden] = useLocalStorage(
    `${localStorageTag}-${purpose}-is-hidden`,
    false,
  )

  if (isHidden || !isClient || !enabled) {
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
      <div className="text-sm">
        L2BEAT is participating in Gitcoin Grants 22!
      </div>
      <BannerActionButton />
    </div>
  )
}

function BannerActionButton() {
  return (
    <CustomLink
      href="https://explorer.gitcoin.co/#/round/42161/610/26"
      variant="plain"
      underline={false}
      className="text-white dark:text-white"
    >
      <div className="flex items-center justify-center gap-1 rounded-lg border border-[#9360BC] bg-[#53227A] px-5 py-1 transition-colors duration-200 hover:bg-[#53227A]/80">
        <span className="text-xs font-medium">Donate</span>
      </div>
    </CustomLink>
  )
}
