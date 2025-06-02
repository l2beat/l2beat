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
      <span className="text-3xl font-bold !leading-none md:text-4xl">
        {project.name}
      </span>
    </h1>
  )
}
