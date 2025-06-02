import { useIsClient } from '~/hooks/use-is-client'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { CloseIcon } from '~/icons/close'
import { cn } from '~/utils/cn'
import { CustomLink } from './link/custom-link'

const localStorageTag = 'top-banner'
const purpose = 'native-rollups-article'

const enabled = true

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
        'relative z-10 flex w-full flex-col items-center justify-center gap-1 bg-gradient-to-r from-[#7F39B6] to-[#CD1BD3] py-1.5 text-white md:flex-row md:gap-3 dark:text-white',
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
        Our latest article on native rollups is live!
      </div>
      <BannerActionButton />
    </div>
  )
}

function BannerActionButton() {
  return (
    <CustomLink
      href="https://medium.com/l2beat/native-rollups-where-they-are-and-where-they-are-going-cb21eb103d46"
      variant="plain"
      underline={false}
      className="text-white dark:text-white"
    >
      <div className="flex items-center justify-center gap-1 rounded-lg border border-[#9360BC] bg-[#53227A] px-5 py-1 transition-colors duration-200 hover:bg-[#53227A]/80">
        <span className="font-medium text-xs">Read article</span>
      </div>
    </CustomLink>
  )
}
