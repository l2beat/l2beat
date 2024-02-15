import { IndexerStateRepository } from '../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../tools/Clock'
import { LivenessConfigurationRepository } from '../repositories/LivenessConfigurationRepository'
import {
  LivenessStatusPageProps,
  renderLivenessStatusPage,
} from './status/LivenessStatusPage'

export class LivenessStatusController {
  constructor(
    private readonly clock: Clock,
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly livenessConfigurationRepository: LivenessConfigurationRepository,
  ) {}

  async getLivenessStatus() {
    const indexerState = await this.indexerStateRepository.findIndexerState(
      'liveness_indexer',
    )
    const targetTimestamp = this.clock.getLastHour()

    const configurations = await this.livenessConfigurationRepository.getAll()
    const unusedConfigurationsIds =
      await this.livenessConfigurationRepository.findUnusedConfigurationsIds()

    const params: LivenessStatusPageProps = {
      indexerState,
      targetTimestamp,
      configurations,
      unusedConfigurationsIds,
    }
    return renderLivenessStatusPage(params)
  }
}
