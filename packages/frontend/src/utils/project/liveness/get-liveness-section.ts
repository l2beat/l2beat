import type { Project } from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { TrackedTxCostsConfig } from '@l2beat/shared/frontend'
import groupBy from 'lodash/groupBy'

export function getLivenessSection(
  project: Project<never, 'trackedTxsConfig'>,
): TrackedTxsConfigSubtype[] | undefined {
  if (!project.trackedTxsConfig) {
    return undefined
  }
  const configuredSubtypes = groupBy(
    project.trackedTxsConfig.filter(
      (x): x is TrackedTxCostsConfig => x.type === 'liveness',
    ),
    (c) => c.subtype,
  )

  return Object.keys(configuredSubtypes) as TrackedTxsConfigSubtype[]
}
