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
import { type NavGroup } from './types'

interface Props {
  groups: NavGroup[]
  logoLink: string
  legacyNav: boolean
}

export async function NavSidebar({ groups, logoLink, legacyNav }: Props) {
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
      <nav className="ml-1 flex flex-1 flex-col gap-6">
        {groups.map((group) => (
          <NavLinkGroup key={group.title} group={group} />
        ))}
      </nav>
      <div>
        <NavSmallLinkGroup className="mt-5">
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
        <ul className="mb-[14px] mt-6 flex gap-2 text-2xl xl:justify-between">
          <SocialLinks variant="gray" />
        </ul>
      </div>
    </NavSideBarWrapper>
  )
}
