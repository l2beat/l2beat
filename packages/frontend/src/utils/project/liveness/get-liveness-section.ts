import type { Project } from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { TrackedTxCostsConfig } from '@l2beat/shared/frontend'
import compact from 'lodash/compact'
import groupBy from 'lodash/groupBy'
import type { LivenessSectionProps } from '~/components/projects/sections/liveness-section'
import type { LivenessProject } from '~/server/features/scaling/liveness/types'

export function getLivenessSection(
  project: Project<never, 'trackedTxsConfig' | 'livenessConfig'>,
  liveness: LivenessProject | undefined,
):
  | Omit<LivenessSectionProps, 'projectId' | 'id' | 'title' | 'sectionOrder'>
  | undefined {
  if (!project.trackedTxsConfig) {
    return undefined
  }
  const configuredSubtypes = groupBy(
    project.trackedTxsConfig.filter(
      (x): x is TrackedTxCostsConfig => x.type === 'liveness',
    ),
    (c) => c.subtype,
  )

  const duplicatedData = project.livenessConfig?.duplicateData.to

  return {
    configuredSubtypes: compact([
      ...Object.keys(configuredSubtypes),
      duplicatedData,
    ]) as TrackedTxsConfigSubtype[],
    anomalies: liveness?.anomalies ?? [],
    batchSubmissionsAvg: liveness?.batchSubmissions?.max?.averageInSeconds,
    stateUpdatesAvg: liveness?.stateUpdates?.max?.averageInSeconds,
    proofSubmissionsAvg: liveness?.proofSubmissions?.max?.averageInSeconds,
  }
}
