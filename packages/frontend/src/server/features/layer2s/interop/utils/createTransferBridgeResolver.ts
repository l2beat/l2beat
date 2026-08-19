import type { Project } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { InteropTransferBridge } from '../types'

export function createTransferBridgeResolver(
  projects: Project<'interopConfig'>[],
): (transfer: InteropTransferRecord) => InteropTransferBridge {
  const classifier = new InteropTransferClassifier()
  const projectMatchers = projects.map((project) => ({
    project,
    matches: classifier.createMatcher<InteropTransferRecord>(
      project.interopConfig.plugins,
    ),
  }))

  return (transfer) => {
    const matchingProjects = projectMatchers
      .filter(({ matches }) => matches(transfer))
      .map(({ project }) => project)

    assert(
      matchingProjects.length > 0,
      `No interop project found for plugin ${transfer.plugin}`,
    )

    const shadowedProjectIds = new Set(
      matchingProjects.flatMap((project) =>
        project.interopConfig.subgroupId
          ? [project.interopConfig.subgroupId]
          : [],
      ),
    )
    const candidates = matchingProjects.filter(
      (project) => !shadowedProjectIds.has(project.id),
    )

    const [project] = candidates
    assert(
      project !== undefined && candidates.length === 1,
      `Ambiguous interop projects for plugin ${transfer.plugin}: ${candidates
        .map((project) => project.id)
        .join(', ')}`,
    )

    return {
      name: project.interopConfig.name ?? project.name,
      href: `/interop/protocols/${project.slug}`,
    }
  }
}
