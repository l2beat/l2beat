import type { Database } from '@l2beat/database'
import {
  assert,
  type FlatSourcesApiEntry,
  type FlatSourcesApiHeader,
} from '@l2beat/shared-pure'

export class FlatSourcesController {
  constructor(private readonly db: Database) {}

  async *streamFlatSources(): AsyncGenerator<string> {
    const projectIds = await this.db.flatSources.getProjectIds()
    const header: FlatSourcesApiHeader = { projectCount: projectIds.length }
    yield `${JSON.stringify(header)}\n`
    for (const projectId of projectIds) {
      const record = await this.db.flatSources.get(projectId)
      assert(record !== undefined, `Flat sources of ${projectId} vanished`)
      const entry: FlatSourcesApiEntry = {
        ...record,
        contentHash: record.contentHash.toString(),
      }
      yield `${JSON.stringify(entry)}\n`
    }
  }
}
