import type { Database, FlatSourcesJsonRecord } from '@l2beat/database'
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
      const record = await this.db.flatSources.getJson(projectId)
      assert(record !== undefined, `Flat sources of ${projectId} vanished`)
      yield toEntryLine(record)
    }
  }
}

function toEntryLine(record: FlatSourcesJsonRecord): string {
  const entryWithoutFlat: Omit<FlatSourcesApiEntry, 'flat'> = {
    projectId: record.projectId,
    timestamp: record.timestamp,
    contentHash: record.contentHash.toString(),
  }
  const head = JSON.stringify(entryWithoutFlat)
  assert(head.endsWith('}'))
  assert(record.flatJson.startsWith('{'))
  return `${head.slice(0, -1)},"flat":${record.flatJson}}\n`
}
