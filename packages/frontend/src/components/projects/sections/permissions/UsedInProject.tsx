import type { ProjectId } from '@l2beat/shared-pure'
import { ProjectIconList } from '~/components/ProjectIconList'

export interface UsedInProject {
  id: ProjectId
  name: string
  slug: string
  url: string | undefined
  icon: string
  targetName: string
  type: 'implementation' | 'proxy' | 'permission'
}

export function UsedInProjectEntry({
  label,
  implementations,
}: {
  label: string
  implementations: UsedInProject[]
}) {
  return (
    <div className="mt-2 flex flex-row flex-wrap items-center gap-x-2 gap-y-1 text-paragraph-15 md:text-paragraph-16">
      <strong className="whitespace-nowrap text-primary">{label}:</strong>
      <ProjectIconList
        projects={implementations.map((project, i) => ({
          id: `${i}:${project.id}:${project.targetName}`,
          name: project.name,
          iconUrl: project.icon,
          href: project.url
            ? `${project.url}#${project.targetName}`
            : undefined,
          description: project.targetName,
        }))}
        title={label}
      />
    </div>
  )
}
