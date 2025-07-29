import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import {
  type ConfigReader,
  type ConfigRegistry,
  type DiscoveryDiff,
  type DiscoveryOutput,
  diffDiscovery,
  hashJsonStable,
} from '@l2beat/discovery'
import { hashJson, sortObjectByKeys } from '@l2beat/shared'
import {
  assert,
  assertUnreachable,
  type ChainConverter,
  ChainId,
  UnixTime,
} from '@l2beat/shared-pure'
import { Gauge } from 'prom-client'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import type { DiscoveryOutputCache } from './DiscoveryOutputCache'
import type { DiscoveryRunner } from './DiscoveryRunner'
import { sanitizeDiscoveryOutput } from './sanitizeDiscoveryOutput'
import type { UpdateDiffer } from './UpdateDiffer'
import type { DailyReminderChainEntry, UpdateNotifier } from './UpdateNotifier'
import { findDependents } from './utils/findDependents'
import { findUnknownEntries } from './utils/findUnknownEntries'

export class UpdateMonitor {
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly discoveryRunners: DiscoveryRunner[],
    private readonly updateNotifier: UpdateNotifier,
    private readonly updateDiffer: UpdateDiffer | undefined,
    private readonly configReader: ConfigReader,
    private readonly db: Database,
    private readonly clock: Clock,
    private readonly chainConverter: ChainConverter,
    private readonly discoveryOutputCache: DiscoveryOutputCache,
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
    const targetDateIso = UnixTime.toDate(timestamp).toISOString()
    const updateStart = UnixTime.now()

    this.logger.info('Full update started', {
      start: updateStart,
      updateTarget: timestamp,
      updateTargetDate: targetDateIso,
      chainsCount: this.discoveryRunners.length,
    })

    for (const runner of this.discoveryRunners) {
      await this.updateChain(runner, timestamp)
      await this.updateDiffer?.runForChain(runner.chain, timestamp)
    }

    const updateEnd = UnixTime.now()
    const updateDuration = updateEnd - updateStart

    this.logger.info('Full update finished', {
      start: updateStart,
      end: updateEnd,
      duration: updateDuration,
      updateTarget: timestamp,
      updateTargetDate: targetDateIso,
    })

