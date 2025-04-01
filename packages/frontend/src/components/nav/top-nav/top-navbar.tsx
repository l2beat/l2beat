import { VerticalSeparator } from '../../core/vertical-separator'
import { DarkThemeToggle } from '../../dark-theme-toggle'
import { SmallSearchBarButton } from '../../search-bar/search-bar-button'
import { SocialLinks } from '../../social-links'
import type { NavGroup, NavLink } from '../types'
import { TopNavLink } from './top-nav-link'
import { TopNavLogo } from './top-nav-logo'

/**
 * Top navbar component used on old-style pages *on xl screens*.
 * Everywhere else, the new sidenav is used.
 */
export function TopNavbar({
  logoLink,
  groups,
  sideLinks,
}: { logoLink: string; groups: NavGroup[]; sideLinks: NavLink[] }) {
  return (
    <div className="hidden h-[4.25rem] border-b border-divider bg-header-primary text-base lg:block">
      <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-6">
        <ul className="flex items-center py-4">
          <li className="mr-8">
            <TopNavLogo logoLink={logoLink} />
          </li>
          {groups.map((group) => {
            if (group.type === 'single') {
              return (
                <TopNavLink
                  key={group.title}
                  large
                  href={group.href}
                  title={group.title}
                  withoutUnderline
                />
              )
            }
            return (
              group.links[0] && (
                <TopNavLink
                  key={group.title}
                  large
                  href={group.links[0].href}
                  title={group.title}
                  withoutUnderline
                />
              )
            )
          })}
        </ul>
        <div className="flex h-full items-center gap-5">
          <ul className="hidden items-center gap-4 xl:flex">
            <SocialLinks />
          </ul>
          <VerticalSeparator className="hidden h-8 max-md:border-none xl:block" />
          <ul className="flex h-full items-center">
            {sideLinks.map((link) => (
              <TopNavLink key={link.title} href={link.href}>
                {link.title}
                {link.accessory}
              </TopNavLink>
            ))}
          </ul>
          <VerticalSeparator className="h-8 max-md:border-none" />
          <div className="flex gap-4">
            <DarkThemeToggle />
            <SmallSearchBarButton />
          </div>
        </div>
      </nav>
    </div>
  )
}
