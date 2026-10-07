import { stickyTopBarRef } from '~/components/table/stickyTopBar'
import { cn } from '~/utils/cn'
import { MobileSectionNavigation } from './MobileSectionNavigation'
import type { SectionNavigationItem } from './SectionNavigation'

interface Props {
  sections: SectionNavigationItem[]
  className?: string
}

/**
 * The section navigation as the bar that sticks to the top of a page below
 * `lg`, where the side navigation is hidden.
 */
export function StickyMobileSectionNavigation({ sections, className }: Props) {
  return (
    <div
      ref={stickyTopBarRef}
      className={cn('md:-mx-5 sticky top-0 z-100 lg:hidden', className)}
    >
      <MobileSectionNavigation sections={sections} />
    </div>
  )
}
