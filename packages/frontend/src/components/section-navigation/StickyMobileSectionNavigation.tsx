import { Logo } from '~/components/Logo'
import { stickyTopBarRef } from '~/components/table/stickyTopBar'
import { cn } from '~/utils/cn'
import { MobileSectionNavigation } from './MobileSectionNavigation'
import type { SectionNavigationItem } from './SectionNavigation'

interface Props {
  sections: SectionNavigationItem[]
  /**
   * Named in a strip above the tabs, so once the page header scrolls away a
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
    <div
      ref={stickyTopBarRef}
      className={cn('md:-mx-5 sticky top-0 z-100 lg:hidden', className)}
    >
      {project && <ProjectStrip project={project} />}
      <MobileSectionNavigation sections={sections} />
    </div>
  )
}

// 30px tall: section scroll margins on project pages count on it.
function ProjectStrip({ project }: { project: Project }) {
  return (
    <div className="flex h-7.5 items-center justify-between gap-4 border-divider border-b bg-header-primary px-4">
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
  )
}
