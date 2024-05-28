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
import { MobileNavTriggerClose } from './MobileNavTrigger'
import { NavDivider } from './NavDivider'
import { NavLink } from './NavLink'
import { NavLinkGroup } from './NavLinkGroup'
import { NavSideBarWrapper } from './NavSideBarWrapper'
import { NavSmallLink } from './NavSmallLink'
import { NavSmallLinkGroup } from './NavSmallLinkGroup'
import { type NavGroup } from './types'

export async function NavSideBar({
  groups,
  logoLink,
  legacyNav,
}: {
  groups: NavGroup[]
  logoLink: string
  legacyNav: boolean
}) {
  return (
    <NavSideBarWrapper legacyNav={legacyNav}>
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
    </NavSideBarWrapper>
  )
}
