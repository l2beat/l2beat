import Link from 'next/link'
import { cn } from '~/utils/cn'
import { Logo } from '../logo'
import { SmallSearchBarButton } from '../search-bar/search-bar-button'
import { MobileNavTabs } from './mobile-nav-tabs'
import { MobileNavTriggerOpen } from './mobile-nav-trigger'
import { MobileSelectedLink } from './mobile-selected-link'
import { type NavGroup } from './types'

/**
 * Mobile navigation bar that is shown on the very top on small screens.
 */
export function MobileNavbar({
  groups,
  logoLink,
  className,
}: { groups: NavGroup[]; logoLink: string; className?: string }) {
  return (
    <div className={cn('lg:hidden', className)}>
      <div className="relative flex h-16 flex-row items-stretch justify-between gap-8 border-b border-divider bg-header-primary px-3.5">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="py-4">
            <Link href={logoLink}>
              <Logo className="h-8 w-auto" />
            </Link>
          </div>
          <MobileSelectedLink groups={groups} />
        </div>
        {/* Right side */}
        <div className="flex flex-row items-center gap-4">
          <SmallSearchBarButton />
          <MobileNavTriggerOpen />
        </div>
      </div>
      <MobileNavTabs groups={groups} />
    </div>
  )
}
