import type { CSSProperties } from 'react'
import { cn } from '~/utils/cn'
import type { ChartProject } from './Chart'

export function ChartProjectLogo({
  project,
  className,
  style,
}: {
  project: ChartProject
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={cn('flex items-center gap-1.5', className)} style={style}>
      <img src={project.iconUrl} alt={project.name} className="size-[22px]" />
      <span className="font-bold text-label-value-18">
        {project.shortName ?? project.name}
      </span>
    </div>
  )
}
