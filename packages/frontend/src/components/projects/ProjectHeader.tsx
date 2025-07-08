import { cn } from '~/utils/cn'

import { ChevronIcon } from '~/icons/Chevron'
import { LiveIndicator } from '../LiveIndicator'

interface Project {
  name: string
  slug: string
  icon: string
}

interface Props {
  project: Project
  ongoingAnomaly?: 'single' | 'multiple'
  className?: string
}

export function ProjectHeader({ project, ongoingAnomaly, className }: Props) {
  return (
    <div className="flex gap-6 max-md:flex-col md:items-center">
      <h1 className={cn('flex items-center justify-start gap-3', className)}>
        {project.slug && (
          <img
            width={32}
            height={32}
            src={project.icon}
            alt={`${project.name} logo`}
          />
        )}
        <span className="!leading-none font-bold text-[28px]">
          {project.name}
        </span>
      </h1>
      {!!ongoingAnomaly && (
        <a
          href="#liveness"
          className="flex h-8 items-center justify-center gap-2 rounded border border-negative p-2"
        >
          <LiveIndicator />
          <h3 className="font-medium text-negative text-xs uppercase leading-none">
            {ongoingAnomaly === 'single'
              ? 'Ongoing anomaly'
              : 'Ongoing anomalies'}
          </h3>
          <ChevronIcon className="-rotate-90 size-2.5 fill-negative" />
        </a>
      )}
    </div>
  )
}
