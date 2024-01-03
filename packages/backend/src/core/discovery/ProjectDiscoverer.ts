import { assert, Logger } from '@l2beat/backend-tools'
import { ConfigReader, DiscoveryConfig } from '@l2beat/discovery'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import { DiscoveryHistoryRepository } from '../../peripherals/database/discovery/DiscoveryHistoryRepository'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { DiscoveryRunner } from './DiscoveryRunner'

export class ProjectDiscoverer {
  private readonly taskQueue: TaskQueue<UnixTime>
  private projectConfig: DiscoveryConfig | undefined = undefined
  private readonly knownSet = new Set<number>()

  constructor(
    private readonly discoveryRunner: DiscoveryRunner,
    private readonly projectName: string,
    private readonly chainId: ChainId,
    private readonly configReader: ConfigReader,
    private readonly repository: DiscoveryHistoryRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly version: number,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.discover(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: ProjectDiscoverer.name,
      },
    )
  }

  async start() {
    this.logger.info('Started')

    const known = await this.repository.getTimestamps(
      this.projectName,
      this.chainId,
    )

    for (const timestamp of known) {
      this.knownSet.add(timestamp.toStartOf('day').toNumber())
    }

    this.projectConfig = await this.configReader.readConfig(
      this.projectName,
      this.chainId,
    )

    return this.clock.onEveryDay((timestamp) => {
      if (!this.knownSet.has(timestamp.toStartOf('day').toNumber())) {
        this.taskQueue.addToFront(timestamp)
      }
    })
  }

  async waitUntilDiscovered(refreshIntervalMs = 1000) {
    while (!this.taskQueue.isEmpty()) {
      this.logger.debug('Something is waiting for waitUntilDiscovered')
      await setTimeout(refreshIntervalMs)
    }
  }

  async discover(timestamp: UnixTime) {
    const blockNumber = await this.discoveryRunner.getBlockNumberAt(timestamp)

    this.logger.info('Discovering started', {
      chain: ChainId.getName(this.chainId),
      project: this.projectName,
      blockNumber,
      timestamp: timestamp.toNumber(),
      date: timestamp.toDate().toISOString(),
    })

    assert(this.projectConfig !== undefined)

    const discovery = await this.discoveryRunner.run(
      this.projectConfig,
      blockNumber,
      {
        logger: this.logger,
        runSanityCheck: false,
        injectInitialAddresses: false,
      },
    )

    this.logger.info('Discovering finished', {
      chain: ChainId.getName(this.chainId),
      project: this.projectName,
      blockNumber,
      timestamp: timestamp.toNumber(),
      date: timestamp.toDate().toISOString(),
    })

    await this.repository.addOrUpdate({
      projectName: this.projectName,
      chainId: this.chainId,
      timestamp,
      blockNumber,
      discovery,
      version: this.version,
      configHash: this.projectConfig.hash,
    })
  }
}