    const reminders = this.generateDailyReminder()
    await this.updateNotifier.sendDailyReminder(reminders, timestamp)
  }

  generateDailyReminder(): Record<string, DailyReminderChainEntry[]> {
    const result: Record<string, DailyReminderChainEntry[]> = {}

    for (const runner of this.discoveryRunners) {
      const projectConfigs = this.configReader.readAllDiscoveredConfigsForChain(
        runner.chain,
      )

      for (const projectConfig of projectConfigs) {
        if (projectConfig.archived) {
          continue
        }

        const discovery = this.discoveryOutputCache.get(
          projectConfig.name,
          runner.chain,
        )

        if (!discovery) {
          continue
        }

        const committed = this.configReader.readDiscovery(
          projectConfig.name,
          runner.chain,
        )

        const diff = diffDiscovery(committed.entries, discovery.entries)
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
    const chainUpdateStart = UnixTime.now()

    // #region metrics
    errorCount.set(0)
    // #endregion

    const projectConfigs = this.configReader.readAllDiscoveredConfigsForChain(
      runner.chain,
    )

    this.logger.info('Chain update started', {
      chain: runner.chain,
      projects: projectConfigs.length,
      timestamp: timestamp,
      date: UnixTime.toDate(timestamp).toISOString(),
    })

    for (const projectConfig of projectConfigs) {
      const projectUpdateStart = UnixTime.now()
      assert(
        projectConfig.chain === runner.chain,
        `Discovery runner and project config chain mismatch in project ${projectConfig.name}. Update the config.json file or config.discovery.`,
      )

      // Skip archived configurations as an additional safety measure
      if (projectConfig.archived) {
        this.logger.info('Skipping archived project', {
          chain: runner.chain,
          project: projectConfig.name,
        })
        continue
      }

      this.logger.info('Project update started', {
        chain: runner.chain,
        project: projectConfig.name,
      })

      const projectFinished = projectGauge.startTimer({
        project: `${runner.chain}:${projectConfig.name}`,
      })
      try {
        await this.updateProject(runner, projectConfig, timestamp)
      } catch (error) {
        this.logger.error(
          `[chain: ${runner.chain}] Failed to update project [${projectConfig.name}]`,
          error,
        )
        errorCount.inc()
      }
      const projectUpdateEnd = UnixTime.now()
      projectFinished()

      this.logger.info('Project update finished', {
        chain: runner.chain,
        project: projectConfig.name,
        start: projectUpdateStart,
        end: projectUpdateEnd,
        duration: projectUpdateEnd - projectUpdateStart,
      })
    }

    const chainUpdateEnd = UnixTime.now()

    this.logger.info('Chain update finished', {
      start: chainUpdateStart,
      end: chainUpdateEnd,
      duration: chainUpdateEnd - chainUpdateStart,
      chain: runner.chain,
      timestamp: timestamp,
      date: UnixTime.toDate(timestamp).toISOString(),
    })
  }

  private async updateProject(
    runner: DiscoveryRunner,
    projectConfig: ConfigRegistry,
    timestamp: UnixTime,
  ) {
    const previousDiscovery = await this.getPreviousDiscovery(
      runner,
      projectConfig,
    )

    const { discovery } = await runner.discoverWithRetry(
      projectConfig,
      timestamp,
      this.logger,
      undefined,
      undefined,
      'useCurrentTimestamp', // this is for dependent discoveries
    )

    if (!previousDiscovery || !discovery) return

    this.discoveryOutputCache.set(projectConfig.name, runner.chain, discovery)

    const deployedDiscovered = this.configReader.readDiscovery(
      projectConfig.name,
      projectConfig.chain,
    )
    const unverifiedEntries = deployedDiscovered.entries
      .filter((c) => c.unverified)
      .map((c) => c.name)
      .filter((c) => c !== undefined)

    this.logErrorsInDiscovery(discovery, this.logger)

    const prevSanitizedDiscovery = sanitizeDiscoveryOutput(previousDiscovery)
    const sanitizedDiscovery = sanitizeDiscoveryOutput(discovery)

    const diff = diffDiscovery(
      prevSanitizedDiscovery.entries,
      sanitizedDiscovery.entries,
      unverifiedEntries,
    )

    await this.handleUpdateNotifier(
      diff,
      discovery,
      projectConfig,
      runner.chain,
      timestamp,
    )

    await this.db.updateMonitor.upsert({
      projectId: projectConfig.name,
      chainId: ChainId(this.chainConverter.toChainId(runner.chain)),
      timestamp,
      blockNumber: 0,
      discovery,
      configHash: hashJsonStable(projectConfig.structure),
    })
  }

  private logErrorsInDiscovery(
    discovery: DiscoveryOutput,
    logger: Logger,
  ): void {
    for (const contract of discovery.entries) {
      if (contract.errors !== undefined) {
        for (const [field, error] of Object.entries(contract.errors)) {
          logger.warn('There was an error during discovery', {
            field,
            error,
          })
        }
      }
    }
  }

  async getPreviousDiscovery(
    runner: DiscoveryRunner,
    projectConfig: ConfigRegistry,
  ): Promise<DiscoveryOutput | undefined> {
    this.logger.info('Getting previous discovery', {
      chain: runner.chain,
      project: projectConfig.name,
    })
    const projectPair = { chain: runner.chain, project: projectConfig.name }

    const databaseEntry = await this.db.updateMonitor.findLatest(
      projectConfig.name,
      ChainId(this.chainConverter.toChainId(runner.chain)),
    )
    const diskDiscovery = this.configReader.readDiscovery(
      projectConfig.name,
      runner.chain,
    )

    const flatSourceEntry = await this.db.flatSources.get(
      projectConfig.name,
      ChainId(this.chainConverter.toChainId(runner.chain)),
    )

    const flatSourceTimestamp = flatSourceEntry?.timestamp ?? 0
    const onDiskDiscoveryChanged = diskDiscovery.timestamp > flatSourceTimestamp
    const onDiskConfigChanged =
      databaseEntry?.configHash !== hashJsonStable(projectConfig.structure)

    let previousDiscovery: DiscoveryOutput

    if (onDiskConfigChanged || onDiskDiscoveryChanged) {
      this.logger.info('Using committed file', projectPair)
      previousDiscovery = diskDiscovery
    } else {
      this.logger.info('Using database record', projectPair)
      previousDiscovery = databaseEntry.discovery
    }

    const { discovery, flatSources } = await runner.discoverWithRetry(
      projectConfig,
      previousDiscovery.timestamp,
      this.logger,
      undefined,
      undefined,
      previousDiscovery.dependentDiscoveries,
    )

    // NOTE(radomski): We should only write to the database files that are
    // resulting from discoveries accepted by the research team. Otherwise an
    // update could happen to the implementation of a contract. UpdateMonitor
    // will find it and write the _new_ implementation's source code to the
    // database.
    //
    // A project can update, have it's source changed and the config will stay
    // the same. The only way to detect it is to check if the block number of
    // the ondisk discovery is higher than the one in the flat source table
    if (onDiskConfigChanged || onDiskDiscoveryChanged) {
      this.logger.info('Upserting flat source', projectPair)
      await this.db.flatSources.upsert({
        projectId: projectConfig.name,
        chainId: ChainId(this.chainConverter.toChainId(runner.chain)),
        timestamp: previousDiscovery.timestamp,
        contentHash: hashJson(sortObjectByKeys(flatSources)),
        flat: flatSources,
      })
    }

    return discovery
  }

  private async handleUpdateNotifier(
    diff: DiscoveryDiff[],
    discovery: DiscoveryOutput,
    projectConfig: ConfigRegistry,
    chain: string,
    timestamp: UnixTime,
  ) {
    if (diff.length === 0) {
      return
    }

    const dependents = findDependents(
      projectConfig.name,
      chain,
      this.configReader,
    )
    const unknownEntries = findUnknownEntries(
      discovery.name,
      discovery.entries,
      this.configReader,
      chain,
    )
    await this.updateNotifier.handleUpdate(
      projectConfig.name,
      diff,
      ChainId(this.chainConverter.toChainId(chain)),
      dependents,
      unknownEntries,
      timestamp,
    )
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
  const result = { low: 0, high: 0, unknown: 0 }

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
