import { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ICache } from './Cache'
import { ProjectService } from './ProjectService'

export interface ActivityProject {
  id: ProjectId
  name: string
  currentTps: number
  maxTps: number
}

export interface IActivityService {
  getActivityProjects(): Promise<ActivityProject[]>
}

const SECONDS_IN_DAY = 24 * 60 * 60

export class ActivityService implements IActivityService {
  constructor(
    private db: Database,
    private cache: ICache,
    private projectService: ProjectService,
  ) {}

  async getActivityProjects(): Promise<ActivityProject[]> {
    const cacheKey = 'ActivityService/getActivityProjects/v1'
    const cached = await this.cache.get<ActivityProject[]>(cacheKey)
    if (cached) {
      return cached
    }
    const projects = await this.getActivityProjectsUncached()
    void this.cache.set(cacheKey, projects, { expireInSeconds: 60 * 10 })
    return projects
  }

  async getActivityProjectsUncached(): Promise<ActivityProject[]> {
    const projects = await this.projectService.getScalingProjects()
    const end = UnixTime.now().toStartOf('day')
    const range = { start: end.add(-30, 'days'), end: end.add(-1, 'seconds') }

    const [records, maxCounts] = await Promise.all([
      this.db.activity.getByProjectsAndTimeRange(
        [ProjectId.ETHEREUM, ...projects.map((x) => x.id)],
        [range.start, range.end],
      ),
      this.db.activity.getMaxCountsForProjects(),
    ])

    const projectMap = new Map<ProjectId, ActivityProject>()
    for (let i = records.length - 1; i >= 0; i--) {
      // biome-ignore lint/style/noNonNullAssertion: It's there
      const record = records[i]!
      const project = projectMap.get(record.projectId)
      if (!project) {
        const name = projects.find((x) => x.id === record.projectId)?.name
        if (!name) {
          continue
        }
        projectMap.set(record.projectId, {
          id: record.projectId,
          name,
          currentTps: record.count / SECONDS_IN_DAY,
          maxTps: record.count / SECONDS_IN_DAY,
        })
      }
    }
    for (const [id, project] of projectMap) {
      const record = maxCounts[id]
      if (!record) {
        continue // TODO: throw?
      }
      project.maxTps = record.count / SECONDS_IN_DAY
    }

    return [...projectMap.values()].sort((a, b) => b.currentTps - a.currentTps)
  }
}

export class MockActivityService implements IActivityService {
  constructor(private projectService: ProjectService) {}

  async getActivityProjects(): Promise<ActivityProject[]> {
    const projects = await this.projectService.getScalingProjects()
    return projects
      .map((project) => ({
        id: project.id,
        name: project.name,
        currentTps: Math.floor(Math.random() * 100),
        maxTps: Math.floor(Math.random() * 200),
      }))
      .sort((a, b) => b.currentTps - a.currentTps)
  }
}
