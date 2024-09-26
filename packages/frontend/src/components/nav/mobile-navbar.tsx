import Link from 'next/link'
import { ReactNode } from 'react'
import { Logo } from '../logo'
import { MobileNavLink } from './mobile-nav-link'
import { MobileNavTabs } from './mobile-nav-tabs'
import { MobileNavTriggerOpen } from './mobile-nav-trigger'
import { type NavGroup } from './types'

/**
 * Mobile navigation bar that is shown on the very top on small screens.
 */
export function MobileNavbar({
  groups,
  logoLink,
}: { groups: NavGroup[]; logoLink: string }) {
  return (
    <div className="xl:hidden">
      <div className="relative flex h-16 flex-row items-stretch justify-between gap-8 border-b border-gray-200 px-3.5 dark:border-gray-850">
        {/* Left side */}
        <div className="flex flex-row gap-4">
          <div className="py-4">
            <Link href={logoLink}>
              <Logo className="h-8 w-auto" />
            </Link>
          </div>
          <ul className="flex flex-row">
            <MobileNavLink
              title="Scaling"
              href="/scaling/summary"
              activeBehavior={{ type: 'prefix', prefix: '/scaling' }}
            />
            <MobileNavLink
              title="Bridges"
              href="/bridges/summary"
              activeBehavior={{ type: 'prefix', prefix: '/bridges' }}
            />
          </ul>
        </div>
        {/* Right side */}
        <div className="flex flex-row items-center">
          <MobileNavTriggerOpen />
        </div>
      </div>
      <MobileNavTabs groups={groups} />
    </div>
  )
}
