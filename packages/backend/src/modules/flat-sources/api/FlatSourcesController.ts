import { Database } from '@l2beat/database'
import { ChainConverter, FlatSourcesApiResponse } from '@l2beat/shared-pure'

export class FlatSourcesController {
  constructor(
    private readonly db: Database,
    private readonly chainConverter: ChainConverter,
  ) {}

  async getFlatSources(): Promise<FlatSourcesApiResponse> {
    const flat = await this.db.flatSources.getAll()

    return flat.map((e) => ({
      projectName: e.projectName,
      chainName: this.chainConverter.toName(e.chainId),
      blockNumber: e.blockNumber,
      contentHash: e.contentHash.toString(),
      flat: e.flat,
    }))
  }
}
