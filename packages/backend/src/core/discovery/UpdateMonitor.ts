import {
  ConfigReader,
  diffDiscovery,
  DiscoveryConfig,
  DiscoveryDiff,
} from '@l2beat/discovery'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { Logger } from '@l2beat/shared'
import { assert, ChainId, UnixTime } from '@l2beat/shared-pure'
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
    private readonly discoveryRunners: DiscoveryRunner[],
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
    for (const runner of this.discoveryRunners) {
      await this.updateChain(runner, timestamp)
    }
  }

  async updateChain(runner: DiscoveryRunner, timestamp: UnixTime) {
    // TODO: get block number based on clock time
    const blockNumber = await runner.getBlockNumber()
    const chainId = runner.getChainId()

    const metricsDone = this.initMetrics(blockNumber)

    const projectConfigs = await this.configReader.readAllConfigsForChain(
      chainId,
    )

    this.logger.info('Update started', {
      chain: ChainId.getName(chainId),
      projects: projectConfigs.length,
      blockNumber,
      timestamp: timestamp.toNumber(),
      date: timestamp.toDate().toISOString(),
    })

    for (const projectConfig of projectConfigs) {
      assert(
        projectConfig.chainId === chainId,
        `Discovery runner and project config chain id mismatch in project ${projectConfig.name}. Update the config.json file or config.discovery.`,
      )
      this.logger.info('Project update started', {
        chain: ChainId.getName(chainId),
        project: projectConfig.name,
      })

      try {
        await this.updateProject(runner, projectConfig, blockNumber, timestamp)
      } catch (error) {
        this.logger.error(
          {
            message: `[chain: ${ChainId.getName(
              chainId,
            )}] Failed to update project [${projectConfig.name}]`,
          },
          error,
        )
        errorsCount.inc()
      }

      this.logger.info('Project update finished', {
        chain: ChainId.getName(chainId),
        project: projectConfig.name,
      })
    }

    await this.findUnresolvedProjects(projectConfigs, timestamp)

    metricsDone()
    this.logger.info('Update finished', {
      chain: ChainId.getName(chainId),
      blockNumber,
      timestamp: timestamp.toNumber(),
      date: timestamp.toDate().toISOString(),
    })
  }

  private async updateProject(
    runner: DiscoveryRunner,
    projectConfig: DiscoveryConfig,
    blockNumber: number,
    timestamp: UnixTime,
  ) {
    const previousDiscovery = await this.getPreviousDiscovery(
      runner,
      projectConfig,
    )

    const discovery = await runner.run(projectConfig, blockNumber, {
      runSanityCheck: true,
      injectInitialAddresses: true,
    })
    this.cachedDiscovery.set(projectConfig.name, discovery)

    const diff = diffDiscovery(
      previousDiscovery.contracts,
      discovery.contracts,
      projectConfig,
    )

    await this.handleDiff(
      diff,
      discovery,
      projectConfig,
      blockNumber,
      runner.getChainId(),
    )

    await this.repository.addOrUpdate({
      projectName: projectConfig.name,
      chainId: runner.getChainId(),
      timestamp,
      blockNumber,
      discovery,
      version: this.version,
      configHash: projectConfig.hash,
    })
  }

  async getPreviousDiscovery(
    runner: DiscoveryRunner,
    projectConfig: DiscoveryConfig,
  ): Promise<DiscoveryOutput> {
    const databaseEntry = await this.repository.findLatest(
      projectConfig.name,
      runner.getChainId(),
    )
    let previousDiscovery: DiscoveryOutput
    if (databaseEntry && databaseEntry.configHash === projectConfig.hash) {
      this.logger.info('Using database record', {
        chain: ChainId.getName(runner.getChainId()),
        project: projectConfig.name,
      })
      previousDiscovery = databaseEntry.discovery
    } else {
      this.logger.info('Using committed file', {
        chain: ChainId.getName(runner.getChainId()),
        project: projectConfig.name,
      })
      previousDiscovery = await this.configReader.readDiscovery(
        projectConfig.name,
        ChainId.ETHEREUM,
      )
    }

    if (previousDiscovery.version === this.version) {
      return previousDiscovery
    }
    this.logger.info(
      'Discovery logic version changed, discovering with new logic',
      {
        chain: ChainId.getName(runner.getChainId()),
        project: projectConfig.name,
      },
    )
    return await runner.run(projectConfig, previousDiscovery.blockNumber, {
      runSanityCheck: true,
      injectInitialAddresses: true,
    })
  }

  private async handleDiff(
    diff: DiscoveryDiff[],
    discovery: DiscoveryOutput,
    projectConfig: DiscoveryConfig,
    blockNumber: number,
    chainId: ChainId,
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
        ChainId.ETHEREUM,
      )
      await this.updateNotifier.handleUpdate(projectConfig.name, diff, {
        dependents,
        chainId,
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
        ChainId.ETHEREUM,
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
