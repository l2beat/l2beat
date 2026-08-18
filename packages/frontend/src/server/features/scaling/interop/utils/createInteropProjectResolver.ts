import type { Project } from '@l2beat/config'
import {
  type InteropPluginObservation,
  InteropTransferClassifier,
} from '@l2beat/shared'

export function createInteropProjectResolver(
  projects: Project<'interopConfig'>[],
): (observation: InteropPluginObservation) => Project<'interopConfig'>[] {
  const classifier = new InteropTransferClassifier()
  const projectMatchers = projects.map((project) => ({
    project,
    matches: classifier.createPluginMatcher(project.interopConfig.plugins),
  }))

  return (observation) => {
    const matchingProjects = projectMatchers
      .filter(({ matches }) => matches(observation))
      .map(({ project }) => project)

    const shadowedProjectIds = new Set(
      matchingProjects.flatMap((project) =>
        project.interopConfig.subgroupId
          ? [project.interopConfig.subgroupId]
          : [],
      ),
    )

    return matchingProjects.filter(
      (project) => !shadowedProjectIds.has(project.id),
    )
  }
}
