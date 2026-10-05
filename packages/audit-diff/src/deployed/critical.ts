import { ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { existsSync } from 'fs'
import path from 'path'

/**
 * Critical contracts of projects with ossification configured, read from the
 * config database. Their perimeter is the current critical set: contracts
 * whose critical window has ended are already excluded.
 */
export class CriticalContracts {
  private readonly ps: ProjectService

  constructor(projectsDir: string) {
    const dbPath = path.resolve(projectsDir, '..', '..', 'build', 'db.sqlite')
    if (!existsSync(dbPath)) {
      throw new Error(
        `config database not found at ${dbPath}; run \`pnpm --filter @l2beat/config build\` first`,
      )
    }
    this.ps = new ProjectService(dbPath)
  }

  /** Chain specific addresses, or undefined without ossification. */
  async get(projectId: string): Promise<string[] | undefined> {
    const project = await this.ps.getProject({
      id: ProjectId(projectId),
      optional: ['ossificationHistory'],
    })
    return project?.ossificationHistory?.contracts.map((c) => c.address)
  }
}
