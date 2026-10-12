import { stickyTopBarRef } from '~/components/table/stickyTopBar'
import { cn } from '~/utils/cn'
import { MobileSectionNavigation } from './MobileSectionNavigation'
import { ProjectChip, type ProjectChipProps } from './ProjectChip'
import type { SectionNavigationItem } from './SectionNavigation'

interface Props {
  sections: SectionNavigationItem[]
  /** Its logo shows in the bar once the page's own header scrolls away. */
  project?: ProjectChipProps['project']
  className?: string
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
      className={cn('md:-mx-5 sticky top-0 z-100 flex lg:hidden', className)}
    >
      {project && <ProjectChip project={project} />}
      <MobileSectionNavigation sections={sections} />
    </div>
  )
}
