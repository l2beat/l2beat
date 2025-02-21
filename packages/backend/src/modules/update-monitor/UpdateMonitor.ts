import type { Logger } from '@l2beat/backend-tools'
import {
  type ConfigReader,
  type DiscoveryConfig,
  type DiscoveryDiff,
  diffDiscovery,
} from '@l2beat/discovery'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import {
  assert,
  type ChainConverter,
  UnixTime,
  assertUnreachable,
} from '@l2beat/shared-pure'
import { Gauge } from 'prom-client'

import type { Database } from '@l2beat/database'
import { hashJson, sortObjectByKeys } from '@l2beat/shared'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import type { DiscoveryRunner } from './DiscoveryRunner'
import type { DailyReminderChainEntry, UpdateNotifier } from './UpdateNotifier'
import { sanitizeDiscoveryOutput } from './sanitizeDiscoveryOutput'
import { findDependents } from './utils/findDependents'
import { findUnknownContracts } from './utils/findUnknownContracts'

export class UpdateMonitor {
  private readonly taskQueue: TaskQueue<UnixTime>
  readonly cachedDiscovery = new Map<string, DiscoveryOutput>()

  constructor(
    private readonly discoveryRunners: DiscoveryRunner[],
    private readonly updateNotifier: UpdateNotifier,
    private readonly configReader: ConfigReader,
    private readonly db: Database,
    private readonly clock: Clock,
    private readonly chainConverter: ChainConverter,
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

    const reminders = this.generateDailyReminder()
    await this.updateNotifier.sendDailyReminder(reminders, timestamp)
  }

  generateDailyReminder(): Record<string, DailyReminderChainEntry[]> {
    const result: Record<string, DailyReminderChainEntry[]> = {}

    for (const runner of this.discoveryRunners) {
      const projectConfigs = this.configReader.readAllConfigsForChain(
        runner.chain,
      )

      for (const projectConfig of projectConfigs) {
        const discovery = this.cachedDiscovery.get(
          this.getCacheKey(projectConfig.name, runner.chain),
        )

        if (!discovery) {
          continue
        }

        const committed = this.configReader.readDiscovery(
          projectConfig.name,
          runner.chain,
        )

        const diff = diffDiscovery(committed.contracts, discovery.contracts)
        const severityCounts = countSeverities(diff)

        if (diff.length > 0) {
          result[projectConfig.name] ??= []
          result[projectConfig.name].push({
            chainName: runner.chain,
            severityCounts,
          })
        }
      }
    }

    return result
  }

