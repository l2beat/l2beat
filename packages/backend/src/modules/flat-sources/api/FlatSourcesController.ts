import type { Database } from '@l2beat/database'
import type {
  ChainConverter,
  FlatSourcesApiResponse,
} from '@l2beat/shared-pure'

export class FlatSourcesController {
  constructor(
    private readonly db: Database,
    private readonly chainConverter: ChainConverter,
  ) {}

  async getFlatSources(): Promise<FlatSourcesApiResponse> {
    const flat = await this.db.flatSources.getAll()

    return flat.map((e) => ({
      ...e,
      chainName: this.chainConverter.toName(e.chainId),
      contentHash: e.contentHash.toString(),
    }))
  }
}
