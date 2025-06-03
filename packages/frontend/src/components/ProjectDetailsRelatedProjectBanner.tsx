import { cn } from '~/utils/cn'

export type ProjectDetailsRelatedProjectBannerProps = {
  text: string
  project: {
    name: string
    type: 'scaling' | 'bridges' | 'data-availability'
    slug: string
    icon: string
  }
  className?: string
}

export function ProjectDetailsRelatedProjectBanner({
  text,
  project,
  className,
}: ProjectDetailsRelatedProjectBannerProps) {
  const href = `/${project.type}/projects/${project.slug}` as const

  return (
    <div
      className={cn(
        'flex w-full items-center rounded-lg bg-surface-secondary px-4 py-2 font-medium text-xs',
        className,
      )}
    >
      <div>
        {text}{' '}
        <span className="inline-block">
          <img
            className="mr-1 inline-block size-5"
            src={project.icon}
            width={20}
            height={20}
            alt={`${project.name} logo`}
          />
          <a
            href={href}
            className="inline-block font-medium text-link text-xs underline hover:text-blue-550 dark:hover:text-blue-550"
          >
            {project.name}
          </a>
        </span>
      </div>
    </div>
  )
}
