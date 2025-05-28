import type { Project } from '@l2beat/config'
import { assert, type TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { TrackedTxCostsConfig } from '@l2beat/shared/frontend'
import compact from 'lodash/compact'
import groupBy from 'lodash/groupBy'
import type { ProjectsChangeReport } from 'rewrite/src/server/features/projects-change-report/get-projects-change-report'
import type { LivenessProject } from 'rewrite/src/server/features/scaling/liveness/types'
import { getHasTrackedContractChanged } from 'rewrite/src/server/features/scaling/liveness/utils/get-has-tracked-contract-changed'
import { getDefaultSubtype } from '~/components/chart/liveness/getDefaultSubtype'
import type { LivenessSectionProps } from '~/components/projects/sections/liveness-section'
import { api } from '~/trpc/server'
import { getTrackedTransactions } from '../tracked-txs/get-tracked-transactions'

export async function getLivenessSection(
  project: Project<never, 'trackedTxsConfig' | 'livenessConfig'>,
  liveness: LivenessProject | undefined,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
): Promise<
  | Omit<
      LivenessSectionProps,
      'projectId' | 'id' | 'title' | 'sectionOrder' | 'milestones'
    >
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

  const configuredSubtypes = compact([
    ...Object.keys(configSubtypes),
    duplicatedData,
  ]) as TrackedTxsConfigSubtype[]

  const [data] = await Promise.all([
    api.liveness.projectChart({
      projectId: project.id,
      range: '30d',
      subtype: getDefaultSubtype(configuredSubtypes),
    }),
    api.liveness.projectChart.prefetch({
      projectId: project.id,
      range: '30d',
      subtype: getDefaultSubtype(configuredSubtypes),
    }),
  ])

  if (data.data.length === 0) return undefined

  const hasTrackedContractsChanged = project.trackedTxsConfig
    ? getHasTrackedContractChanged(
        project as Project<'trackedTxsConfig'>,
        projectChangeReport,
      )
    : false

  return {
    configuredSubtypes,
    anomalies: liveness?.anomalies ?? [],
    hasTrackedContractsChanged,
    trackedTransactions,
  }
}
