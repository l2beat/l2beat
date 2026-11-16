import { useCallback } from 'react'
import { Logo } from '~/components/Logo'
import { stickyTopBarRef } from '~/components/table/stickyTopBar'
import { cn } from '~/utils/cn'
import { MobileSectionNavigation } from './MobileSectionNavigation'
import type { SectionNavigationItem } from './SectionNavigation'

interface Props {
  sections: SectionNavigationItem[]
  project?: Project
  className?: string
}

interface Project {
  name: string
  icon: string
}

/**
 * The section navigation as the bar that sticks to the top of a page below
 * `lg`, where the side navigation is hidden.
 */
export function StickyMobileSectionNavigation({
  sections,
  project,
  className,
}: Props) {
  const hasProject = !!project
  const tabsRef = useCallback(
    (tabs: HTMLDivElement | null) => {
      const stopRevealing =
        tabs && hasProject ? revealStripAsTitleGoesUnder(tabs) : undefined
      // With a strip, the strip holds the top edge; the tabs move under it.
      const stopFilling =
        tabs && !hasProject ? fillAboveWhileStuck(tabs) : undefined
      const stopPublishing = stickyTopBarRef(tabs)
      return () => {
        stopRevealing?.()
        stopFilling?.()
        stopPublishing?.()
      }
    },
    [hasProject],
  )

  return (
    <>
      {project && <ProjectStrip project={project} />}
      <div
        ref={tabsRef}
        className={cn(
          'md:-mx-5 sticky z-100 lg:hidden',
          project ? 'section-nav-tabs-under-strip' : 'top-0',
          className,
        )}
      >
        <MobileSectionNavigation sections={sections} />
      </div>
    </>
  )
}

/**
 * While `bar` is stuck to the top, paints the header colour just above the
 * viewport. In-app browsers like Telegram's put the page under a see-through
 * top bar and show what is scrolled above the viewport there. They clip fixed
 * and sticky elements to the viewport, so the fill is an element that scrolls
 * with the page and a scroll-driven animation keeps it above the viewport (see
 * `section-navigation.css`). Elsewhere it is off-screen.
 */
function fillAboveWhileStuck(bar: HTMLElement) {
  const root = document.documentElement
  const fill = document.createElement('div')
  fill.className = 'section-nav-top-fill'
  fill.hidden = true
  document.body.append(fill)

  // The animation moves the fill by the whole scroll range. `innerHeight`, not
  // `clientHeight`: iOS Safari keeps `clientHeight` at the toolbar-shown
  // height, so once the toolbar hides, the range runs long and the fill drifts
  // down over the bar, by up to the toolbar's height at the page's end.
  const updateRange = () =>
    root.style.setProperty(
      '--scroll-range',
      `${root.scrollHeight - window.innerHeight}px`,
    )
  // The range changes with the page's height, and with the viewport's, which
  // in-app browsers change as their bars hide.
  const resizeObserver = new ResizeObserver(updateRange)
  resizeObserver.observe(document.body)
  window.addEventListener('resize', updateRange)

  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      const { top, height } = entry.boundingClientRect
      // A bar hidden at this width has no box and is never stuck.
      fill.hidden = !(height > 0 && entry.intersectionRatio < 1 && top < 1)
    },
    // 0 catches the bar disappearing when the window widens past `lg`.
    { rootMargin: '-1px 0px 0px 0px', threshold: [0, 1] },
  )
  intersectionObserver.observe(bar)

  return () => {
    intersectionObserver.disconnect()
    resizeObserver.disconnect()
    window.removeEventListener('resize', updateRange)
    fill.remove()
    root.style.removeProperty('--scroll-range')
  }
}

/**
 * Marks the tabs once the page title starts going under them. Where their move
 * can't follow the scroll, CSS moves them on that mark over a fixed time;
 * where it can, CSS ignores the mark (see `section-navigation.css`). CSS
 * picks, so it keeps up when reduced motion is switched on or off.
 */
function revealStripAsTitleGoesUnder(tabs: HTMLElement) {
  const title = tabs.parentElement?.querySelector('h1')
  if (!title) return
  // Declared rather than measured: the tabs are hidden from `lg` up, so a
  // measurement taken there would stay 0 after the viewport narrows.
  const tabsHeight = Number.parseFloat(
    getComputedStyle(tabs).getPropertyValue('--section-nav-tabs-height'),
  )
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      const isGoingUnder =
        entry.intersectionRatio < 1 && entry.boundingClientRect.top < tabsHeight
      tabs.toggleAttribute('data-strip-shown', isGoingUnder)
    },
    { rootMargin: `-${tabsHeight}px 0px 0px 0px`, threshold: 1 },
  )
  observer.observe(title)
  return () => {
    observer.disconnect()
    tabs.removeAttribute('data-strip-shown')
  }
}

/**
 * Rests behind the tabs until they slide down to uncover it while the page
 * title slides under them, so the title seems to move into the strip; the
 * slide follows the scroll, not a clock (see `section-navigation.css`). The
 * tabs are back in place whenever the whole title is in view, so a fast scroll
 * to the top can't catch them mid-slide.
 *
 * It sits below the tabs' z-index, which pages may lower (interop uses 40).
 * Its height, `--project-strip-height`, is part of the `--section-nav-height`
 * that anchored content clears.
 *
 * A tap on it scrolls back to the top, like a tap on the iOS status bar. It's
 * a pointer shortcut only: keyboards have Home, and the strip is aria-hidden.
 */
function ProjectStrip({ project }: { project: Project }) {
  const stripRef = useCallback(
    (strip: HTMLDivElement | null) =>
      strip ? fillAboveWhileStuck(strip) : undefined,
    [],
  )
  return (
    <div
      ref={stripRef}
      // Shown for screenshots; the page title already names the project.
      aria-hidden
      onClick={scrollToTop}
      className="md:-mx-5 -mb-(--project-strip-height) sticky top-0 z-30 flex h-(--project-strip-height) cursor-pointer items-center justify-between gap-4 border-divider/60 border-b bg-header-primary px-4 lg:hidden"
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <img
          width={16}
          height={16}
          src={project.icon}
          alt=""
          className="size-4 shrink-0 rounded-full"
        />
        <span className="truncate font-bold text-xs">{project.name}</span>
      </div>
      <Logo animated={false} className="mt-0 h-4.5 w-auto shrink-0" />
    </div>
  )
}

function scrollToTop() {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
}
