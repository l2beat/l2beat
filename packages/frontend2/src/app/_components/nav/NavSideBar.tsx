import { cn } from '~/utils/cn'
import { NavSideBarWrapper } from './NavSideBarWrapper'
import { type NavGroup } from './types'
import { Logo } from '../Logo'
import { DarkThemeToggle } from '../DarkThemeToggle'
import { MobileNavTriggerClose } from './MobileNavTrigger'
import { NavLinkGroup } from './NavLinkGroup'
import { NavLink } from './NavLink'
import { NavDivider } from './NavDivider'
import { NavSmallLinkGroup } from './NavSmallLinkGroup'
import { NavSmallLink } from './NavSmallLink'
import { externalLinks } from '~/consts/external-links'
import {
  showZkCatalog,
  showGovernancePage,
  showGlossary,
  showHiringBadge,
} from '~/flags'
import { SocialLinks } from '../SocialLinks'
import { HiringBadge } from './HiringBadge'
import { NavSideBarCollapseToggle } from './NavSideBarCollapseToggle'
import Link from 'next/link'

export async function NavSideBar({
  groups,
  logoLink,
  legacyNav,
}: {
  groups: NavGroup[]
  logoLink: string
  legacyNav: boolean
}) {
  const sharedSizeClasses = cn(
    'w-full xl:w-[240px] 2xl:w-[280px] h-screen h-[100dvh]',
    legacyNav && 'xl:hidden xl:sidenav-collapsed:hidden',
  )

  return (
    <NavSideBarWrapper legacyNav={legacyNav}>
      <div
        className={cn(
          'xl:px-6 px-3.5 py-4 xl:py-[1.125rem] overflow-y-auto overflow-x-clip flex-1 flex flex-col gap-8',
          sharedSizeClasses,
        )}
      >
        <div className="flex flex-row justify-between items-center">
          <Link href={logoLink}>
            <Logo className="h-8 w-auto block xl:sidenav-collapsed:hidden" />
            <Logo
              small
              className="h-8 w-auto hidden xl:sidenav-collapsed:block"
            />
          </Link>
          <div className="xl:sidenav-collapsed:hidden flex flex-row gap-4 items-center">
            <DarkThemeToggle />
            <div className="xl:hidden h-6 w-6">
              <MobileNavTriggerClose />
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-6 flex-1">
          {groups.map((group) => (
            <NavLinkGroup key={group.title} title={group.title}>
              {group.links.map(
                (link) =>
                  link.enabled && (
                    <NavLink
                      key={link.href}
                      title={link.title}
                      icon={link.icon}
                      href={link.href}
                    />
                  ),
              )}
            </NavLinkGroup>
          ))}
          <NavDivider />
          <NavSmallLinkGroup>
            <NavSmallLink title="Forum" href={externalLinks.forum} />
            {(await showZkCatalog()) && (
              <NavSmallLink title="ZK Catalog" href="/zk-catalog" />
            )}
            <NavSmallLink title="Donate" href={'/donate'} />
            {(await showGovernancePage()) ? (
              <NavSmallLink title="Governance" href={'/governance'} />
            ) : (
              <NavSmallLink
                title="Governance"
                href="https://l2beat.notion.site/Delegate-your-votes-to-L2BEAT-8ffc452bed9a431cb158d1e4e19839e3"
              />
            )}
            {(await showGlossary()) && (
              <NavSmallLink title="Glossary" href="/glossary" />
            )}
            <NavSmallLink href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f">
              Jobs
              {(await showHiringBadge()) && <HiringBadge />}
            </NavSmallLink>
            <NavSmallLink title="FAQ" href="/faq" />
          </NavSmallLinkGroup>
          <NavDivider className="xl:hidden" />
          <ul className="xl:hidden flex flex-row gap-4 pb-12">
            <SocialLinks />
          </ul>
        </nav>
      </div>
      <div className="p-6 border-t border-gray-300 dark:border-gray-850 hidden xl:block xl:sidenav-collapsed:ml-1 transition-colors duration-300 ease-out">
        <NavSideBarCollapseToggle />
      </div>
    </NavSideBarWrapper>
  )
}
