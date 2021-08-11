import { StarkWareIcon } from '../../../common/icons'

interface Props {
  project: {
    name: string
    slug: string
    isStarkEx: boolean
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
      {project.isStarkEx && (
        <span
          className="ProjectLink-StarkEx Tooltip"
          title="This project is built using StarkEx."
        >
          <StarkWareIcon />
        </span>
      )}
    </a>
  )
}
