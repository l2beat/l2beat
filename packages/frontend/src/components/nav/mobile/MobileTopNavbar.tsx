import { cn } from '~/utils/cn'
import { Logo } from '../../Logo'
import { useRecategorisationPreviewContext } from '../../recategorisation-preview/RecategorisationPreviewProvider'
import { RecategorisationPreviewSwitch } from '../../recategorisation-preview/RecategorisationPreviewSwitch'
import { SmallSearchBarButton } from '../../search-bar/SearchBarButton'
import type { NavGroup } from '../types'
import { MobileNavTabs } from './MobileNavTabs'
import { MobileNavTriggerOpen } from './MobileNavTrigger'
import { MobileSelectedLink } from './MobileSelectedLink'

/**
 * Mobile navigation bar that is shown on the very top on small screens.
 */
export function MobileTopNavbar({
  groups,
  logoLink,
  className,
}: { groups: NavGroup[]; logoLink: string; className?: string }) {
  const { isScalingMainPage } = useRecategorisationPreviewContext()
  return (
    <div className={cn('z-10 lg:hidden', className)}>
      <div className="relative flex h-16 flex-row items-stretch justify-between gap-8 border-divider border-b bg-header-primary px-3.5">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="py-4">
            <a href={logoLink}>
              <Logo className="h-8 w-auto" />
            </a>
          </div>
          <MobileSelectedLink groups={groups} />
        </div>
        {/* Right side */}
        <div className="flex flex-row items-center gap-4">
          {isScalingMainPage && (
            <RecategorisationPreviewSwitch className="max-md:hidden lg:hidden" />
          )}
          <SmallSearchBarButton />
          <MobileNavTriggerOpen />
        </div>
      </div>
      <MobileNavTabs groups={groups} />
      {isScalingMainPage && (
        <div className="flex h-10 items-center border-divider border-b bg-header-primary px-4 py-1 md:hidden">
          <RecategorisationPreviewSwitch className="w-full justify-between font-medium" />
        </div>
      )}
    </div>
  )
}
