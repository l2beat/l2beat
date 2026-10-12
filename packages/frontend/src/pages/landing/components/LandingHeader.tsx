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
 * Sticky, on the page's white, a hairline under it. Three columns from md, so
 * search sits in the true middle whatever the sides hold: the logo and the
 * theme toggle left, as in the app's sidebar; the socials, a hairline, and the
 * buttons right, Open dashboard the one solid thing on the page. Search is as
 * tall as the buttons and rounded like them, so the row reads as one line.
 * On phones search shrinks to its icon and Donate hides, to leave room for
 * Open dashboard; the socials show only on wide screens.
 */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-20 border-divider border-b bg-pure-white dark:bg-pure-black">
      <div
        className={`${LANDING_CONTAINER_CLASS} flex h-16 items-center justify-between gap-4 md:grid md:grid-cols-[1fr_minmax(0,14rem)_1fr] lg:grid-cols-[1fr_minmax(0,20rem)_1fr] xl:grid-cols-[1fr_minmax(0,18rem)_1fr] min-[960px]:grid-cols-[1fr_minmax(0,18rem)_1fr]`}
      >
        <div className="flex items-center gap-3">
          <a href="/" aria-label="L2BEAT" className="flex">
            <Logo className="block h-8 w-auto" />
          </a>
          <DarkThemeToggle />
        </div>
        <SearchBarButton className="hidden h-9 w-full rounded-md md:flex" />
        <div className="flex items-center justify-end gap-3">
          <div className="flex md:hidden">
            <SmallSearchBarButton />
          </div>
          <div className="hidden items-center gap-3 xl:flex [&>a]:flex">
            <SocialLinks variant="gray" />
          </div>
          <span aria-hidden className="hidden h-5 w-px bg-divider xl:block" />
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
