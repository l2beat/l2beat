import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { cn } from '~/utils/cn'

/**
 * The project page's own sections, rendered unchanged inside the console's
 * frame. Their running numbers are hidden: here they sit between the
 * console's sections, so "1" and "2" would number nothing the reader sees
 */
export function ExistingSections({
  items,
  className,
}: {
  items: ProjectDetailsSection[]
  className?: string
}) {
  if (items.length === 0) return null
  return (
    <div
      className={cn(
        '[&_.primary-card]:md:rounded-lg [&_.primary-card]:md:border [&_.primary-card]:md:border-divider',
        '[&_.primary-card>div:first-child>a>div:first-child]:!hidden',
        '[&_.primary-card>div:first-child_h2]:text-heading-24',
        className,
      )}
    >
      <ProjectDetails items={items} />
    </div>
  )
}
