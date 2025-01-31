import Link from 'next/link'
import { externalLinks } from '~/consts/external-links'
import { env } from '~/env'
import { HiringBadge } from '../badge/hiring-badge'
import { DarkThemeToggle } from '../dark-theme-toggle'
import { Logo } from '../logo'
import { SocialLinks } from '../social-links'
import { MobileNavTriggerClose } from './mobile-nav-trigger'
import { NavLinkGroup } from './nav-link-group'
import { NavSideBarWrapper } from './nav-sidebar-wrapper'
import { NavSmallLink } from './nav-small-link'
import { NavSmallLinkGroup } from './nav-small-link-group'
import type { NavGroup } from './types'

interface Props {
  groups: NavGroup[]
  logoLink: string
  topNavbar: boolean
}

export async function NavSidebar({ groups, logoLink, topNavbar }: Props) {
  const hiringBadge = env.NEXT_PUBLIC_SHOW_HIRING_BADGE
  return (
    <NavSideBarWrapper topNavbar={topNavbar}>
      <div className="flex h-[38px] flex-row items-center justify-between">
        <Link href={logoLink}>
          <Logo className="block h-8 w-auto" />
        </Link>
        <div className="flex flex-row items-center gap-4">
          <DarkThemeToggle />
          <div className="size-6 lg:hidden">
            <MobileNavTriggerClose />
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {groups.map((group) => (
          <NavLinkGroup key={group.title} group={group} />
        ))}
      </nav>
      <div>
        <NavSmallLinkGroup className="mt-5">
          <NavSmallLink title="About Us" href="/about-us" />
          <NavSmallLink title="Forum" href={externalLinks.forum} />
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
        <ul className="mb-10 mt-8 flex gap-2 text-2xl lg:justify-between">
          <SocialLinks variant="gray" />
        </ul>
      </div>
    </NavSideBarWrapper>
  )
}
