import type { InteropPlugin, Project } from '@l2beat/config'
import {
  type InteropPluginObservation,
  InteropTransferClassifier,
} from '@l2beat/shared'

/**
 * A project and its subgroup can both match one sighting (layerzero and
 * usdt0 both claim layerzero-v2-ofts), so a match shadows the project its
 * `subgroupId` names — only the most specific match survives.
 */
export function createMatchingProjectsResolver<TTarget>(
  projects: Project<'interopConfig'>[],
  createMatcher: (plugins: InteropPlugin[]) => (target: TTarget) => boolean,
): (target: TTarget) => Project<'interopConfig'>[] {
  const projectMatchers = projects.map((project) => ({
    project,
    matches: createMatcher(project.interopConfig.plugins),
  }))

  return (target) => {
    const matchingProjects = projectMatchers
      .filter(({ matches }) => matches(target))
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

/**
 * Unlike `createTransferBridgeResolver`, several matches are legitimate:
 * more than one bridge can mint the same deployment.
 */
export type InteropProjectResolver = (
  observation: InteropPluginObservation,
) => Project<'interopConfig'>[]

export function createInteropProjectResolver(
  projects: Project<'interopConfig'>[],
): InteropProjectResolver {
  const classifier = new InteropTransferClassifier()
  return createMatchingProjectsResolver(projects, (plugins) =>
    classifier.createPluginMatcher(plugins),
  )
}
