import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime, unique } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { TimeLoop } from '../../../../tools/TimeLoop'
import { getTokenInfos, toDeployedId } from './InteropFinancialsLoop'

// Aggregate snapshots only read the last day of transfers.
const LOOKBACK = UnixTime.DAY

export class InteropFinancialsReprocessLoop extends TimeLoop {
  constructor(
    private chains: { id: string; type: 'evm' }[],
    private db: Database,
    private tokenDbClient: TokenDbClient,
    protected logger: Logger,
    intervalMs = 30 * 60 * 1000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const since = UnixTime.now() - LOOKBACK
    const tokens = (
      await this.db.interopTransfer.getUnidentifiedTokensSince(since)
    ).flatMap((token) => {
      const id = toDeployedId(this.chains, token.chain, token.address)
      return id ? [{ token, id }] : []
    })
    if (tokens.length === 0) {
      return
    }

    const tokenInfos = await getTokenInfos(
      unique(tokens.map((t) => t.id)),
      this.tokenDbClient,
      Logger.SILENT,
    )
    const identified = tokens
      .filter((t) => tokenInfos.has(t.id))
      .map((t) => t.token)
    if (identified.length === 0) {
      return
    }

    const transfers =
      await this.db.interopTransfer.markUnidentifiedAsUnprocessed(
        identified,
        since,
      )
    this.logger.info('Marked transfers of newly identified tokens', {
      tokens: identified.length,
      transfers,
    })
  }
}
