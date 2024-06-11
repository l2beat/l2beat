import Link from 'next/link'
import { externalLinks } from '~/consts/external-links'
import { showHiringBadge } from '~/flags'
import { DarkThemeToggle } from '../dark-theme-toggle'
import { Logo } from '../logo'
import { SocialLinks } from '../social-links'
import { HiringBadge } from './hiring-badge'
import { MobileNavTriggerClose } from './mobile-nav-trigger'
import { NavDivider } from './nav-divider'
import { NavLink } from './nav-link'
import { NavLinkGroup } from './nav-link-group'
import { NavSideBarWrapper } from './nav-sidebar-wrapper'
import { NavSmallLink } from './nav-small-link'
import { NavSmallLinkGroup } from './nav-small-link-group'
import { type NavGroup } from './types'

export async function NavSidebar({
  groups,
  logoLink,
  legacyNav,
}: {
  groups: NavGroup[]
  logoLink: string
  legacyNav: boolean
}) {
  const hiringBadge = await showHiringBadge()
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
          <NavSmallLink title="ZK Catalog" href="/zk-catalog" />
          <NavSmallLink title="Donate" href="/donate" />
          <NavSmallLink
            title="Governance"
            href="/governance"
            activeBehavior={{ type: 'prefix', prefix: '/governance' }}
          />
          <NavSmallLink title="Glossary" href="/glossary" />
          <NavSmallLink href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f">
            Jobs
            {hiringBadge && <HiringBadge />}
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
