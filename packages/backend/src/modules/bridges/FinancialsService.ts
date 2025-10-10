import type { Logger } from '@l2beat/backend-tools'
import type { BridgeTransferUpdate, Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../tools/TimeLoop'
import { Address32 } from './plugins/types'
import {
  type AbstractTokenId,
  DeployedTokenId,
  type MockTokenDb,
} from './TokenDb'

const chainToAddressFormat: Record<
  string,
  ((a: Address32) => string) | undefined
> = {
  ethereum: Address32.cropToEthereumAddress,
  base: Address32.cropToEthereumAddress,
  arbitrum: Address32.cropToEthereumAddress,
}

function toDeployedId(chain: string | undefined, address: string | undefined) {
  if (!chain || !address) {
    return
  }
  const format = chainToAddressFormat[chain]
  if (!format) {
    return
  }
  return DeployedTokenId.from(chain, format(Address32(address)))
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
    const unprocessed = (await this.db.bridgeTransfer.getUnprocessed()).map(
      (u) => ({
        transfer: u,
        srcId: toDeployedId(u.srcChain, u.srcTokenAddress),
        dstId: toDeployedId(u.dstChain, u.dstTokenAddress),
      }),
    )

    const tokens = Array.from(
      new Set(
        unprocessed
          .flatMap((t) => [t.srcId, t.dstId])
          .filter((x) => x !== undefined),
      ),
    )
    const priceInfos = await this.tokenDb.getPriceInfo(tokens)

    const coingeckoIds = Array.from(
      new Set(
        Array.from(priceInfos.values())
          .map((t) => t.coingeckoId)
          .filter((u) => u !== undefined),
      ),
    )

    const prices = await this.db.interopRecentPrices.getClosestPrices(
      coingeckoIds,
      UnixTime.now(),
      UnixTime.DAY,
    )

    const tokenIdToPrice = new Map<DeployedTokenId, number>()
    for (const token of tokens) {
      const coingeckoId = priceInfos.get(token)?.coingeckoId
      const price = coingeckoId ? prices.get(coingeckoId) : undefined
      if (price !== undefined) {
        tokenIdToPrice.set(token, price)
      }
    }

    function getUpdate(id: DeployedTokenId, rawAmount: string | undefined) {
      let abstractTokenId: AbstractTokenId | undefined
      let price: number | undefined
      let amount: number | undefined
      let valueUsd: number | undefined
      const priceInfo = priceInfos.get(id)
      if (priceInfo) {
        abstractTokenId = priceInfo.abstractId
      }
      if (priceInfo?.coingeckoId) {
        price = prices.get(priceInfo.coingeckoId)
      }
      if (rawAmount && priceInfo) {
        // TODO: priceInfo needs decimals
        amount = 1
      }
      if (price !== undefined && amount !== undefined) {
        valueUsd = price * amount
      }
      return { abstractTokenId, price, amount, valueUsd }
    }

    const updates: { id: string; update: BridgeTransferUpdate }[] =
      unprocessed.map((t) => {
        const update: BridgeTransferUpdate = {}
        if (t.srcId) {
          const srcUpdate = getUpdate(t.srcId, t.transfer.srcRawAmount)
          update.srcAbstractTokenId = srcUpdate.abstractTokenId
          update.srcAmount = srcUpdate.amount
          update.srcPrice = srcUpdate.price
          update.srcValueUsd = srcUpdate.valueUsd
        }
        if (t.dstId) {
          const dstUpdate = getUpdate(t.dstId, t.transfer.dstRawAmount)
          update.dstAbstractTokenId = dstUpdate.abstractTokenId
          update.dstAmount = dstUpdate.amount
          update.dstPrice = dstUpdate.price
          update.dstValueUsd = dstUpdate.valueUsd
        }
        return { id: t.transfer.messageId, update }
      })

    await this.db.transaction(async () => {
      await Promise.all(
        updates.map((u) =>
          this.db.bridgeTransfer.updateFinancials(u.id, u.update),
        ),
      )
    })
  }
}
