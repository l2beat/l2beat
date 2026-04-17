import type { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import {
  type ConfigRegistry,
  type DiscoveryOutput,
  diffDiscovery,
  generateStructureHash,
  saveDiscoveredJson,
} from '@l2beat/discovery'
import { DiscordClient, HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { writeFile, mkdir, rm } from 'fs/promises'
import { dirname, join } from 'path'
import { createDefiscanServer } from '@l2beat/defiscan-endpoints/build/server'
import { Clock } from '../../../tools/Clock'
import { TaskQueue } from '../../../tools/queue/TaskQueue'
import { createDiscoveryRunner } from '../../update-monitor/createDiscoveryRunner'
import type { DiscoveryRunner } from '../../update-monitor/DiscoveryRunner'
import { sanitizeDiscoveryOutput } from '../../update-monitor/sanitizeDiscoveryOutput'
import { UpdateMessagesService } from '../../update-monitor/UpdateMessagesService'
import { UpdateNotifier } from '../../update-monitor/UpdateNotifier'
import { findDependents } from '../../update-monitor/utils/findDependents'
import { findUnknownEntries } from '../../update-monitor/utils/findUnknownEntries'
import { FundsRefresher } from './FundsRefresher'
import type { MonitorConfig } from './monitorConfig'
import { ReviewCompiler } from '@l2beat/l2b/dist/implementations/discovery-ui/defidisco/reviewCompiler'
import {
  readActivityFile,
  writeActivityFile,
} from '@l2beat/l2b/dist/implementations/discovery-ui/defidisco/activity'
import { classifyDiff } from '@l2beat/l2b/dist/implementations/discovery-ui/defidisco/activityClassifier'
import { getContractTags } from '@l2beat/l2b/dist/implementations/discovery-ui/defidisco/contractTags'
import { getLinesOfCode } from '@l2beat/l2b/dist/implementations/discovery-ui/defidisco/resources'

/**
 * DeFiDisco Continuous Monitoring Service
 *
 * Runs hourly to:
 * 1. Discover smart contracts for all DeFi projects in defidisco-config.json
 * 2. Diff against previous discovery (stored in PostgreSQL)
 * 3. Send Discord notifications on changes
 * 4. Refresh live funds data (token balances, DeFi positions)
 * 5. Compile self-contained review JSON per project (for future D1 ingestion)
 *
 * This is a lightweight orchestrator that reuses existing L2Beat infrastructure:
 * - DiscoveryRunner for contract analysis
 * - UpdateNotifier for Discord alerts (single channel)
 * - PostgreSQL for previous discovery storage
 * - defiscan-endpoints for DeBank API access
 */
export class DefidiscoMonitorApplication {
  private readonly taskQueue: TaskQueue<UnixTime>
  private readonly db: ReturnType<typeof createDatabase>
  private readonly clock: Clock
  private readonly runner: DiscoveryRunner
  private readonly updateNotifier: UpdateNotifier
  private readonly fundsRefresher: FundsRefresher
  private readonly reviewCompiler: ReviewCompiler
  private readonly discordClient: DiscordClient | undefined
  private stopClock?: () => void

  constructor(
    private readonly config: MonitorConfig,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)

    // Database
    this.db = createDatabase({
      connectionString: config.database.connectionString,
      application_name: 'defidisco-monitor',
      ...(config.database.ssl
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    })

    // Clock — hourly trigger
    // minTimestamp is 1 day ago (we only care about recent hours)
    // safeTimeOffset = 60s to avoid future timestamps
    this.clock = new Clock(
      UnixTime.now() - UnixTime.DAY,
      60,
    )

    // HTTP client
    const http = new HttpClient()

    // Discovery runner
    this.runner = createDiscoveryRunner(
      config.discovery.paths,
      http,
      this.db,
      logger,
      config.discovery.chains,
      config.discovery.cacheEnabled,
      config.discovery.cacheUri,
    )

    // Discord
    if (config.discord) {
      this.discordClient = new DiscordClient(http, config.discord)
    }

    const updateMessagesService = new UpdateMessagesService(this.db, 30)
    const projectService = new ProjectService()

    this.updateNotifier = new UpdateNotifier(
      this.db,
      this.discordClient,
      logger,
      updateMessagesService,
      projectService,
    )

    // Funds refresher
    const defiscanUrl = `http://localhost:${config.defiscanEndpoints.port}`
    this.fundsRefresher = new FundsRefresher(
      config.discovery.paths,
      defiscanUrl,
      logger,
    )

    // Review compiler
    const reviewLogger = logger.for('ReviewCompiler')
    this.reviewCompiler = new ReviewCompiler(
      config.discovery.paths,
      (msg: string) => reviewLogger.info(msg),
    )

    // Task queue
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      logger.for('taskQueue'),
      { metricsId: 'defidisco_monitor' },
    )
  }

  async start(): Promise<void> {
    this.logger.info('Starting DeFiDisco Monitor', {
      projects: this.config.projects,
      projectCount: this.config.projects.length,
    })

    // Start defiscan-endpoints in-process
    const defiscanServer = createDefiscanServer(
      this.config.defiscanEndpoints,
      this.logger.for('defiscan-endpoints'),
    )
    await defiscanServer.start()
    this.logger.info('defiscan-endpoints started', {
      port: this.config.defiscanEndpoints.port,
    })

    // Send startup notification
    await this.sendDirectDiscordMessage('Monitor started.')

    // Queue immediate update if configured
    if (this.config.runOnStart) {
      this.taskQueue.addToFront(UnixTime.now() - UnixTime.MINUTE)
    }

    // Schedule updates every 12 hours (at midnight and noon UTC)
    this.stopClock = this.clock.onNewHour((timestamp) => {
      const hour = UnixTime.toDate(timestamp).getUTCHours()
      if (hour % 12 === 0) {
        this.taskQueue.addToFront(timestamp - UnixTime.MINUTE)
      }
    })

    this.logger.info('DeFiDisco Monitor started successfully')
  }

  /**
   * Run a single monitoring cycle and exit cleanly.
   * Used by GitHub Actions cron (RUN_ONCE=true).
   */
  async runOnce(): Promise<void> {
    this.logger.info('Starting DeFiDisco Monitor (run-once)', {
      projects: this.config.projects,
      projectCount: this.config.projects.length,
    })

    // Start defiscan-endpoints in-process
    const defiscanServer = createDefiscanServer(
      this.config.defiscanEndpoints,
      this.logger.for('defiscan-endpoints'),
    )
    await defiscanServer.start()

    await this.sendDirectDiscordMessage('Monitor started (run-once).')

    try {
      await this.update(UnixTime.now())
    } finally {
      await defiscanServer.stop()
      await this.db.close()
      this.logger.info('Run-once cycle completed, exiting')
    }
  }

  async stop(): Promise<void> {
    this.stopClock?.()
    await this.db.close()
    this.logger.info('DeFiDisco Monitor stopped')
  }

  // ==========================================================================
  // Main Update Loop
  // ==========================================================================

  private async update(timestamp: UnixTime): Promise<void> {
    const updateStart = Date.now()

    this.logger.info('Update cycle started', {
      timestamp,
      date: UnixTime.toDate(timestamp).toISOString(),
      projectCount: this.config.projects.length,
    })

    let totalChanges = 0
    const projectsWithChanges: string[] = []

    for (const project of this.config.projects) {
      const changes = await this.updateProject(project, timestamp)
      if (changes > 0) {
        totalChanges += changes
        projectsWithChanges.push(project)
      }
    }

    const durationSec = Math.round((Date.now() - updateStart) / 1000)

    this.logger.info('Update cycle completed', {
      durationSec,
      projectCount: this.config.projects.length,
      totalChanges,
    })

    const mins = Math.floor(durationSec / 60)
    const secs = durationSec % 60
    const duration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

    if (totalChanges > 0) {
      await this.sendDirectDiscordMessage(
        `\u{1F4CA} **Cycle summary**: ${this.config.projects.length} projects analyzed in ${duration} \u2014 ${totalChanges} change(s) in ${projectsWithChanges.join(', ')}`,
      )
    } else {
      await this.sendDirectDiscordMessage(
        `\u2705 **Cycle complete**: ${this.config.projects.length} projects analyzed in ${duration} \u2014 no changes`,
      )
    }
  }

  /** Returns the number of discovery changes found (0 = no changes). */
  private async updateProject(
    project: string,
    timestamp: UnixTime,
  ): Promise<number> {
    const projectStart = Date.now()
    let changeCount = 0

    this.logger.info('Project update started', { project })

    try {
      // Step 1: Discovery
      const { discovery, flatSources, diff } = await this.runDiscovery(project, timestamp)

      changeCount = diff?.length ?? 0

      // Step 2: Notify on changes
      if (discovery && diff && diff.length > 0) {
        await this.notifyChanges(project, discovery, diff, timestamp)
      }

      // Step 3: Store discovery (DB snapshot + committed discovered.json + flat sources)
      if (discovery) {
        await this.storeDiscovery(project, discovery, timestamp)
        await this.writeDiscoveredJson(project, discovery)
        if (flatSources && getLinesOfCode(this.config.discovery.paths, project) === undefined) {
          await this.writeFlatSources(project, flatSources)
        }
      }

      // Step 4: Refresh funds
      const fundsWarnings =
        await this.fundsRefresher.refreshFundsForProject(project)
      if (fundsWarnings.length > 0) {
        await this.sendDirectDiscordMessage(
          `⚠️ **${project}** funds warnings:\n${fundsWarnings.join('\n')}`,
        )
      }

      // Step 5: Reconcile activity.json against the UpdateNotifier table
      await this.reconcileActivity(project)

      // Step 6: Compile review
      await this.compileReview(project)
    } catch (error) {
      this.logger.error(
        { project },
        error instanceof Error ? error : new Error(String(error)),
      )
    }

    const durationSec = Math.round((Date.now() - projectStart) / 1000)
    this.logger.info('Project update completed', {
      project,
      durationSec,
      changeCount,
    })

    return changeCount
  }

  // ==========================================================================
  // Discovery
  // ==========================================================================

  private async runDiscovery(
    project: string,
    timestamp: UnixTime,
  ): Promise<{
    discovery: DiscoveryOutput | undefined
    flatSources: Record<string, string> | undefined
    diff: ReturnType<typeof diffDiscovery> | undefined
  }> {
    const { configReader } = this.config.discovery

    let projectConfig: ConfigRegistry
    try {
      projectConfig = configReader.readConfig(project)
    } catch (error) {
      this.logger.warn('Cannot read project config, skipping discovery', {
        project,
        error: String(error),
      })
      return { discovery: undefined, flatSources: undefined, diff: undefined }
    }

    if (projectConfig.archived) {
      this.logger.info('Skipping archived project', { project })
      return { discovery: undefined, flatSources: undefined, diff: undefined }
    }

    // Run discovery
    const runResult = await this.runner.run(
      projectConfig,
      timestamp,
      this.logger,
      { [projectConfig.name]: { timestamp } },
    )

    const { discovery, flatSources } = runResult

    // Get previous discovery for diffing
    const previousDiscovery = await this.getPreviousDiscovery(project)
    if (!previousDiscovery) {
      this.logger.info('No previous discovery — first run', { project })
      return { discovery, flatSources, diff: undefined }
    }

    // Diff
    const committedDiscovery = configReader.readDiscovery(project)
    const unverifiedEntries = committedDiscovery.entries
      .filter((c) => c.unverified)
      .map((c) => c.name)
      .filter((c): c is string => c !== undefined)

    const prevSanitized = sanitizeDiscoveryOutput(previousDiscovery)
    const currSanitized = sanitizeDiscoveryOutput(discovery)

    const diff = diffDiscovery(
      prevSanitized.entries,
      currSanitized.entries,
      unverifiedEntries,
    )

    return { discovery, flatSources, diff }
  }

  private async getPreviousDiscovery(
    project: string,
  ): Promise<DiscoveryOutput | undefined> {
    // Try database first
    const dbEntry = await this.db.updateMonitor.findLatest(project)
    if (dbEntry) {
      return dbEntry.discovery
    }

    // Fallback to committed discovered.json
    try {
      return this.config.discovery.configReader.readDiscovery(project)
    } catch {
      return undefined
    }
  }

  // ==========================================================================
  // Notification
  // ==========================================================================

  private async notifyChanges(
    project: string,
    discovery: DiscoveryOutput,
    diff: ReturnType<typeof diffDiscovery>,
    timestamp: UnixTime,
  ): Promise<void> {
    const { configReader } = this.config.discovery

    const dependents = findDependents(project, configReader)
    const unknownEntries = findUnknownEntries(
      discovery.name,
      discovery.entries,
      configReader,
    )

    await this.updateNotifier.handleUpdate(
      project,
      diff,
      dependents,
      unknownEntries,
      timestamp,
    )

    this.logger.info('Discord notification sent', {
      project,
      diffCount: diff.length,
    })
  }

  // ==========================================================================
  // Storage
  // ==========================================================================

  private async storeDiscovery(
    project: string,
    discovery: DiscoveryOutput,
    timestamp: UnixTime,
  ): Promise<void> {
    const { configReader } = this.config.discovery
    const projectConfig = configReader.readConfig(project)

    await this.db.updateMonitor.upsert({
      projectId: project,
      timestamp,
      blockNumber: 0,
      discovery,
      configHash: generateStructureHash(projectConfig.structure),
    })
  }

  /**
   * Writes the freshly-discovered output back to the committed
   * `discovered.json` file so that downstream consumers (frontend activity
   * feed, `$pastUpgrades`, compiled review) see the updated state.
   *
   * The GitHub Actions workflow that drives the monitor picks these files up
   * and commits them back to the repo, so any new on-chain changes observed
   * between runs automatically flow into the frontend on the next cycle.
   */
  private async writeDiscoveredJson(
    project: string,
    discovery: DiscoveryOutput,
  ): Promise<void> {
    try {
      const projectPath =
        this.config.discovery.configReader.getProjectPath(project)
      await saveDiscoveredJson(discovery, projectPath)
      this.logger.info('discovered.json written', {
        project,
        path: projectPath,
      })
    } catch (error) {
      // Never fail the whole project update over a write-back error — the
      // snapshot is already safe in the database and a follow-up cycle (or a
      // manual `l2b discover`) can re-attempt the write.
      this.logger.error(
        { project },
        error instanceof Error
          ? error
          : new Error(`Failed to write discovered.json: ${String(error)}`),
      )
    }
  }

  /**
   * Writes the flat sources returned by DiscoveryRunner to the project's
   * `.flat/` directory so that downstream consumers (countLinesOfCode in the
   * review compiler) can read them.
   *
   * `.flat/` is gitignored so these files don't exist after a fresh checkout —
   * this method recreates them from the in-memory discovery result.
   */
  private async writeFlatSources(
    project: string,
    flatSources: Record<string, string>,
  ): Promise<void> {
    try {
      const projectPath =
        this.config.discovery.configReader.getProjectPath(project)
      const flatDir = join(projectPath, '.flat')

      await rm(flatDir, { recursive: true, force: true })
      await mkdir(flatDir, { recursive: true })

      for (const [filePath, content] of Object.entries(flatSources)) {
        const outputPath = join(flatDir, filePath)
        await mkdir(dirname(outputPath), { recursive: true })
        await writeFile(outputPath, content)
      }

      this.logger.info('.flat sources written', {
        project,
        files: Object.keys(flatSources).length,
      })
    } catch (error) {
      this.logger.error(
        { project },
        error instanceof Error
          ? error
          : new Error(`Failed to write flat sources: ${String(error)}`),
      )
    }
  }

  // ==========================================================================
  // Activity Reconciliation
  // ==========================================================================

  /**
   * Keeps `<project>/activity.json` consistent with the `UpdateNotifier`
   * Postgres table. DB is the source of truth; we never write live events
   * from the current cycle — every diff has already been inserted into
   * `UpdateNotifier` by `UpdateNotifier.handleUpdate()` before this runs.
   *
   * On first run (`lastConsumedUpdateNotifierId === 0`) this performs a full
   * historical backfill. On subsequent runs it only appends rows with an
   * `id` greater than the previously-stored cursor.
   *
   * Upgrade events (`$implementation`, `$pastUpgrades`, `$upgradeCount`) are
   * intentionally skipped here — they come from `$pastUpgrades` on the
   * proxy contract, which the review compiler already handles.
   */
  private async reconcileActivity(project: string): Promise<void> {
    const { paths, configReader } = this.config.discovery

    let discovery: DiscoveryOutput
    try {
      discovery = configReader.readDiscovery(project)
    } catch (error) {
      this.logger.warn('Cannot read discovered.json, skipping activity reconcile', {
        project,
        error: String(error),
      })
      return
    }

    const file = readActivityFile(paths, project)

    let rows
    try {
      rows = await this.db.updateNotifier.getNewerThanId(
        project,
        file.lastConsumedUpdateNotifierId,
      )
    } catch (error) {
      this.logger.error(
        { project },
        error instanceof Error
          ? error
          : new Error(`Failed to load UpdateNotifier rows: ${String(error)}`),
      )
      return
    }

    if (rows.length === 0) {
      this.logger.info('No new activity rows to reconcile', { project })
      return
    }

    const tags = getContractTags(paths, project).tags
    const seenIds = new Set(file.events.map((e) => e.id))
    let appended = 0
    let maxId = file.lastConsumedUpdateNotifierId

    for (const row of rows) {
      if (row.id > maxId) maxId = row.id
      const events = classifyDiff(
        {
          id: row.id,
          projectId: row.projectId,
          timestamp: row.timestamp,
          diff: row.diff,
        },
        discovery,
        tags,
      )
      for (const event of events) {
        if (seenIds.has(event.id)) continue
        file.events.push(event)
        seenIds.add(event.id)
        appended++
      }
    }

    file.lastConsumedUpdateNotifierId = maxId
    file.lastReconciledAt = Math.floor(Date.now() / 1000)
    writeActivityFile(paths, project, file)

    this.logger.info('Activity reconciled', {
      project,
      rows: rows.length,
      appended,
      cursor: maxId,
    })
  }

  // ==========================================================================
  // Review Compilation
  // ==========================================================================

  private async compileReview(project: string): Promise<void> {
    const result = this.reviewCompiler.compile(project)

    switch (result.status) {
      case 'success':
        this.logger.info('Review compiled', { project, path: result.path })
        break

      case 'skipped':
        this.logger.info('Review compilation skipped', {
          project,
          reason: result.reason,
        })
        break

      case 'error':
        this.logger.error(
          { project },
          new Error(`Review compilation failed: ${result.error}`),
        )
        break
    }
  }

  // ==========================================================================
  // Discord Helpers
  // ==========================================================================

  /**
   * Sends a message directly via the Discord client, bypassing UpdateNotifier.
   * Used for operational alerts (startup, compilation warnings) that should
   * not be throttled.
   */
  private async sendDirectDiscordMessage(message: string): Promise<void> {
    if (!this.discordClient) return
    try {
      await this.discordClient.sendMessage(message, 'INTERNAL')
    } catch (error) {
      this.logger.error(
        'Failed to send Discord message',
        error instanceof Error ? error : new Error(String(error)),
      )
    }
  }
}
