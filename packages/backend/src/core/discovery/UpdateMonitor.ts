import {
  ConfigReader,
  diffDiscovery,
  DiscoveryConfig,
  DiscoveryDiff,
} from '@l2beat/discovery'
import { Logger } from '@l2beat/shared'
import { DiscoveryOutput, UnixTime } from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { Gauge, Histogram } from 'prom-client'

import { UpdateMonitorRepository } from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { DiscoveryRunner } from './DiscoveryRunner'
import { UpdateNotifier } from './UpdateNotifier'
import { findDependents } from './utils/findDependents'
import { findUnknownContracts } from './utils/findUnknownContracts'

export class UpdateMonitor {
  private readonly taskQueue: TaskQueue<UnixTime>
  readonly cachedDiscovery = new Map<string, DiscoveryOutput>()

  constructor(
    private readonly provider: providers.AlchemyProvider,
    private readonly discoveryRunner: DiscoveryRunner,
    private readonly updateNotifier: UpdateNotifier,
    private readonly configReader: ConfigReader,
    private readonly repository: UpdateMonitorRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly runOnStart: boolean,
    private readonly version: number,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: UpdateMonitor.name,
      },
    )
  }

  async start() {
    this.logger.info('Started')
    if (this.runOnStart) {
      await this.updateNotifier.handleStart()
      this.taskQueue.addToFront(UnixTime.now())
    }
    return this.clock.onNewHour((timestamp) => {
      this.taskQueue.addToFront(timestamp)
    })
  }

  async update(timestamp: UnixTime) {
    // TODO: get block number based on clock time
    const blockNumber = await this.provider.getBlockNumber()
    const metricsDone = this.initMetrics(blockNumber)
    this.logger.info('Update started', {
      blockNumber,
      timestamp: timestamp.toNumber(),
    })

    const projectConfigs = await this.configReader.readAllConfigs()

    for (const projectConfig of projectConfigs) {
      this.logger.info('Project update started', {
        project: projectConfig.name,
      })

      try {
        await this.updateProject(projectConfig, blockNumber, timestamp)
      } catch (error) {
        this.logger.error(
          { message: `Failed to update project [${projectConfig.name}]` },
          error,
        )
        errorsCount.inc()
      }

      this.logger.info('Project update finished', {
        project: projectConfig.name,
      })
    }

    await this.findUnresolvedProjects(projectConfigs, timestamp)

    metricsDone()
    this.logger.info('Update finished', {
      blockNumber,
      timestamp: timestamp.toNumber(),
    })
  }

  private async updateProject(
    projectConfig: DiscoveryConfig,
    blockNumber: number,
    timestamp: UnixTime,
  ) {
    const previousDiscovery = await this.getPreviousDiscovery(projectConfig)

    const discovery = await this.discoveryRunner.run(
      projectConfig,
      blockNumber,
      {
        runSanityCheck: true,
        injectInitialAddresses: true,
      },
    )
    this.cachedDiscovery.set(projectConfig.name, discovery)

    const diff = diffDiscovery(
      previousDiscovery.contracts,
      discovery.contracts,
      projectConfig,
    )

    await this.handleDiff(diff, discovery, projectConfig, blockNumber)

    await this.repository.addOrUpdate({
      projectName: projectConfig.name,
      timestamp,
      blockNumber,
      discovery,
      version: this.version,
      configHash: projectConfig.hash,
    })
  }

  async getPreviousDiscovery(
    projectConfig: DiscoveryConfig,
  ): Promise<DiscoveryOutput> {
    const databaseEntry = await this.repository.findLatest(projectConfig.name)
    let previousDiscovery: DiscoveryOutput
    if (databaseEntry && databaseEntry.configHash === projectConfig.hash) {
      this.logger.info('Using database record', {
        project: projectConfig.name,
      })
      previousDiscovery = databaseEntry.discovery
    } else {
      this.logger.info('Using committed file', { project: projectConfig.name })
      previousDiscovery = await this.configReader.readDiscovery(
        projectConfig.name,
      )
    }

    if (previousDiscovery.version === this.version) {
      return previousDiscovery
    }
    this.logger.info(
      'Discovery logic version changed, discovering with new logic',
      { project: projectConfig.name },
    )
    return await this.discoveryRunner.run(
      projectConfig,
      previousDiscovery.blockNumber,
      {
        runSanityCheck: true,
        injectInitialAddresses: true,
      },
    )
  }

  private async handleDiff(
    diff: DiscoveryDiff[],
    discovery: DiscoveryOutput,
    projectConfig: DiscoveryConfig,
    blockNumber: number,
  ) {
    if (diff.length > 0) {
      const dependents = await findDependents(
        projectConfig.name,
        this.configReader,
      )
      const unknownContracts = await findUnknownContracts(
        discovery.name,
        discovery.contracts,
        this.configReader,
      )
      await this.updateNotifier.handleUpdate(projectConfig.name, diff, {
        dependents,
        blockNumber,
        unknownContracts,
      })
      changesDetected.inc()
    }
  }

  // this function gets a diff between current discovery and committed discovery
  // and checks if there are any changes that are not yet resolved
  // sends the results to the notification manager
  async findUnresolvedProjects(
    projectConfigs: DiscoveryConfig[],
    timestamp: UnixTime,
  ) {
    const notUpdatedProjects: string[] = []

    for (const projectConfig of projectConfigs) {
      const discovery = this.cachedDiscovery.get(projectConfig.name)

      if (!discovery) {
        continue
      }

      const committed = await this.configReader.readDiscovery(
        projectConfig.name,
      )

      const diff = diffDiscovery(
        committed.contracts,
        discovery.contracts,
        projectConfig,
      )

      if (diff.length > 0) {
        notUpdatedProjects.push(projectConfig.name)
      }
    }

    await this.updateNotifier.handleUnresolved(notUpdatedProjects, timestamp)
  }

  initMetrics(blockNumber: number): () => void {
    const histogramDone = syncHistogram.startTimer()
    changesDetected.set(0)
    errorsCount.set(0)

    return () => {
      histogramDone()
      latestBlock.set(blockNumber)
    }
  }
}

const latestBlock = new Gauge({
  name: 'discovery_watcher_last_synced',
  help: 'Value showing latest block number with which UpdateMonitor was run',
})

const changesDetected = new Gauge({
  name: 'discovery_watcher_changes_detected',
  help: 'Value showing the amount of changes detected by UpdateMonitor',
})

const syncHistogram = new Histogram({
  name: 'discovery_watcher_sync_duration_histogram',
  help: 'Histogram showing UpdateMonitor sync duration',
  buckets: [1, 2, 4, 6, 8, 10, 12, 15].map((x) => x * 60),
})

const errorsCount = new Gauge({
  name: 'discovery_watcher_errors',
  help: 'Value showing amount of errors in the update cycle',
})
