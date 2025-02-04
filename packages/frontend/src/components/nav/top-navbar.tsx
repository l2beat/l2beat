import Link from 'next/link'
import { externalLinks } from '~/consts/external-links'
import { env } from '~/env'
import { HiringBadge } from '../badge/hiring-badge'
import { VerticalSeparator } from '../core/vertical-separator'
import { DarkThemeToggle } from '../dark-theme-toggle'
import { Logo } from '../logo'
import { SmallSearchBarButton } from '../search-bar/search-bar-button'
import { SocialLinks } from '../social-links'
import { TopNavLink } from './top-nav-link'
import type { NavGroup } from './types'

/**
 * Top navbar component used on old-style pages *on xl screens*.
 * Everywhere else, the new sidenav is used.
 */
export function TopNavbar({
  logoLink,
  groups,
}: { logoLink: string; groups: NavGroup[] }) {
  const hiringBadge = env.NEXT_PUBLIC_SHOW_HIRING_BADGE

  return (
    <div className="hidden h-[4.25rem] border-b border-divider bg-header-primary text-base lg:block">
      <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-6">
        <ul className="flex items-center py-4">
          <li className="mr-8">
            <Link href={logoLink}>
              <Logo className="h-8 w-auto" />
            </Link>
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
          <VerticalSeparator className="hidden h-8 xl:block" />
          <ul className="flex h-full items-center">
            <TopNavLink title="About Us" href="/about-us" />
            <TopNavLink title="Forum" href={externalLinks.forum} />
            <TopNavLink title="Donate" href="/donate" />
            <TopNavLink title="Governance" href="/governance" />
            <TopNavLink title="Glossary" href="/glossary" />
            <TopNavLink href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f">
              Jobs
              {hiringBadge && <HiringBadge />}
            </TopNavLink>
            <TopNavLink title="FAQ" href="/faq" />
          </ul>
          <VerticalSeparator className="h-8" />
          <div className="flex gap-4">
            <DarkThemeToggle />
            <SmallSearchBarButton />
          </div>
        </div>
      </nav>
    </div>
  )
}
