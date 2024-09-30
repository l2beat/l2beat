import Link from 'next/link'
import { externalLinks } from '~/consts/external-links'
import { env } from '~/env'
import { HiringBadge } from '../badge/hiring-badge'
import { DarkThemeToggle } from '../dark-theme-toggle'
import { Logo } from '../logo'
import { SocialLinks } from '../social-links'
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
  const hiringBadge = env.NEXT_PUBLIC_SHOW_HIRING_BADGE
  return (
    <NavSideBarWrapper legacyNav={legacyNav}>
      <div className="flex flex-row items-center justify-between">
        <Link href={logoLink}>
          <Logo className="block h-8 w-auto" />
        </Link>
        <div className="flex flex-row items-center gap-4">
          <DarkThemeToggle />
          <div className="size-6 xl:hidden">
            <MobileNavTriggerClose />
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-6">
        {groups.map((group) => {
          return (
            <NavLinkGroup key={group.title} group={group}>
              {group.links.map(
                (link) =>
                  !link.disabled && (
                    <NavLink
                      key={link.href}
                      title={link.title}
                      icon={link.icon}
                      href={link.href}
                    />
                  ),
              )}
              {group.secondaryLinks && (
                <>
                  <NavDivider className="mx-1.5 my-1 w-auto" />
                  {group.secondaryLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      title={link.title}
                      icon={link.icon}
                      href={link.href}
                    />
                  ))}
                </>
              )}
            </NavLinkGroup>
          )
        })}
      </nav>
      <div>
        {/* Width calculated: 100% + 3rem (padding) + 4px (scrollbar - since we use gutter, we need to subtract it) */}
        <NavDivider className="-mx-6 w-[calc(100%+3rem+4px)]" />
        <NavSmallLinkGroup className="mt-5">
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
          <NavSmallLink
            title="Brand Kit"
            href="https://l2beat.notion.site/L2BEAT-Brand-Guidelines-f8b757302c0043e2839f22277781162b"
          />
          <NavSmallLink title="FAQ" href="/faq" />
        </NavSmallLinkGroup>
        <ul className="mb-[14px] mt-6 flex gap-2 text-2xl xl:justify-between">
          <SocialLinks variant="gray" />
        </ul>
      </div>
    </NavSideBarWrapper>
  )
}
