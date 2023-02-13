import { Hash256, Logger, ProjectParameters, UnixTime } from '@l2beat/shared'
import { providers } from 'ethers'
import { Counter, Gauge, Histogram } from 'prom-client'

import { DiscoveryWatcherRepository } from '../peripherals/database/discovery/DiscoveryWatcherRepository'
import { DiscordClient } from '../peripherals/discord/DiscordClient'
import { Clock } from './Clock'
import { ConfigReader } from './discovery/ConfigReader'
import { DiscoveryContract } from './discovery/DiscoveryConfig'
import { DiscoveryEngine } from './discovery/DiscoveryEngine'
import { diffDiscovery, DiscoveryDiff } from './discovery/utils/diffDiscovery'
import { diffToMessages } from './discovery/utils/diffToMessages'
import { getDiscoveryConfigHash } from './discovery/utils/getDiscoveryConfigHash'
import { TaskQueue } from './queue/TaskQueue'

export class DiscoveryWatcher {
  private readonly taskQueue: TaskQueue<void>

  constructor(
    private readonly provider: providers.AlchemyProvider,
    private readonly discoveryEngine: DiscoveryEngine,
    private readonly discordClient: DiscordClient | undefined,
    private readonly configReader: ConfigReader,
    private readonly repository: DiscoveryWatcherRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      () => this.update(),
      this.logger.for('taskQueue'),
      {
        metricsId: DiscoveryWatcher.name,
      },
    )
  }

  start() {
    this.logger.info('Started')
    return this.clock.onNewHour(() => {
      this.taskQueue.addToFront()
    })
  }

  async update() {
    const metricsDone = initMetrics()
    // TODO: get block number based on clock time
    const blockNumber = await this.provider.getBlockNumber()
    const timestamp = UnixTime.now()
    this.logger.info('Update started', { blockNumber })

    const projectConfigs = await this.configReader.readAllConfigs()

    let changesCounter = 0
    for (const projectConfig of projectConfigs) {
      this.logger.info('Discovery started', { project: projectConfig.name })

      try {
        const discovery = await this.discoveryEngine.run(
          projectConfig,
          blockNumber,
        )
        const configHash = getDiscoveryConfigHash(projectConfig)

        const diff = await this.findChanges(
          projectConfig.name,
          discovery,
          configHash,
          projectConfig.overrides,
        )

        if (diff.length > 0) {
          const messages = diffToMessages(projectConfig.name, diff)
          await this.notify(messages)
          changesCounter += diff.length
        }

        await this.repository.addOrUpdate({
          projectName: projectConfig.name,
          timestamp,
          blockNumber,
          discovery,
          configHash,
        })

        this.logger.info('Discovery finished', { project: projectConfig.name })
      } catch (error) {
        this.logger.error(error)
        errorsCount.inc()
      }
    }
    this.logger.info('Update finished', { blockNumber })
    metricsDone(blockNumber, changesCounter)
  }

  async findChanges(
    name: string,
    discovery: ProjectParameters,
    configHash: Hash256,
    overrides?: Record<string, DiscoveryContract>,
  ): Promise<DiscoveryDiff[]> {
    const databaseEntry = await this.repository.findLatest(name)

    if (
      databaseEntry === undefined ||
      databaseEntry.configHash !== configHash
    ) {
      this.logger.debug('Using committed file for diff', { project: name })
      const committed = await this.configReader.readDiscovery(name)
      return diffDiscovery(committed.contracts, discovery.contracts, overrides)
    }

    this.logger.debug('Using database record for diff', { project: name })
    return diffDiscovery(
      databaseEntry.discovery.contracts,
      discovery.contracts,
      overrides,
    )
  }

  async notify(messages: string[]) {
    if (!this.discordClient) {
      // TODO: maybe only once? rethink
      this.logger.info(
        'DiscordClient not setup, notification has not been sent. Did you provide correct .env variables?',
      )
      return
    }

    for (const message of messages) {
      await this.discordClient.sendMessage(message).then(
        () => this.logger.info('Notification to Discord has been sent'),
        (e) => this.logger.error(e),
      )
    }
  }
}

const latestBlock = new Gauge({
  name: 'discovery_watcher_last_synced',
  help: 'Value showing latest block number with which DiscoveryWatcher was run',
})

const changesDetected = new Gauge({
  name: 'discovery_watcher_changes_detected',
  help: 'Value showing the amount of changes detected by DiscoveryWatcher',
})

const syncHistogram = new Histogram({
  name: 'discovery_watcher_sync_duration_histogram',
  help: 'Histogram showing DiscoveryWatcher sync duration',
  buckets: [1, 2, 4, 6, 8, 10, 12, 15].map((x) => x * 60),
})

const errorsCount = new Counter({
  name: 'discovery_watcher_errors',
  help: 'Value showing amount of errors since server start',
})

function initMetrics(): (blockNumber: number, changesCounter: number) => void {
  const histogramDone = syncHistogram.startTimer()

  return (blockNumber: number, changesCounter: number) => {
    histogramDone()
    latestBlock.set(blockNumber)
    changesDetected.set(changesCounter)
  }
}
