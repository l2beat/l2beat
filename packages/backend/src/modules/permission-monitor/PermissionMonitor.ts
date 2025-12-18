import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { ConfigReader } from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import { PermissionResolver } from './defidisco/PermissionResolver'
import type { PermissionNotifier } from './PermissionNotifier'

export class PermissionMonitor {
  private readonly taskQueue: TaskQueue<UnixTime>
  private readonly permissionResolver: PermissionResolver

  constructor(
    private readonly configReader: ConfigReader,
    private readonly db: Database,
    private readonly permissionNotifier: PermissionNotifier,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly runOnStart: boolean,
    private readonly configBasePath: string,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.monitorPermissions(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: PermissionMonitor.name,
      },
    )
    this.permissionResolver = new PermissionResolver(
      db,
      this.logger,
      configBasePath,
      (projectId, timestamp) =>
        this.permissionNotifier.notifyPermissionChanges(projectId, timestamp),
    )
  }

  async start() {
    this.logger.info('Started')
    if (this.runOnStart) {
      // Run permission monitoring 1 minute after UpdateMonitor
      this.taskQueue.addToFront(UnixTime.now() - UnixTime.MINUTE)
    }
    return this.clock.onNewHour((timestamp) => {
      // Run permission monitoring shortly after UpdateMonitor (with same 1-minute offset)
      this.taskQueue.addToFront(timestamp - UnixTime.MINUTE)
    })
  }

  async monitorPermissions(timestamp: UnixTime) {
    const monitorStart = UnixTime.now()
    const targetDateIso = UnixTime.toDate(timestamp).toISOString()

    this.logger.info('Permission monitoring started', {
      start: monitorStart,
      timestamp,
      date: targetDateIso,
    })

    // Get all discovered projects
    const allProjects = this.configReader.readAllDiscoveredProjects()

    // Filter to only DeFi projects (those with scanPermissions enabled)
    const defiProjects = allProjects.filter((project) => {
      const config = this.configReader.readConfig(project)
      return config.structure.defidisco?.scanPermissions === true
    })

    this.logger.info('Filtered to DeFi projects for permission monitoring', {
      totalProjects: allProjects.length,
      defiProjects: defiProjects.length,
      projects: defiProjects,
    })

    for (const projectId of defiProjects) {
      try {
        await this.monitorProject(projectId, timestamp)
      } catch (error) {
        this.logger.error('Permission monitoring failed for project', {
          projectId,
          error,
        })
      }
    }

    const monitorEnd = UnixTime.now()
    const duration = monitorEnd - monitorStart

    this.logger.info('Permission monitoring finished', {
      start: monitorStart,
      end: monitorEnd,
      duration,
      timestamp,
      date: targetDateIso,
    })
  }

  private async monitorProject(projectId: string, timestamp: UnixTime) {
    this.logger.info('Monitoring project permissions', {
      projectId,
      timestamp,
    })

    // Get the latest discovery from UpdateMonitor's database
    const latestDiscovery = await this.db.updateMonitor.findLatest(projectId)

    if (!latestDiscovery) {
      this.logger.warn('No discovery found for project', { projectId })
      return
    }

    // Resolve and compare permissions
    await this.permissionResolver.resolveAndCompare(
      projectId,
      latestDiscovery.discovery,
      timestamp,
    )

    this.logger.info('Project permission monitoring completed', { projectId })
  }
}
