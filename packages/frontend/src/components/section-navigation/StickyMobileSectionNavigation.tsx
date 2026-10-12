import { useCallback, useState } from 'react'
import { Logo } from '~/components/Logo'
import { stickyTopBarRef } from '~/components/table/stickyTopBar'
import { cn } from '~/utils/cn'
import { MobileSectionNavigation } from './MobileSectionNavigation'
import type { SectionNavigationItem } from './SectionNavigation'

interface Props {
  sections: SectionNavigationItem[]
  /**
   * Named in a strip above the tabs once the site header scrolls away, so a
   * screenshot of any section still says which project it shows and that it
   * comes from L2BEAT.
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
  return (
    <>
      {project && <ProjectStrip project={project} />}
      <div
        ref={stickyTopBarRef}
        className={cn(
          'md:-mx-5 sticky z-100 lg:hidden',
          project ? 'top-(--project-strip-height)' : 'top-0',
          className,
        )}
      >
        <MobileSectionNavigation sections={sections} />
      </div>
    </>
  )
}

/**
 * Rests behind the tabs, which stick its height lower than it does. Once
 * the page scrolls the tabs past that point, they stop and the strip carries
 * on, sliding out from behind them until it sticks at the top; scrolling back
 * slides it back in. Both are sticky, so the browser moves them together on
 * every frame: nothing to time, and nothing that depends on the site header
 * painting over the strip, which iOS can skip for a few frames when flinging
 * back to the top.
 *
 * The strip arrives while the page title is still in view, so the project's
 * name only fades in once the title has gone under the tabs, never showing
 * twice. Only that fade waits on an observer; the strip's movement doesn't.
 *
 * It sits below the tabs' z-index, which pages may lower (interop uses 40).
 * Its height, `--project-strip-height`, is part of the `--section-nav-height`
 * that anchored content clears (see `section-navigation.css`).
 */
function ProjectStrip({ project }: { project: Project }) {
  const [isTitleCovered, setIsTitleCovered] = useState(false)
  const stripRef = useCallback(
    (strip: HTMLDivElement | null) =>
      strip ? watchTitleCovered(strip, setIsTitleCovered) : undefined,
    [],
  )

  return (
    <div
      ref={stripRef}
      className="md:-mx-5 -mb-(--project-strip-height) sticky top-0 z-30 flex h-(--project-strip-height) items-center justify-between gap-4 border-divider/60 border-b bg-header-primary px-4 lg:hidden"
    >
      <div
        className={cn(
          'flex min-w-0 items-center gap-1.5 transition-[opacity,translate] ease-out motion-reduce:translate-y-0',
          isTitleCovered
            ? 'duration-200'
            : 'translate-y-1 opacity-0 duration-150',
        )}
      >
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

/**
 * Reports whether the page title (the h1 beside the strip) has scrolled fully
 * under the stuck bar: the strip plus the tabs right after it.
 */
function watchTitleCovered(
  strip: HTMLElement,
  onChange: (isCovered: boolean) => void,
) {
  const title = strip.parentElement?.querySelector('h1')
  const tabs = strip.nextElementSibling
  if (!title || !(tabs instanceof HTMLElement)) return
  const barHeight = strip.offsetHeight + tabs.offsetHeight
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      onChange(
        !entry.isIntersecting && entry.boundingClientRect.top < barHeight,
      )
    },
    { rootMargin: `-${barHeight}px 0px 0px 0px` },
  )
  observer.observe(title)
  return () => observer.disconnect()
}
