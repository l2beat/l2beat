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
 * It sits below the tabs' z-index, which pages may lower (interop uses 40).
 * Its height, `--project-strip-height`, is part of the `--section-nav-height`
 * that anchored content clears (see `section-navigation.css`).
 */
function ProjectStrip({ project }: { project: Project }) {
  return (
    <div className="md:-mx-5 -mb-(--project-strip-height) sticky top-0 z-30 flex h-(--project-strip-height) items-center justify-between gap-4 border-divider/60 border-b bg-header-primary px-4 lg:hidden">
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
