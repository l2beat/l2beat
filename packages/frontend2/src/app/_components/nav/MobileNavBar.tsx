import { Logo } from '../Logo'
import { MobileNavLink } from './MobileNavLink'
import { MobileNavTabs } from './MobileNavTabs'
import { MobileNavTriggerOpen } from './MobileNavTrigger'
import { type NavGroup } from './types'

/**
 * Mobile navigation bar that is shown on the very top on small screens.
 */
export function MobileNavBar({
  groups,
  logoLink,
}: { groups: NavGroup[]; logoLink: string }) {
  return (
    <div className="xl:hidden">
      <div className="h-16 px-3.5 relative flex justify-between flex-row gap-8 border-b border-gray-200 dark:border-gray-850 items-stretch">
        {/* Left side */}
        <div className="flex flex-row gap-4">
          <div className="py-4">
            <a href={logoLink}>
              <Logo className="h-8 w-auto" />
            </a>
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
