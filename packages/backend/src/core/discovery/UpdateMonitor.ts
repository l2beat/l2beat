import { DiscoveryOutput, Hash256, Logger, UnixTime } from '@l2beat/shared'
import { providers } from 'ethers'
import { isEqual } from 'lodash'
import { Gauge, Histogram } from 'prom-client'

import { UpdateMonitorRepository } from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { ConfigReader } from './config/ConfigReader'
import { DiscoveryConfig } from './config/DiscoveryConfig'
import { DiscoveryRunner } from './DiscoveryRunner'
import { NotificationManager } from './NotificationManager'
import { diffDiscovery, DiscoveryDiff } from './output/diffDiscovery'
import { diffToMessages } from './output/diffToMessages'
import { findDependents } from './utils/findDependents'

export interface Diff {
  changes: DiscoveryDiff[]
  sendDailyReminder: boolean
}

export class UpdateMonitor {
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly provider: providers.AlchemyProvider,
    private readonly discoveryRunner: DiscoveryRunner,
    private readonly notificationManager: NotificationManager,
    private readonly configReader: ConfigReader,
    private readonly repository: UpdateMonitorRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly runOnStart: boolean,
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
      await this.notificationManager.notify('Discovery watcher started.')
      this.taskQueue.addToFront(UnixTime.now())
    }
    return this.clock.onNewHour((timestamp) => {
      this.taskQueue.addToFront(timestamp)
    })
  }

  async update(timestamp: UnixTime) {
    // TODO: get block number based on clock time
    const blockNumber = await this.provider.getBlockNumber()
    const metadataDone = this.initMetadata(blockNumber, timestamp)

    const projectConfigs = await this.configReader.readAllConfigs()

    const isDailyReminder = isNineAM(timestamp, 'CET')
    const notUpdatedProjects: string[] = []

    for (const projectConfig of projectConfigs) {
      this.logger.info('Discovery started', { project: projectConfig.name })

      try {
        await this.updateProject(
          projectConfig,
          blockNumber,
          isDailyReminder,
          notUpdatedProjects,
          timestamp,
        )
      } catch (error) {
        this.logger.error(error)
        errorsCount.inc()
      }
      this.logger.info('Discovery finished', { project: projectConfig.name })
    }

    if (isDailyReminder) {
      await this.notificationManager.sendDailyReminder(
        notUpdatedProjects,
        timestamp,
      )
    }

    metadataDone()
  }

  private async updateProject(
    projectConfig: DiscoveryConfig,
    blockNumber: number,
    isDailyReminder: boolean,
    notUpdatedProjects: string[],
    timestamp: UnixTime,
  ) {
    const discovery = await this.discoveryRunner.run(projectConfig, blockNumber)

    if (discovery.contracts.some((c) => c.errors !== undefined)) {
      notUpdatedProjects.push(projectConfig.name)
      return
    }

    const diff = await this.findChanges(
      projectConfig.name,
      discovery,
      projectConfig.hash,
      isDailyReminder,
      projectConfig,
    )

    if (diff.changes.length > 0) {
      await this.sanityCheck(discovery, diff, projectConfig, blockNumber)

      const dependents = await findDependents(
        projectConfig.name,
        this.configReader,
      )
      const messages = diffToMessages(
        projectConfig.name,
        dependents,
        diff.changes,
      )
      await this.notificationManager.notify(messages)
      this.logger.info('Sending messages', { project: projectConfig.name })
      changesDetected.inc()
    }

    if (diff.sendDailyReminder) {
      notUpdatedProjects.push(projectConfig.name)
    }

    await this.repository.addOrUpdate({
      projectName: projectConfig.name,
      timestamp,
      blockNumber,
      discovery,
      configHash: projectConfig.hash,
    })
  }

  async findChanges(
    name: string,
    discovery: DiscoveryOutput,
    configHash: Hash256,
    isDailyReminder: boolean,
    config: DiscoveryConfig,
  ): Promise<Diff> {
    const result: Diff = {
      changes: [],
      sendDailyReminder: false,
    }

    const committed = await this.configReader.readDiscovery(name)
    const diffFromCommitted = diffDiscovery(
      committed.contracts,
      discovery.contracts,
      config,
    )

    const databaseEntry = await this.repository.findLatest(name)
    let diffFromDatabase: DiscoveryDiff[] = []
    if (databaseEntry !== undefined) {
      diffFromDatabase = diffDiscovery(
        databaseEntry.discovery.contracts,
        discovery.contracts,
        config,
      )
    }

    if (isDailyReminder && diffFromCommitted.length > 0) {
      this.logger.debug('Include inside daily reminder', { project: name })
      result.sendDailyReminder = true
    }

    if (
      databaseEntry === undefined ||
      databaseEntry.configHash !== configHash
    ) {
      this.logger.debug('Using committed file for diff', { project: name })
      result.changes = diffFromCommitted
    } else {
      this.logger.debug('Using database record for diff', { project: name })
      result.changes = diffFromDatabase
    }

    return result
  }

  // 3rd party APIs are unstable, so we do a sanity check before sending
  // notifications, which makes the same request again and compares the
  // results.
  async sanityCheck(
    discovery: DiscoveryOutput,
    diff: Diff,
    projectConfig: DiscoveryConfig,
    blockNumber: number,
  ) {
    const secondDiscovery = await this.discoveryRunner.run(
      projectConfig,
      blockNumber,
    )

    if (!isEqual(discovery, secondDiscovery)) {
      await this.notificationManager.notify(
        `⚠️ [${projectConfig.name}]: API error (Alchemy or Etherscan) | ${blockNumber}`,
        { internalOnly: true },
      )
      throw new Error(
        `[${projectConfig.name}] Sanity check failed | ${blockNumber}\n
        potential-diff ${JSON.stringify(diff)}}`,
      )
    }
  }

  initMetadata(blockNumber: number, timestamp: UnixTime): () => void {
    this.logger.info('Update started', {
      blockNumber,
      timestamp: timestamp.toNumber(),
    })
    const histogramDone = syncHistogram.startTimer()
    changesDetected.set(0)
    errorsCount.set(0)

    return () => {
      histogramDone()
      latestBlock.set(blockNumber)
      this.logger.info('Update finished', {
        blockNumber,
        timestamp: timestamp.toNumber(),
      })
    }
  }
}

export function isNineAM(timestamp: UnixTime, timezone: 'CET' | 'UTC') {
  const offset = timezone === 'CET' ? 2 : 0
  const hour = 9 - offset

  return timestamp
    .toStartOf('hour')
    .equals(timestamp.toStartOf('day').add(hour, 'hours'))
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
