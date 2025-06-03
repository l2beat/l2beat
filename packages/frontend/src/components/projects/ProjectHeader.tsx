interface Project {
  name: string
  slug: string
  icon: string
}

export function ProjectHeader({ project }: { project: Project }) {
  return (
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
      <span className="!leading-none font-bold text-3xl md:text-4xl">
        {project.name}
      </span>
    </h1>
  )
}
