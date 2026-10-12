import { DarkThemeToggle } from '~/components/DarkThemeToggle'
import { Logo } from '~/components/Logo'
import { SocialLinks } from '~/components/SocialLinks'
import {
  SearchBarButton,
  SmallSearchBarButton,
} from '~/components/search-bar/SearchBarButton'
import { ChevronIcon } from '~/icons/Chevron'
import { HOME_PATH } from '~/pages/home/paths'
import { cn } from '~/utils/cn'
import { LANDING_BUTTON_CLASS, LANDING_CONTAINER_CLASS } from '../landingStyles'

/**
 * Sticky, on the page's white, a hairline under it. The logo and the theme
 * toggle sit left as in the app's sidebar, search in the middle; the buttons
 * sit right, Open dashboard the one solid thing on the page. Search shrinks
 * to its icon on phones, where Donate hides to leave room for Open
 * dashboard, and the socials show only on wide screens.
 */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-20 border-divider border-b bg-pure-white dark:bg-pure-black">
      <div
        className={`${LANDING_CONTAINER_CLASS} flex h-16 items-center justify-between gap-4`}
      >
        <div className="flex items-center gap-4">
          <a href="/" aria-label="L2BEAT">
            <Logo className="block h-8 w-auto" />
          </a>
          <DarkThemeToggle />
        </div>
        <SearchBarButton className="hidden w-full max-w-80 md:flex" />
        <div className="flex items-center gap-2 md:gap-3">
          <div className="md:hidden">
            <SmallSearchBarButton />
          </div>
          <div className="mr-2 hidden items-center gap-3.5 xl:flex">
            <SocialLinks variant="gray" />
          </div>
          <a
            href="/donate"
            className={cn(LANDING_BUTTON_CLASS.outline, 'max-sm:hidden')}
          >
            Donate
          </a>
          <a href={HOME_PATH} className={LANDING_BUTTON_CLASS.solid}>
            Open dashboard
            <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
          </a>
        </div>
      </div>
    </header>
  )
}
