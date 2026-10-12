import { useCallback, useState } from 'react'
import { Logo } from '~/components/Logo'
import { stickyTopBarRef } from '~/components/table/stickyTopBar'
import { cn } from '~/utils/cn'
import { MobileSectionNavigation } from './MobileSectionNavigation'
import type { SectionNavigationItem } from './SectionNavigation'

interface Props {
  sections: SectionNavigationItem[]
  /**
   * Named in a strip that slides in above the tabs once the page title
   * scrolls away, so a screenshot of any section still says which project
   * it shows and that it comes from L2BEAT.
   */
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
  const [isTitleCovered, setIsTitleCovered] = useState(false)
  const hasProject = !!project
  const barRef = useCallback(
    (bar: HTMLDivElement | null) => {
      const stopPublishing = stickyTopBarRef(bar)
      const stopWatching =
        bar && hasProject
          ? watchTitleCovered(bar, setIsTitleCovered)
          : undefined
      return () => {
        stopPublishing?.()
        stopWatching?.()
      }
    },
    [hasProject],
  )
  const isStripShown = hasProject && isTitleCovered

  return (
    <div
      ref={barRef}
      className={cn(
        'md:-mx-5 sticky top-0 z-100 transition-[translate] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none lg:hidden',
        // Leaving is quicker than arriving: a fling back to the top un-sticks
        // the bar soon after the title shows, and a bar still sliding up
        // would then sit below its place.
        isStripShown ? 'translate-y-7.5 duration-[280ms]' : 'duration-[140ms]',
        className,
      )}
    >
      {project && <ProjectStrip project={project} isShown={isStripShown} />}
      <MobileSectionNavigation sections={sections} />
    </div>
  )
}

const TABS_HEIGHT = 40

/**
 * Reports whether the page title (the h1 beside the bar) has scrolled up
 * under the tabs.
 */
function watchTitleCovered(
  bar: HTMLElement,
  onChange: (isCovered: boolean) => void,
) {
  const title = bar.parentElement?.querySelector('h1')
  if (!title) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      onChange(
        !entry.isIntersecting && entry.boundingClientRect.top < TABS_HEIGHT,
      )
    },
    { rootMargin: `-${TABS_HEIGHT}px 0px 0px 0px` },
  )
  observer.observe(title)
  return () => observer.disconnect()
}

// Hangs above the bar instead of taking space in it, and the bar slides down
// with `translate` to show it, so neither the page content nor the layout
// moves; the slide stays on the compositor even during momentum scrolling.
// It is 30px tall: section scroll margins on project pages count on it.
function ProjectStrip({
  project,
  isShown,
}: {
  project: Project
  isShown: boolean
}) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-full flex h-7.5 items-center border-divider/60 border-b bg-header-primary px-4',
        // Hidden, it would cover what sits above the bar before the bar
        // sticks. `visibility` waits for the slide out to finish.
        'transition-[visibility]',
        isShown ? 'duration-0' : 'invisible duration-[140ms]',
      )}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center justify-between gap-4 transition-opacity ease-out',
          isShown ? 'duration-[280ms]' : 'opacity-0 duration-100',
        )}
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
        <Logo animated={false} className="mt-0 h-3.5 w-auto shrink-0" />
      </div>
    </div>
  )
}
