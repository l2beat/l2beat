import { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  DiscoveryConfig,
  DiscoveryDiff,
  diffDiscovery,
  normalizeDiffPath,
} from '@l2beat/discovery'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Gauge } from 'prom-client'

import { ChainConverter } from '../../tools/ChainConverter'
import { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import { DiscoveryRunner } from './DiscoveryRunner'
import { DailyReminderChainEntry, UpdateNotifier } from './UpdateNotifier'
import { UpdateMonitorRepository } from './repositories/UpdateMonitorRepository'
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
    private readonly repository: UpdateMonitorRepository,
    private readonly clock: Clock,
    private readonly chainConverter: ChainConverter,
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

    const reminders = await this.generateDailyReminder()
    await this.updateNotifier.sendDailyReminder(reminders, timestamp)
  }

  async generateDailyReminder(): Promise<
    Record<string, DailyReminderChainEntry[]>
  > {
    const result: Record<string, DailyReminderChainEntry[]> = {}

    for (const runner of this.discoveryRunners) {
      const projectConfigs = await this.configReader.readAllConfigsForChain(
        runner.chain,
      )

      for (const projectConfig of projectConfigs) {
        const discovery = this.cachedDiscovery.get(
          this.getCacheKey(projectConfig.name, runner.chain),
        )

        if (!discovery) {
          continue
        }

        const committed = await this.configReader.readDiscovery(
          projectConfig.name,
          runner.chain,
        )

        const diff = diffDiscovery(
          committed.contracts,
          discovery.contracts,
          projectConfig,
        )

        const severityCounts = countSeverities(diff, projectConfig)

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

    const projectConfigs = await this.configReader.readAllConfigsForChain(
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
    const discovery = await runner.run(projectConfig, blockNumber, {
      logger: this.logger,
      runSanityCheck: true,
      injectInitialAddresses: true,
    })

    if (!previousDiscovery || !discovery) return

    this.cachedDiscovery.set(
      this.getCacheKey(projectConfig.name, runner.chain),
      discovery,
    )

    const deployedDiscovered = await this.configReader.readDiscovery(
      projectConfig.name,
      projectConfig.chain,
    )
    const unverifiedContracts = deployedDiscovered.contracts
      .filter((c) => c.unverified)
      .map((c) => c.name)

    const prevSanitizedDiscovery = sanitizeDiscoveryOutput(previousDiscovery)
    const sanitizedDiscovery = sanitizeDiscoveryOutput(discovery)

    const diff = diffDiscovery(
      prevSanitizedDiscovery.contracts,
      sanitizedDiscovery.contracts,
      projectConfig,
      unverifiedContracts,
    )

    await this.handleDiff(
      diff,
      discovery,
      projectConfig,
      blockNumber,
      runner.chain,
    )

    await this.repository.addOrUpdate({
      projectName: projectConfig.name,
      chainId: this.chainConverter.toChainId(runner.chain),
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
  ): Promise<DiscoveryOutput | undefined> {
    const databaseEntry = await this.repository.findLatest(
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
      previousDiscovery = await this.configReader.readDiscovery(
        projectConfig.name,
        runner.chain,
      )
    }

    if (previousDiscovery.version === this.version) {
      return previousDiscovery
    }
    this.logger.info(
      'Discovery logic version changed, discovering with new logic',
      {
        chain: runner.chain,
        project: projectConfig.name,
      },
    )

    return await runner.run(projectConfig, previousDiscovery.blockNumber, {
      logger: this.logger,
      runSanityCheck: true,
      injectInitialAddresses: true,
    })
  }

  private async handleDiff(
    diff: DiscoveryDiff[],
    discovery: DiscoveryOutput,
    projectConfig: DiscoveryConfig,
    blockNumber: number,
    chain: string,
  ) {
    if (diff.length > 0) {
      const dependents = await findDependents(
        projectConfig.name,
        chain,
        this.configReader,
      )
      const unknownContracts = await findUnknownContracts(
        discovery.name,
        discovery.contracts,
        this.configReader,
        chain,
      )
      await this.updateNotifier.handleUpdate(
        projectConfig.name,
        diff,
        await this.configReader.readConfig(projectConfig.name, chain),
        blockNumber,
        this.chainConverter.toChainId(chain),
        dependents,
        unknownContracts,
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

function countSeverities(diffs: DiscoveryDiff[], config?: DiscoveryConfig) {
  const result = { low: 0, medium: 0, high: 0, unknown: 0 }
  if (config === undefined) {
    result.unknown = diffs
      .map((d) => d.diff?.length ?? 0)
      .reduce((a, b) => a + b, 0)
    return result
  }

  for (const diff of diffs) {
    const contract = config.getContract(diff.name)
    if (contract === undefined || diff.diff === undefined) {
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

      const key = normalizeDiffPath(field.key)
      const fields = contract.fields ?? {}

      if (fields[key] === undefined) {
        result.unknown += 1
        continue
      }

      const severity = fields[key].severity

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
        case null:
          result.unknown++
          break
      }
    }
  }

  return result
}
