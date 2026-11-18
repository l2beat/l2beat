import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/** Names the canvas colour the root takes for overscroll - see globals.css. */
export type PageBackdropName = 'garden' | 'plot'

/**
 * A viewport-sized layer that follows the reader, for `SideNavLayout`'s
 * `backdrop` slot. Sticky rather than fixed so it scrolls away with the page;
 * the negative bottom margin gives back the height it takes up.
 *
 * It is as tall as the largest viewport, so it still reaches the screen's
 * bottom edge when the browser's toolbar retracts, or floats over the page as
 * in iOS 26 Safari, where the small viewport ends above the toolbar.
 */
export function PageBackdrop({
  name,
  children,
  className,
}: {
  name: PageBackdropName
  children: ReactNode
  className?: string
}) {
  return (
    <div
      aria-hidden
      data-backdrop={name}
      className={cn(
        '-z-10 -mb-[100lvh] pointer-events-none sticky top-0 h-lvh overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * The backdrop's shapes (clouds, hills, furrows). From lg they start right of
 * the nav: the nav has no background of its own over a backdrop, so a shape
 * behind it would run through its links. Washes of colour can stay full-width.
 *
 * Sized to the small viewport, so shapes on its bottom edge stay in sight
 * while the toolbar shows. Ground drawn past that edge fills the rest of the
 * backdrop, which ends at the screen's bottom edge.
 */
export function PageBackdropScenery({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-0 top-0 h-svh lg:left-(--sidebar-width) lg:[mask-image:linear-gradient(to_right,transparent,black_3rem)]">
      {children}
    </div>
  )
}
