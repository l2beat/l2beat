import Link from 'next/link'
import { externalLinks } from '~/consts/external-links'
import {
  showGlossary,
  showGovernancePage,
  showHiringBadge,
  showZkCatalog,
} from '~/flags'
import { DarkThemeToggle } from '../DarkThemeToggle'
import { Logo } from '../Logo'
import { SocialLinks } from '../SocialLinks'
import { HiringBadge } from './HiringBadge'
import { LegacyNavLink } from './LegacyNavLink'
import { type NavGroup } from './types'

/**
 * Legacy nav bar component used on old-style pages *on xl screens*.
 * Everywhere else, the new sidenav is used.
 */
export async function LegacyNavBar({
  logoLink,
  groups,
}: { logoLink: string; groups: NavGroup[] }) {
  const [zkCatalog, governance, hiringBadge, glossary] = await Promise.all([
    showZkCatalog(),
    showGovernancePage(),
    showHiringBadge(),
    showGlossary(),
  ])

  return (
    <div className="h-[4.25rem] border-b border-gray-200 text-base dark:border-gray-850 hidden xl:block">
      <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-6">
        <ul className="flex py-4 items-center">
          <li className="mr-8">
            <Link href={logoLink}>
              <Logo className="h-8 w-auto" />
            </Link>
          </li>
          {groups.map(
            (group) =>
              group.links[0] && (
                <LegacyNavLink
                  key={group.title}
                  large
                  href={group.links[0].href}
                  title={group.title}
                />
              ),
          )}
        </ul>
        <div className="flex h-full items-center gap-5">
          <ul className="items-center gap-4 hidden 2xl:flex">
            <SocialLinks />
          </ul>
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden 2xl:block" />
          <ul className="flex h-full items-center gap-1.5">
            <LegacyNavLink title="Forum" href={externalLinks.forum} />
            {zkCatalog && (
              <LegacyNavLink title="ZK Catalog" href="/zk-catalog" />
            )}
            <LegacyNavLink title="Donate" href={'/donate'} />
            {governance ? (
              <LegacyNavLink title="Governance" href={'/governance'} />
            ) : (
              <LegacyNavLink
                title="Governance"
                href="https://l2beat.notion.site/Delegate-your-votes-to-L2BEAT-8ffc452bed9a431cb158d1e4e19839e3"
              />
            )}
            {glossary && <LegacyNavLink title="Glossary" href="/glossary" />}
            <LegacyNavLink href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f">
              Jobs
              {hiringBadge && <HiringBadge />}
            </LegacyNavLink>
            <LegacyNavLink title="FAQ" href="/faq" />
          </ul>
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
          <DarkThemeToggle />
        </div>
      </nav>
    </div>
  )
}
