import { UnixTime } from '@l2beat/shared-pure'
import { useIsClient } from '~/hooks/useIsClient'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { CloseIcon } from '~/icons/Close'
import { cn } from '~/utils/cn'
import { CustomLink } from './link/CustomLink'

const localStorageTag = 'top-banner'
const purpose = 'recategorisation-live'

export function TopBanner({ className }: { className?: string }) {
  const enabled =
    UnixTime.now() < UnixTime.fromDate(new Date('2025-07-10T00:00:00Z'))
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
        'relative z-10 flex w-full flex-col items-center justify-center gap-1 bg-linear-to-r from-[#7F39B6] to-[#CD1BD3] py-1.5 text-white md:flex-row md:gap-3 dark:text-white',
        className,
      )}
    >
      <div className="absolute right-3">
        <CloseIcon
          onClick={() => setIsHidden(true)}
          className="size-[12px] cursor-pointer fill-white transition-colors duration-200 hover:fill-white/90 md:size-[16px]"
        />
      </div>
      <div className="text-balance text-center text-sm max-md:px-6">
        We recently introduced recategorisation and some projects were moved to
        Others.
      </div>
      <BannerActionButton />
    </div>
  )
}

function BannerActionButton() {
  return (
    <CustomLink
      href="https://medium.com/l2beat/framework-update-l2-projects-recategorization-5d43b0d1fe50"
      variant="plain"
      underline={false}
      className="text-white dark:text-white"
    >
      <div className="flex items-center justify-center gap-1 rounded-lg border border-[#9360BC] bg-[#53227A] px-5 py-1 transition-colors duration-200 hover:bg-[#53227A]/80">
        <span className="font-medium text-xs">Learn more</span>
      </div>
    </CustomLink>
  )
}
