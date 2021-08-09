interface Props {
  project: {
    name: string
    slug: string
  }
}

export function ProjectLink({ project }: Props) {
  return (
    <a className="ProjectLink" href={`/projects/${project.slug}`}>
      <img
        className="ProjectLink-Icon"
        src={`/icons/${project.slug}.png`}
        alt={`${project.name} logo`}
      />
      {project.name}
    </a>
  )
}
