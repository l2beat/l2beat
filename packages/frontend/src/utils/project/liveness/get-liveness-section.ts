import type { Project } from '@l2beat/config'
import { assert, type TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { TrackedTxCostsConfig } from '@l2beat/shared/frontend'
import compact from 'lodash/compact'
import groupBy from 'lodash/groupBy'
import type { LivenessSectionProps } from '~/components/projects/sections/liveness-section'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import type { LivenessProject } from '~/server/features/scaling/liveness/types'
import { getHasTrackedContractChanged } from '~/server/features/scaling/liveness/utils/get-has-tracked-contract-changed'
import { getTrackedTransactions } from '../tracked-txs/get-tracked-transactions'

export function getLivenessSection(
  project: Project<never, 'trackedTxsConfig' | 'livenessConfig'>,
  liveness: LivenessProject | undefined,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
):
  | Omit<LivenessSectionProps, 'projectId' | 'id' | 'title' | 'sectionOrder'>
  | undefined {
  const trackedTransactions = getTrackedTransactions(project, 'liveness')
  if (!trackedTransactions) return undefined

  assert(project.trackedTxsConfig, 'trackedTxsConfig is required')
  const configuredSubtypes = groupBy(
    project.trackedTxsConfig.filter(
      (x): x is TrackedTxCostsConfig => x.type === 'liveness',
    ),
    (c) => c.subtype,
  )
  const duplicatedData = project.livenessConfig?.duplicateData.to

  const hasTrackedContractsChanged = project.trackedTxsConfig
    ? getHasTrackedContractChanged(
        project as Project<'trackedTxsConfig'>,
        projectChangeReport,
      )
    : false

  return {
    configuredSubtypes: compact([
      ...Object.keys(configuredSubtypes),
      duplicatedData,
    ]) as TrackedTxsConfigSubtype[],
    anomalies: liveness?.anomalies ?? [],
    batchSubmissionsAvg: liveness?.batchSubmissions?.max?.averageInSeconds,
    stateUpdatesAvg: liveness?.stateUpdates?.max?.averageInSeconds,
    proofSubmissionsAvg: liveness?.proofSubmissions?.max?.averageInSeconds,
    hasTrackedContractsChanged,
    trackedTransactions,
  }
}
