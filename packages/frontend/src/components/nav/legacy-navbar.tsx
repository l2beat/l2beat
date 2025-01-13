import Link from 'next/link'
import { externalLinks } from '~/consts/external-links'
import { env } from '~/env'
import { HiringBadge } from '../badge/hiring-badge'
import { DarkThemeToggle } from '../dark-theme-toggle'
import { Logo } from '../logo'
import { SmallSearchBarButton } from '../search-bar/search-bar-button'
import { SocialLinks } from '../social-links'
import { LegacyNavLink } from './legacy-nav-link'
import { type NavGroup } from './types'

/**
 * Legacy nav bar component used on old-style pages *on xl screens*.
 * Everywhere else, the new sidenav is used.
 */
export function LegacyNavbar({
  logoLink,
  groups,
}: { logoLink: string; groups: NavGroup[] }) {
  const hiringBadge = env.NEXT_PUBLIC_SHOW_HIRING_BADGE

  return (
    <div className="hidden h-[4.25rem] border-b border-gray-200 text-base dark:border-gray-850 [@media(min-width:1300px)]:block">
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
                <LegacyNavLink
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
                <LegacyNavLink
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
          <div className="hidden h-8 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
          <ul className="flex h-full items-center gap-1.5">
            <LegacyNavLink title="About Us" href="/about-us" />
            <LegacyNavLink title="Forum" href={externalLinks.forum} />
            <LegacyNavLink title="Donate" href="/donate" />
            <LegacyNavLink title="Governance" href="/governance" />
            <LegacyNavLink title="Glossary" href="/glossary" />
            <LegacyNavLink href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f">
              Jobs
              {hiringBadge && <HiringBadge />}
            </LegacyNavLink>
            <LegacyNavLink title="FAQ" href="/faq" />
          </ul>
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
          <div className="flex gap-4">
            <DarkThemeToggle />
            <SmallSearchBarButton />
          </div>
        </div>
      </nav>
    </div>
  )
}
