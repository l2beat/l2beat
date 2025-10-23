import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import {
  type ConfigReader,
  type ConfigRegistry,
  type DiscoveryDiff,
  type DiscoveryOutput,
  diffDiscovery,
  generateStructureHash,
} from '@l2beat/discovery'
import { hashJson, sortObjectByKeys } from '@l2beat/shared'
import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import shuffle from 'lodash/shuffle'
import { Gauge } from 'prom-client'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import type { WorkerPool } from './createWorkers'
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
    private readonly discoveryOutputCache: DiscoveryOutputCache,
    private readonly logger: Logger,
    private readonly runOnStart: boolean,
    private readonly workerPool: WorkerPool,
    private readonly disabledProjects: string[] = [],
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
    })

    const allProjects = this.configReader.readAllDiscoveredProjects()
    const enabledProjects = shuffle(allProjects).filter(
      (project) => !this.disabledProjects.includes(project),
    )

    this.logger.info('Processing projects', {
      total: allProjects.length,
      enabled: enabledProjects.length,
      disabled: this.disabledProjects.length,
      disabledProjects: this.disabledProjects,
    })

    const tasks = enabledProjects.map((project) => ({
      identity: {
        id: project,
        name: `Update project ${project}`,
      },
      job: async () => {
        await this.updateProject(this.runner, project, timestamp)
        await this.updateDiffer?.runForProject(project, timestamp)
      },
    }))

    const results = await this.workerPool.runInPool(tasks)

    const updateEnd = UnixTime.now()
    const updateDuration = updateEnd - updateStart

    this.logger.info('Full update finished', {
      start: updateStart,
      end: updateEnd,
      duration: updateDuration,
      updateTarget: timestamp,
      updateTargetDate: targetDateIso,
      timedOut: results.timedOut,
      successCount: results.results.length,
      failedCount: results.errors.length,
      totalCount: tasks.length,
    })

    const reminders = this.generateDailyReminder()
    await this.updateNotifier.sendDailyReminder(reminders, timestamp)
  }

  generateDailyReminder(): Record<string, DailyReminderChainEntry> {
    const result: Record<string, DailyReminderChainEntry> = {}

    const projectConfigs = this.configReader
      .readAllDiscoveredProjects()
      .map((project) => this.configReader.readConfig(project))

    for (const projectConfig of projectConfigs) {
      if (projectConfig.archived) {
        continue
      }

      const discovery = this.discoveryOutputCache.get(projectConfig.name)

      if (!discovery) {
        continue
      }

      const committed = this.configReader.readDiscovery(projectConfig.name)

      const diff = diffDiscovery(committed.entries, discovery.entries)
      const severityCounts = countSeverities(diff)

      if (diff.length > 0) {
        result[projectConfig.name] = { severityCounts }
      }
    }

    return result
  }

  async updateProject(
    runner: DiscoveryRunner,
    project: string,
    timestamp: UnixTime,
  ) {
    const projectUpdateStart = UnixTime.now()

    this.logger.info('Project update started', {
      projectName: project,
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

      const runResult = await runner.run(
        projectConfig,
        timestamp,
        this.logger,
        'useCurrentTimestamp', // for dependent discoveries
      )

      // read previous state (committed vs DB) and prime flat sources if needed
      const previousDiscovery = await this.getPreviousDiscovery(
        runner,
        projectConfig,
      )

      const { discovery } = runResult
      if (!previousDiscovery || !discovery) {
        this.logger.warn('Previous or current discovery missing', {
          project,
        })
        return
      }

      this.discoveryOutputCache.set(projectConfig.name, discovery)

      const deployedDiscovered = this.configReader.readDiscovery(
        projectConfig.name,
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

      await this.handleUpdateNotifier(diff, discovery, projectConfig, timestamp)

      await this.db.updateMonitor.upsert({
        projectId: projectConfig.name,
        timestamp,
        blockNumber: 0,
        discovery,
        configHash: generateStructureHash(projectConfig.structure),
      })
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
    projectConfig: ConfigRegistry,
  ): Promise<DiscoveryOutput | undefined> {
    this.logger.info('Getting previous discovery', {
      project: projectConfig.name,
    })
    const project = { project: projectConfig.name }

    const databaseEntry = await this.db.updateMonitor.findLatest(
      projectConfig.name,
    )
    const diskDiscovery = this.configReader.readDiscovery(projectConfig.name)

    const flatSourceEntry = await this.db.flatSources.get(projectConfig.name)

    const flatSourceTimestamp = flatSourceEntry?.timestamp ?? 0
    const onDiskDiscoveryChanged = diskDiscovery.timestamp > flatSourceTimestamp
    const onDiskConfigChanged =
      databaseEntry?.configHash !==
      generateStructureHash(projectConfig.structure)

    let previousDiscovery: DiscoveryOutput

    if (onDiskConfigChanged || onDiskDiscoveryChanged) {
      this.logger.info('Using committed file', project)
      previousDiscovery = diskDiscovery
    } else {
      this.logger.info('Using database record', project)
      previousDiscovery = databaseEntry.discovery
    }

    const runResult = await runner.run(
      projectConfig,
      previousDiscovery.timestamp,
      this.logger,
      previousDiscovery.dependentDiscoveries,
    )
    const { discovery, flatSources } = runResult

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
      this.logger.info('Upserting flat source', project)
      await this.db.flatSources.upsert({
        projectId: projectConfig.name,
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
    timestamp: UnixTime,
  ) {
    if (diff.length === 0) {
      return
    }

    const dependents = findDependents(projectConfig.name, this.configReader)
    const unknownEntries = findUnknownEntries(
      discovery.name,
      discovery.entries,
      this.configReader,
    )
    await this.updateNotifier.handleUpdate(
      projectConfig.name,
      diff,
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
