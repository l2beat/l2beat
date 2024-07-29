import { type LivenessApiResponse } from '@l2beat/shared-pure'
import { getSavedConfigurations } from './get-saved-configurations'
import { type TrackedTxConfigEntry } from '@l2beat/shared'
import { db } from '~/server/database'

export async function getLiveness() {
  const projects: LivenessApiResponse['projects'] = {}

  const configurations = await getSavedConfigurations<TrackedTxConfigEntry>(
    'tracked_txs_indexer',
    getConfigurationByIndexerId: (indexerId: string) => db.indexerConfiguration.get
  )

  for (const project of this.$.projects) {
    const activeConfigs = getActiveConfigurations(project, configurations)

    if (!activeConfigs) {
      continue
    }

    const aggregatedLivenessRecords =
      await this.$.db.aggregatedLiveness.getByProjectId(project.projectId)

    const last30Days = UnixTime.now().add(-30, 'days').toStartOf('day')
    const anomalyRecords = await this.$.db.anomalies.getByProjectIdFrom(
      project.projectId,
      last30Days,
    )

    const livenessData: LivenessApiProject = {
      stateUpdates: this.mapAggregatedLivenessRecords(
        aggregatedLivenessRecords,
        'stateUpdates',
        project,
        configurations,
      ),
      batchSubmissions: this.mapAggregatedLivenessRecords(
        aggregatedLivenessRecords,
        'batchSubmissions',
        project,
        configurations,
      ),
      proofSubmissions: this.mapAggregatedLivenessRecords(
        aggregatedLivenessRecords,
        'proofSubmissions',
        project,
        configurations,
      ),
      anomalies: this.mapAnomalyRecords(anomalyRecords),
    }

    // duplicate data from one subtype to another if configured
    if (project.livenessConfig) {
      const { from, to } = project.livenessConfig.duplicateData
      const data = livenessData[from]
      assert(data, 'From data must exist')
      livenessData[to] = { ...data }
    }

    projects[project.projectId.toString()] = livenessData
  }

  return projects
}
