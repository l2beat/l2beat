import { cn } from '~/utils/cn'
import { Logo } from '../../Logo'
import { SmallSearchBarButton } from '../../search-bar/SearchBarButton'
import type { NavGroup, NavLink } from '../types'
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
  sideLinks,
}: {
  groups: NavGroup[]
  logoLink: string
  className?: string
  sideLinks: NavLink[]
}) {
  return (
    <div className={cn('z-10 lg:hidden', className)}>
      <div className="relative flex h-16 flex-row items-stretch justify-between gap-8 border-divider border-b bg-header-primary px-3.5">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="py-4">
            <a href={logoLink} aria-label="Go to home">
              <Logo className="h-8 w-auto" />
            </a>
          </div>
          <MobileSelectedLink groups={groups} sideLinks={sideLinks} />
        </div>
        {/* Right side */}
        <div className="flex shrink-0 flex-row items-center gap-2 md:gap-3">
          <SmallSearchBarButton />
          <MobileNavTriggerOpen />
        </div>
      </div>
      <MobileNavTabs groups={groups} />
    </div>
  )
}
