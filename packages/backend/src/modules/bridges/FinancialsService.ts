import type { Logger } from '@l2beat/backend-tools'
import type { BridgeTransferRecord, Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../tools/TimeLoop'
import { DeployedTokenId, type MockTokenDb } from './TokenDb'

interface OutboundTransfer {
  srcAbstractTokenId: string
  srcAmount: number
  srcPrice: number
  srcValueUsd: number
}

interface InboundTransfer {
  dstAbstractTokenId: string
  dstAmount: number
  dstPrice: number
  dstValueUsd: number
}

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

    // TODO: consider adding index to isProcessed
    const unprocessedTransfers = await this.db.bridgeTransfer.getUnprocessed()

    const tokensFromTransfers = unprocessedTransfers
      .flatMap((u) => [
        { chain: u.srcChain, address: u.srcTokenAddress },
        { chain: u.dstChain, address: u.dstTokenAddress },
      ])
      .filter((u) => u.chain && u.address)
      .map(({ chain, address }) => {
        assert(chain && address)
        return DeployedTokenId.from(chain, address)
      })

    const priceInfo = await this.tokenDb.getPriceInfo(tokensFromTransfers)

    const coingeckoIds = Array.from(priceInfo.values())
      .map((t) => t.coingeckoId)
      .filter((u) => u !== undefined)

    const prices = await this.db.interopRecentPrices.getClosestPrices(
      coingeckoIds,
      UnixTime.now(),
      UnixTime.DAY,
    )

    const updatedTransfers: BridgeTransferRecord[] = []

    for (const transfer of unprocessedTransfers) {
      const outbound: OutboundTransfer | undefined
      const inbound: InboundTransfer | undefined

      // TODO: figure out inbound and outbound

      if (outbound === undefined && inbound === undefined) {
        continue
      }
      updatedTransfers.push({ ...transfer, ...outbound, ...inbound })
    }

    await this.db.transaction(async () => {
      await this.db.bridgeTransfer.updateIsProcessed(
        unprocessedTransfers.map((u) => u.messageId),
      )
      // TODO: update transfers
    })
  }
}
