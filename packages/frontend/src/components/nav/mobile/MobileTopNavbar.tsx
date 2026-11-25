import { useEffect, useRef } from 'react'
import { cn } from '~/utils/cn'
import { useSidebar } from '../../core/Sidebar'
import { Logo } from '../../Logo'
import { SmallSearchBarButton } from '../../search-bar/SearchBarButton'
import type { NavGroup, NavLink } from '../types'
import { MobileNavTabs } from './MobileNavTabs'
import { MobileNavTriggerOpen } from './MobileNavTrigger'
import { MobileSelectedLink } from './MobileSelectedLink'

/**
 * Mobile navigation bar that is shown on the very top on small screens.
 */
export function MobileTopNavbar({
  groups,
  logoLink,
  className,
  sideLinks,
}: {
  groups: NavGroup[]
  logoLink: string
  className?: string
  sideLinks: NavLink[]
}) {
  const stickyRef = useRetintStatusBarOnClose()
  return (
    <div className={cn('z-10 bg-header-primary lg:hidden', className)}>
      {/*
        iOS Safari tints its status bar like the sticky element at the top and
        keeps that tint until another one arrives. Sticky inside a wrapper of
        its own height, the navbar never moves, but takes the tint back when
        the page returns to the top.

        Safari draws the sticky navbar as a layer of its own and, scrolling
        back up fast, paints it a few frames late. The wrapper's background is
        painted with the page, so meanwhile its slot shows the navbar's colour
        instead of the grey backdrop behind it.
      */}
      <div ref={stickyRef} className="sticky top-0">
        <div className="relative flex h-16 flex-row items-stretch justify-between gap-8 border-divider border-b bg-header-primary px-3.5">
          {/* Left side */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="py-4">
              <a href={logoLink} aria-label="Go to home">
                <Logo className="block h-8 w-auto" />
              </a>
            </div>
            <MobileSelectedLink groups={groups} sideLinks={sideLinks} />
          </div>
          {/* Right side */}
          <div className="flex shrink-0 flex-row items-center gap-2 md:gap-3">
            <SmallSearchBarButton />
            <MobileNavTriggerOpen />
          </div>
        </div>
        <MobileNavTabs groups={groups} />
      </div>
    </div>
  )
}

/**
 * The open sidebar tints the status bar with its sticky grey header. On an
 * iPhone Duo, whose status bar runs down the side, Safari keeps that grey
 * after the sidebar closes, because nothing new arrives at the top: the
 * navbar was there all along. Taking the navbar off `sticky` for one painted
 * frame and back makes it arrive again. Inside a wrapper of its own height
 * the navbar never moves, so the swap can't be seen.
 */
function useRetintStatusBarOnClose() {
  const ref = useRef<HTMLDivElement>(null)
  const { openMobile } = useSidebar()
  const wasOpen = useRef(openMobile)

  useEffect(() => {
    const justClosed = wasOpen.current && !openMobile
    wasOpen.current = openMobile
    const navbar = ref.current
    if (!justClosed || !navbar) return

    navbar.style.position = 'static'
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        navbar.style.position = ''
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      navbar.style.position = ''
    }
  }, [openMobile])

  return ref
}
