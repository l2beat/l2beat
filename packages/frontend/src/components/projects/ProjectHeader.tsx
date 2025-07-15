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
}

export function ProjectHeader({ project, ongoingAnomaly }: Props) {
  return (
    <div className="flex gap-6 max-md:flex-col md:items-center">
      <h1 className="flex items-center justify-start gap-3">
        {project.slug && (
          <img
            className="max-md:size-8"
            width={40}
            height={40}
            src={project.icon}
            alt={`${project.name} logo`}
          />
        )}
        <span className="font-bold text-3xl leading-none! md:text-4xl">
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
