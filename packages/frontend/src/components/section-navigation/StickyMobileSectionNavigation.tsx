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
      // Before publishing, so the slide it declares counts.
      const stopSliding =
        tabs && hasProject ? slideTabsWithTitle(tabs) : undefined
      const stopPublishing = stickyTopBarRef(tabs)
      return () => {
        stopSliding?.()
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
 * Stands in for the scroll-driven slide in `section-navigation.css` where the
 * browser lacks it (Firefox): the same 30px slide, set from a scroll listener.
 * Firefox scrolls off the main thread, so this can trail by a frame, but only
 * while the title crosses those 30px; elsewhere the slide is pinned.
 */
function slideTabsWithTitle(tabs: HTMLElement) {
  const strip = tabs.previousElementSibling
  const title = tabs.parentElement?.querySelector('h1')
  if (
    !(strip instanceof HTMLElement) ||
    !title ||
    CSS.supports(SCROLL_DRIVEN_SLIDE) ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return
  }

  const update = () => {
    // Hidden from `lg` up.
    if (tabs.offsetHeight === 0) return
    const overlap = tabs.offsetHeight - title.getBoundingClientRect().bottom
    const slide = Math.min(Math.max(overlap, 0), strip.offsetHeight)
    tabs.style.translate = `0 ${slide}px`
  }

  tabs.style.top = '0px'
  tabs.style.setProperty(
    '--sticky-top-bar-slide',
    'var(--project-strip-height)',
  )
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  return () => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    tabs.style.removeProperty('top')
    tabs.style.removeProperty('translate')
    tabs.style.removeProperty('--sticky-top-bar-slide')
  }
}

// Mirrors the `@supports` condition in `section-navigation.css`.
const SCROLL_DRIVEN_SLIDE =
  '(animation-timeline: view()) and (timeline-scope: --x)'

/**
 * Rests behind the tabs until they slide down to uncover it once the page
 * title has scrolled away; the slide follows the scroll, not a clock (see
 * `section-navigation.css`). It shows the project only after the title, which
 * names it already, is gone, and the tabs are back in place whenever the title
 * is in view, so a fast scroll to the top can't catch them mid-slide.
 *
 * It sits below the tabs' z-index, which pages may lower (interop uses 40).
 * Its height, `--project-strip-height`, is part of the `--section-nav-height`
 * that anchored content clears.
 */
function ProjectStrip({ project }: { project: Project }) {
  return (
    <div
      // Shown for screenshots; the page title already names the project.
      aria-hidden
      className="md:-mx-5 -mb-(--project-strip-height) sticky top-0 z-30 flex h-(--project-strip-height) items-center justify-between gap-4 border-divider/60 border-b bg-header-primary px-4 lg:hidden"
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
