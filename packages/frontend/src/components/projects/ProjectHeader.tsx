import { cn } from '~/utils/cn'

interface Project {
  name: string
  slug: string
  icon: string
}

interface Props {
  project: Project
  className?: string
}

export function ProjectHeader({ project, className }: Props) {
  return (
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
  )
}
