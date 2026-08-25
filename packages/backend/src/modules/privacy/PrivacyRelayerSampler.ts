import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { createPrivacyConfigurationId } from '../../config/features/privacy'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import type {
  RailgunBroadcasterProvider,
  RailgunObservationResult,
} from './railgun/RailgunBroadcasterProvider'
import type { PrivacyRelayerSampleConfig } from './types'

const OBSERVATION_DURATION_MS = 10 * 60 * 1000

interface PrivacyRelayerSamplerDeps {
  clock: Clock
  provider: RailgunBroadcasterProvider
  db: Database
  configurations: PrivacyRelayerSampleConfig[]
}

export class PrivacyRelayerSampler {
  private readonly logger: Logger
  private readonly taskQueue: TaskQueue<void>

  constructor(
    private readonly $: PrivacyRelayerSamplerDeps,
    logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.taskQueue = new TaskQueue(
      async () => this.sampleToday(),
      this.logger.for('taskQueue'),
      { metricsId: PrivacyRelayerSampler.name },
    )
  }

  start() {
    this.logger.info('Started')
    this.$.clock.onNewHour(() => this.taskQueue.addIfEmpty())
    this.taskQueue.addToFront()
  }

  async sampleToday() {
    const day = UnixTime.toStartOf(UnixTime.now(), 'day')
    const configurations = this.$.configurations.filter(
      (configuration) =>
        UnixTime.toStartOf(configuration.sinceTimestamp, 'day') <= day,
    )
    if (configurations.length === 0) return

    const sampled = new Set(
      await this.$.db.privacyRelayerSample.getConfigurationIdsByTimestamp(
        configurations.map((configuration) => configuration.id),
        day,
      ),
    )
    const unsampled = configurations.filter(
      (configuration) => !sampled.has(configuration.id),
    )
    if (unsampled.length === 0) return

    const chainIds = Array.from(
      new Set(unsampled.map((configuration) => configuration.chainId)),
    )

    let observations: Map<number, RailgunObservationResult>
    try {
      observations = await this.$.provider.observe({
        chainIds,
        durationMs: OBSERVATION_DURATION_MS,
      })
    } catch (error) {
      this.logger.error('Railgun observation failed', error)
      return
    }

    const records = []
    for (const configuration of unsampled) {
      const { projectId, chain, chainId } = configuration
      const observation = observations.get(chainId)
      assert(
        observation,
        `Missing Railgun observation result for chainId ${chainId}`,
      )

      if (
        observation.messagesReceived === 0 ||
        observation.messagesParsed === 0
      ) {
        this.logger.warn('Skipping persist for unhealthy Railgun observation', {
          chainId,
          messagesReceived: observation.messagesReceived,
          messagesParsed: observation.messagesParsed,
          messagesAccepted: observation.messagesAccepted,
        })
        continue
      }

      records.push({
        configurationId: configuration.id,
        projectId,
        chain,
        timestamp: day,
        relayerCount: observation.uniqueRelayers,
        messagesReceived: observation.messagesReceived,
        messagesParsed: observation.messagesParsed,
        messagesAccepted: observation.messagesAccepted,
      })
    }

    if (records.length === 0) return

    await this.$.db.privacyRelayerSample.upsertMany(records)
    this.logger.info('Saved privacy relayer samples into DB', {
      day,
      samples: records.length,
      chainIds,
    })
  }

  static idToConfigurationId(
    config: Omit<PrivacyRelayerSampleConfig, 'id'>,
  ): string {
    return createPrivacyConfigurationId([
      'privacy-relayer-sample',
      config.projectId,
      config.chainId.toString(),
    ])
  }
}
