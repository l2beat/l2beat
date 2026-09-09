import type { Project } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { InteropTransferBridge } from '../types'
import { createMatchingProjectsResolver } from './createInteropProjectResolver'

export function createTransferBridgeResolver(
  projects: Project<'interopConfig'>[],
): (transfer: InteropTransferRecord) => InteropTransferBridge {
  const classifier = new InteropTransferClassifier()
  const resolveProjects = createMatchingProjectsResolver(projects, (plugins) =>
    classifier.createMatcher<InteropTransferRecord>(plugins),
  )

  return (transfer) => {
    const candidates = resolveProjects(transfer)
    assert(
      candidates.length > 0,
      `No interop project found for plugin ${transfer.plugin}`,
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
