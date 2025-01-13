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
  legacyNav,
}: { groups: NavGroup[]; logoLink: string; legacyNav: boolean }) {
  return (
    <div
      className={cn(
        'sidebar:md:mb-5',
        legacyNav ? '[@media(min-width:1300px)]:hidden' : 'lg:hidden',
      )}
    >
      <div className="relative flex h-16 flex-row items-stretch justify-between gap-8 border-b border-gray-200 px-3.5 sidebar:bg-surface-primary dark:border-gray-850">
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
