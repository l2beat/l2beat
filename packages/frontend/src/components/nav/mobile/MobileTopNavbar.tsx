import { usePathname } from '~/hooks/usePathname'
import { cn } from '~/utils/cn'
import { isLinkActive } from '~/utils/isLinkActive'
import { DarkThemeToggle } from '../../DarkThemeToggle'
import { Logo } from '../../Logo'
import { SmallSearchBarButton } from '../../search-bar/SearchBarButton'
import type { NavGroup, NavLink } from '../types'
import { MobileNavTabs } from './MobileNavTabs'
import { MobileNavTriggerOpen } from './MobileNavTrigger'
import { MobileSelectedLink } from './MobileSelectedLink'

/**
 * Mobile navigation bar that is shown on the very top on small screens.
 * With `showOnDesktop` it stays visible on all screens and renders the
 * top-level nav links inline — used on pages without a side nav (e.g. home).
 */
export function MobileTopNavbar({
  groups,
  logoLink,
  className,
  sideLinks,
  showOnDesktop = false,
}: {
  groups: NavGroup[]
  logoLink: string
  className?: string
  sideLinks: NavLink[]
  showOnDesktop?: boolean
}) {
  return (
    <div className={cn('z-10', !showOnDesktop && 'lg:hidden', className)}>
      <div className="relative flex h-16 flex-row items-stretch justify-between gap-8 border-divider border-b bg-header-primary px-3.5">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="py-4">
            <a href={logoLink} aria-label="Go to home">
              <Logo className="h-8 w-auto" />
            </a>
          </div>
          <div
            className={cn(
              'flex min-w-0 items-center gap-3',
              showOnDesktop && 'lg:hidden',
            )}
          >
            <MobileSelectedLink groups={groups} sideLinks={sideLinks} />
          </div>
          {showOnDesktop && <DesktopNavLinks groups={groups} />}
        </div>
        {/* Right side */}
        <div className="flex shrink-0 flex-row items-center gap-2 md:gap-3">
          {showOnDesktop && (
            <div className="hidden lg:flex">
              <DarkThemeToggle />
            </div>
          )}
          <SmallSearchBarButton />
          <MobileNavTriggerOpen />
        </div>
      </div>
      <div className={cn(showOnDesktop && 'lg:hidden')}>
        <MobileNavTabs groups={groups} />
      </div>
    </div>
  )
}

function DesktopNavLinks({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()
  return (
    <nav className="hidden min-w-0 items-center gap-1 lg:flex">
      {groups.map((group) => {
        const href = group.type === 'single' ? group.href : group.links[0]?.href
        if (!href) return null
        const isActive =
          group.type === 'single'
            ? isLinkActive({ href: group.href, pathname })
            : pathname.startsWith('/' + group.match)
        return (
          <a
            key={group.title}
            href={href}
            data-active={isActive}
            className="whitespace-nowrap rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-surface-tertiary data-[active=true]:text-brand"
          >
            {group.title}
          </a>
        )
      })}
    </nav>
  )
}
