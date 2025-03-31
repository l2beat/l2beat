import Link from 'next/link'
import { externalLinks } from '~/consts/external-links'
import { env } from '~/env'
import { HiringBadge } from '../badge/hiring-badge'
import { Button } from '../core/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../core/dialog'
import { DarkThemeToggle } from '../dark-theme-toggle'
import { Logo } from '../logo'
import { PizzaIcon } from '../main-page-header'
import { StepController } from '../pizza-flow'
import { FullGreenPizzaSymbol } from '../rosette/pizza/real-elements/full-green-pizza'
import { FullRedPizzaSymbol } from '../rosette/pizza/real-elements/full-red-pizza'
import { FullYellowPizzaSymbol } from '../rosette/pizza/real-elements/full-yellow-pizza'
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
      <Dialog>
        <DialogTrigger>
          <Button className="flex w-full items-center justify-center gap-1 rounded-[4px] bg-pink-900 px-6 py-3 text-xs text-white hover:bg-pink-900/90 dark:bg-pink-200 dark:text-black dark:hover:bg-pink-200/90">
            <span>Make a Pizza</span>
            <PizzaIcon />
          </Button>
          <div className="h-0">
            <FullRedPizzaSymbol />
            <FullYellowPizzaSymbol />
            <FullGreenPizzaSymbol />
          </div>
        </DialogTrigger>

        <DialogContent className="flex items-center justify-center pt-16">
          <DialogTitle className="hidden">Pizza time</DialogTitle>
          <StepController />
          <DialogClose className="absolute right-5 top-5 flex size-[20px] items-center justify-center rounded-sm bg-[#9621BF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-primary-invert"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </DialogClose>
        </DialogContent>
      </Dialog>

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
