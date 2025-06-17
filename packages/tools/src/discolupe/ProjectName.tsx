import type { DiscoLupeProject } from './src/model'

export function ProjectName(project: DiscoLupeProject, str: string) {
  return (
    <div>
      <img
        src={`https://raw.githubusercontent.com/l2beat/l2beat/refs/heads/main/packages/frontend/static/icons/${project.display.slug}.png`}
        alt={project.display.name}
        width={20}
        height={20}
        className="mr-2 inline-block"
      />
      <p className="inline-block">{str}</p>
    </div>
  )
}
