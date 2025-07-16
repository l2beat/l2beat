import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { LiveIndicator } from '../LiveIndicator'

interface Project {
  name: string
  slug: string
  icon: string
}

interface Props {
  project: Project
  ongoingAnomaly?: 'single' | 'multiple'
}

export function ProjectHeader({ project, ongoingAnomaly }: Props) {
  return (
    <div
      className={cn(
        'flex gap-6 max-md:flex-col md:items-center',
        ongoingAnomaly ? 'mb-4' : 'mb-6',
      )}
    >
      <h1 className="flex items-center justify-start gap-3">
        {project.slug && (
          <img
            width={32}
            height={32}
            src={project.icon}
            alt={`${project.name} logo`}
          />
        )}
        <span className="text-heading-28 leading-none!">{project.name}</span>
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
