import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../tools/TimeLoop'
import { DeployedTokenId, type MockTokenDb } from './TokenDb'

export class FinancialsService extends TimeLoop {
  constructor(
    private db: Database,
    private tokenDb: MockTokenDb,
    protected logger: Logger,
    intervalMs = 20 * 60 * 1000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const hasAnyPrices = await this.db.interopRecentPrices.hasAnyPrices()
    if (!hasAnyPrices) {
      this.logger.info('Skipping run. No prices found.')
      return
    }

    // TODO: change to unprocessed
    const unprocessedTransfers = await this.db.bridgeTransfer.getAll()

    const aaa = unprocessedTransfers
      .flatMap((u) => [
        { chain: u.srcChain, address: u.srcTokenAddress },
        { chain: u.dstChain, address: u.dstTokenAddress },
      ])
      .filter((u) => u.chain && u.address)
      .map(({ chain, address }) => {
        assert(chain && address)
        return DeployedTokenId.from(chain, address)
      })

    const priceInfo = await this.tokenDb.getPriceInfo(aaa)

    const coingeckoIds = Array.from(priceInfo.values())
      .map((t) => t.coingeckoId)
      .filter((u) => u !== undefined)

    const timestamp = UnixTime.now()
    const prices = await this.db.interopRecentPrices.getClosestPrices(
      coingeckoIds,
      timestamp,
      UnixTime.DAY,
    )
  }
}
