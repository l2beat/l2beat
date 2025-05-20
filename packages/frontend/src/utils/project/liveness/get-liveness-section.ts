import type { Project } from '@l2beat/config'
import { assert, type TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { TrackedTxCostsConfig } from '@l2beat/shared/frontend'
import compact from 'lodash/compact'
import groupBy from 'lodash/groupBy'
import { getDefaultSubtype } from '~/components/chart/liveness/project-liveness-chart'
import type { LivenessSectionProps } from '~/components/projects/sections/liveness-section'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import type { LivenessProject } from '~/server/features/scaling/liveness/types'
import { getHasTrackedContractChanged } from '~/server/features/scaling/liveness/utils/get-has-tracked-contract-changed'
import { api } from '~/trpc/server'
import { getTrackedTransactions } from '../tracked-txs/get-tracked-transactions'

export async function getLivenessSection(
  project: Project<never, 'trackedTxsConfig' | 'livenessConfig'>,
  liveness: LivenessProject | undefined,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
): Promise<
  | Omit<LivenessSectionProps, 'projectId' | 'id' | 'title' | 'sectionOrder'>
  | undefined
> {
  const trackedTransactions = getTrackedTransactions(project, 'liveness')
  if (!trackedTransactions) return undefined

  assert(project.trackedTxsConfig, 'trackedTxsConfig is required')
  const configSubtypes = groupBy(
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

  const configuredSubtypes = compact([
    ...Object.keys(configSubtypes),
    duplicatedData,
  ]) as TrackedTxsConfigSubtype[]

  await api.liveness.projectChart.prefetch({
    projectId: project.id,
    range: '30d',
    subtype: getDefaultSubtype(configuredSubtypes),
  })

  return {
    configuredSubtypes,
    anomalies: liveness?.anomalies ?? [],
    hasTrackedContractsChanged,
    trackedTransactions,
  }
}
