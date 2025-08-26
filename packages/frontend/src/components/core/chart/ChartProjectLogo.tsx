import { cn } from '~/utils/cn'
import type { ChartProject } from './Chart'

export function ChartProjectLogo({
  project,
  className,
}: {
  project: ChartProject
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <img
        src={`/icons/${project.slug}.png`}
        alt={project.name}
        className="size-[22px]"
      />
      <span className="font-bold text-label-value-18">
        {project.shortName ?? project.name}
      </span>
    </div>
  )
}
