import type { Database } from '@l2beat/database'
import type { FlatSourcesApiResponse } from '@l2beat/shared-pure'

export class FlatSourcesController {
  constructor(private readonly db: Database) {}

  async getFlatSources(): Promise<FlatSourcesApiResponse> {
    const flat = await this.db.flatSources.getAll()

    return flat.map((e) => ({
      ...e,
      contentHash: e.contentHash.toString(),
    }))
  }
}
