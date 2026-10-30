import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { ProjectIconList } from '~/components/ProjectIconList'
import type { DefiDependency } from '~/server/features/defi/resolveDefiDependencies'

export function DefiDependenciesCell({
  dependencies,
}: {
  dependencies: DefiDependency[] | undefined
}) {
  if (dependencies === undefined) {
    return <NoDataBadge />
  }

  if (dependencies.length === 0) {
    return <span className="font-medium text-sm">None</span>
  }

  return (
    <ProjectIconList
      projects={dependencies.map((dependency, index) => ({
        id: `${index}:${dependency.name}`,
        name: dependency.name,
        iconUrl: dependency.icon,
        href: dependency.href,
      }))}
      title="Dependencies"
    />
  )
}