  async updateChain(runner: DiscoveryRunner, timestamp: UnixTime) {
    // #region metrics
    errorCount.set(0)
    // #endregion

    // TODO: get block number based on clock time
    const blockNumber = await runner.getBlockNumber()

    const projectConfigs = this.configReader.readAllConfigsForChain(
      runner.chain,
    )

    this.logger.info('Update started', {
      chain: runner.chain,
      projects: projectConfigs.length,
      blockNumber,
      timestamp: timestamp.toNumber(),
      date: timestamp.toDate().toISOString(),
    })

    for (const projectConfig of projectConfigs) {
      assert(
        projectConfig.chain === runner.chain,
        `Discovery runner and project config chain mismatch in project ${projectConfig.name}. Update the config.json file or config.discovery.`,
      )
      this.logger.info('Project update started', {
        chain: runner.chain,
        project: projectConfig.name,
      })

      const projectFinished = projectGauge.startTimer({
        project: `${runner.chain}:${projectConfig.name}`,
      })
      try {
        await this.updateProject(runner, projectConfig, blockNumber, timestamp)
      } catch (error) {
        this.logger.error(
          `[chain: ${runner.chain}] Failed to update project [${projectConfig.name}]`,
          error,
        )
        errorCount.inc()
      }
      projectFinished()

      this.logger.info('Project update finished', {
        chain: runner.chain,
        project: projectConfig.name,
      })
    }

    this.logger.info('Update finished', {
      chain: runner.chain,
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
    const { discovery, flatSources } = await runner.discoverWithRetry(
      projectConfig,
      blockNumber,
      this.logger,
    )

    if (!previousDiscovery || !discovery) return

    this.cachedDiscovery.set(
      this.getCacheKey(projectConfig.name, runner.chain),
      discovery,
    )

    const deployedDiscovered = this.configReader.readDiscovery(
      projectConfig.name,
      projectConfig.chain,
    )
    const unverifiedContracts = deployedDiscovered.contracts
      .filter((c) => c.unverified)
      .map((c) => c.name)

    this.logErrorsInDiscovery(discovery, this.logger)

    const prevSanitizedDiscovery = sanitizeDiscoveryOutput(previousDiscovery)
    const sanitizedDiscovery = sanitizeDiscoveryOutput(discovery)

    const diff = diffDiscovery(
      prevSanitizedDiscovery.contracts,
      sanitizedDiscovery.contracts,
      unverifiedContracts,
    )

    await this.handleDiff(
      diff,
      discovery,
      projectConfig,
      blockNumber,
      runner.chain,
      timestamp,
    )

    await this.db.updateMonitor.upsert({
      projectName: projectConfig.name,
      chainId: this.chainConverter.toChainId(runner.chain),
      timestamp,
      blockNumber,
      discovery,
      configHash: projectConfig.hash,
    })

    await this.db.flatSources.upsert({
      projectName: projectConfig.name,
      chainId: this.chainConverter.toChainId(runner.chain),
      blockNumber,
      contentHash: hashJson(sortObjectByKeys(flatSources)),
      flat: flatSources,
    })
  }

  private logErrorsInDiscovery(
    discovery: DiscoveryOutput,
    logger: Logger,
  ): void {
    for (const contract of discovery.contracts) {
      if (contract.errors !== undefined) {
        for (const [field, error] of Object.entries(contract.errors)) {
          logger.warn(`There was an error during discovery`, {
            field,
            error,
          })
        }
      }
    }
  }

  async getPreviousDiscovery(
    runner: DiscoveryRunner,
    projectConfig: DiscoveryConfig,
  ): Promise<DiscoveryOutput | undefined> {
    const databaseEntry = await this.db.updateMonitor.findLatest(
      projectConfig.name,
      this.chainConverter.toChainId(runner.chain),
    )
    let previousDiscovery: DiscoveryOutput
    if (databaseEntry && databaseEntry.configHash === projectConfig.hash) {
      this.logger.info('Using database record', {
        chain: runner.chain,
        project: projectConfig.name,
      })
      previousDiscovery = databaseEntry.discovery
    } else {
      this.logger.info('Using committed file', {
        chain: runner.chain,
        project: projectConfig.name,
      })
      previousDiscovery = this.configReader.readDiscovery(
        projectConfig.name,
        runner.chain,
      )
    }

    const result = await runner.discoverWithRetry(
      projectConfig,
      previousDiscovery.blockNumber,
      this.logger,
    )

    return result.discovery
  }

  private async handleDiff(
    diff: DiscoveryDiff[],
    discovery: DiscoveryOutput,
    projectConfig: DiscoveryConfig,
    blockNumber: number,
    chain: string,
    timestamp: UnixTime,
  ) {
    if (diff.length > 0) {
      const dependents = findDependents(
        projectConfig.name,
        chain,
        this.configReader,
      )
      const unknownContracts = findUnknownContracts(
        discovery.name,
        discovery.contracts,
        this.configReader,
        chain,
      )
      await this.updateNotifier.handleUpdate(
        projectConfig.name,
        diff,
        blockNumber,
        this.chainConverter.toChainId(chain),
        dependents,
        unknownContracts,
        timestamp,
      )
    }
  }

  private getCacheKey(projectName: string, chain: string): string {
    return `${chain}:${projectName}`
  }
}

type ProjectGauge = Gauge<'project'>
const projectGauge: ProjectGauge = new Gauge({
  name: 'update_monitor_project_discovery_duration_seconds',
  help: 'Duration gauge of discovering a project',
  labelNames: ['project'],
})

const errorCount = new Gauge({
  name: 'update_monitor_error_count',
  help: 'Value showing amount of errors in the update cycle',
})

function countSeverities(diffs: DiscoveryDiff[]) {
  const result = { low: 0, medium: 0, high: 0, unknown: 0 }

  for (const diff of diffs) {
    if (diff.diff === undefined) {
      result.unknown += 1
      continue
    }

    for (const field of diff.diff) {
      if (field.key === undefined) {
        result.unknown += 1
        continue
      }

      // NOTE(radomski): upgradeability section is not in `contract.fields` but
      // changes to it are also in the diff. Changes to the implementation are
      // high severity, so just handle this special edge case here.
      if (field.key === 'upgradeability.implementation') {
        result.high += 1
        continue
      }

      const severity = field.severity

      switch (severity) {
        case 'LOW':
          result.low++
          break
        case 'MEDIUM':
          result.medium++
          break
        case 'HIGH':
          result.high++
          break
        case undefined:
        case null:
          result.unknown++
          break
        default:
          assertUnreachable(severity)
      }
    }
  }

  return result
}
