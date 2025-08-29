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
    private readonly runner: DiscoveryRunner,
    private readonly updateNotifier: UpdateNotifier,
    private readonly updateDiffer: UpdateDiffer | undefined,
    private readonly configReader: ConfigReader,
    private readonly db: Database,
    private readonly clock: Clock,
    private readonly chainConverter: ChainConverter,
    private readonly discoveryOutputCache: DiscoveryOutputCache,
    private readonly logger: Logger,
    private readonly runOnStart: boolean,
    private readonly chains: string[],
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
      chainsCount: this.chains.length,
    })

    const projects = this.configReader.readAllDiscoveredProjects()
    for (const { project, chains } of projects) {
      await this.updateProject(this.runner, project, chains, timestamp)
      await this.updateDiffer?.runForProject(project, chains, timestamp)
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

    for (const chain of this.chains) {
      const projectConfigs =
        this.configReader.readAllDiscoveredConfigsForChain(chain)

      for (const projectConfig of projectConfigs) {
        if (projectConfig.archived) {
          continue
        }

        const discovery = this.discoveryOutputCache.get(
          projectConfig.name,
          chain,
        )

        if (!discovery) {
          continue
        }

        const committed = this.configReader.readDiscovery(
          projectConfig.name,
          chain,
        )

        const diff = diffDiscovery(committed.entries, discovery.entries)
        const severityCounts = countSeverities(diff)

        if (diff.length > 0) {
          result[projectConfig.name] ??= []
          result[projectConfig.name].push({
            chainName: chain,
            severityCounts,
          })
        }
      }
    }

    return result
  }

  async updateProject(
    runner: DiscoveryRunner,
    project: string,
    chains: string[],
    timestamp: UnixTime,
  ) {
    const projectUpdateStart = UnixTime.now()

    this.logger.info('Project update started', {
      projectName: project,
      chains: chains.join(','),
      timestamp,
      date: UnixTime.toDate(timestamp).toISOString(),
    })

    const projectFinished = projectGauge.startTimer({ project })

    const chainUpdateStart = UnixTime.now()
    try {
      const projectConfig = this.configReader.readConfig(project)

      // additional safety: skip archived per-chain config
      if (projectConfig.archived) {
        this.logger.info('Skipping archived project config', { project })
        return
      }

      const discoveryPerChain = await runner.discoverWithRetry(
        projectConfig,
        timestamp,
        this.logger,
        undefined,
        undefined,
        'useCurrentTimestamp', // for dependent discoveries
      )

      for (const chain of chains) {
        // read previous state (committed vs DB) and prime flat sources if needed
        const previousDiscovery = await this.getPreviousDiscovery(
          runner,
          chain,
          projectConfig,
        )

        const { discovery } = discoveryPerChain[chain] ?? {
          discovery: undefined,
        }
        if (!previousDiscovery || !discovery) {
          this.logger.warn('Previous or current discovery missing', {
            project,
            chain,
          })
          continue
        }

        this.discoveryOutputCache.set(projectConfig.name, chain, discovery)

        const deployedDiscovered = this.configReader.readDiscovery(
          projectConfig.name,
          chain,
        )
        const unverifiedEntries = deployedDiscovered.entries
          .filter((c) => c.unverified)
          .map((c) => c.name)
          .filter((c) => c !== undefined)

        this.logErrorsInDiscovery(discovery, this.logger)

        const prevSanitizedDiscovery =
          sanitizeDiscoveryOutput(previousDiscovery)
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
          chain,
          timestamp,
        )

        await this.db.updateMonitor.upsert({
          projectId: projectConfig.name,
          chainId: ChainId(this.chainConverter.toChainId(chain)),
          timestamp,
          blockNumber: 0,
          discovery,
          configHash: hashJsonStable(projectConfig.structure),
        })

        const chainUpdateEnd = UnixTime.now()
        this.logger.info('Per-chain project update finished', {
          project,
          chain,
          start: chainUpdateStart,
          end: chainUpdateEnd,
          duration: chainUpdateEnd - chainUpdateStart,
        })
      }
    } catch (error) {
      errorCount.inc()
      const chainUpdateEnd = UnixTime.now()
      this.logger.error(
        {
          project,
          start: chainUpdateStart,
          end: chainUpdateEnd,
          duration: chainUpdateEnd - chainUpdateStart,
        },
        error,
      )
    }

    projectFinished()
    const projectUpdateEnd = UnixTime.now()
    this.logger.info('Project update finished', {
      project,
      start: projectUpdateStart,
      end: projectUpdateEnd,
      duration: projectUpdateEnd - projectUpdateStart,
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
    chain: string,
    projectConfig: ConfigRegistry,
  ): Promise<DiscoveryOutput | undefined> {
    this.logger.info('Getting previous discovery', {
      chain,
      project: projectConfig.name,
    })
    const projectPair = { chain, project: projectConfig.name }

    const databaseEntry = await this.db.updateMonitor.findLatest(
      projectConfig.name,
      ChainId(this.chainConverter.toChainId(chain)),
    )
    const diskDiscovery = this.configReader.readDiscovery(
      projectConfig.name,
      chain,
    )

    const flatSourceEntry = await this.db.flatSources.get(
      projectConfig.name,
      ChainId(this.chainConverter.toChainId(chain)),
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

    const discoveryPerChain = await runner.discoverWithRetry(
      projectConfig,
      previousDiscovery.timestamp,
      this.logger,
      undefined,
      undefined,
      previousDiscovery.dependentDiscoveries,
    )
    const { discovery, flatSources } = discoveryPerChain[chain] ?? {
      discovery: undefined,
      flatSources: {},
    }

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
        chainId: ChainId(this.chainConverter.toChainId(chain)),
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
