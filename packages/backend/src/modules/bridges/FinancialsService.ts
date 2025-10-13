import type { Logger } from '@l2beat/backend-tools'
import type { BridgeTransferUpdate, Database } from '@l2beat/database'
import { UnixTime, unique } from '@l2beat/shared-pure'
import { TimeLoop } from '../../tools/TimeLoop'
import { Address32 } from './plugins/types'
import { type AbstractTokenId, DeployedTokenId, type ITokenDb } from './TokenDb'

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
  if (address === 'native' || address === '0x') {
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
    private tokenDb: ITokenDb,
    protected logger: Logger,
    intervalMs = 10_000,
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
    if (unprocessed.length === 0) {
      this.logger.info('No uprocessed transfers found')
      return
    }
    this.logger.info('Processing transfers', {
      transfers: unprocessed.length,
    })

    const tokens = unique(
      unprocessed
        .flatMap((t) => [t.srcId, t.dstId])
        .filter((x) => x !== undefined),
    )
    const priceInfos = await this.tokenDb.getPriceInfo(tokens)

    const coingeckoIds = unique(
      Array.from(priceInfos.values())
        .map((t) => t.coingeckoId)
        .filter((u) => u !== undefined),
    )

    const prices = await this.db.interopRecentPrices.getClosestPrices(
      coingeckoIds,
      UnixTime.now(),
      UnixTime.DAY,
    )

    function getUpdate(
      plugin: string,
      id: DeployedTokenId,
      rawAmount: string | undefined,
      logger: Logger,
    ) {
      let abstractTokenId: AbstractTokenId | undefined
      let price: number | undefined
      let amount: number | undefined
      let valueUsd: number | undefined
      const priceInfo = priceInfos.get(id)
      if (priceInfo) {
        abstractTokenId = priceInfo.abstractId
      } else {
        logger.warn('Missing price info', {
          plugin,
          id,
          chain: DeployedTokenId.chain(id),
          token: DeployedTokenId.address(id),
        })
      }
      if (priceInfo?.coingeckoId) {
        price = prices.get(priceInfo.coingeckoId)
      }
      if (rawAmount && priceInfo) {
        // This calculation gives us 6 decimal places of precision while not
        // calculating absurd values using basic numbers
        amount =
          Number(
            (BigInt(rawAmount) * 1_000_000n) /
              10n ** BigInt(priceInfo.decimals),
          ) / 1_000_000
      }
      if (price !== undefined && amount !== undefined) {
        valueUsd = price * amount
        logger.info('Value updated', { id, valueUsd })
      }
      return { abstractTokenId, price, amount, valueUsd }
    }

    const updates: { id: string; update: BridgeTransferUpdate }[] =
      unprocessed.map((t) => {
        const update: BridgeTransferUpdate = {}
        if (t.srcId) {
          const srcUpdate = getUpdate(
            t.transfer.plugin,
            t.srcId,
            t.transfer.srcRawAmount,
            this.logger,
          )
          update.srcAbstractTokenId = srcUpdate.abstractTokenId
          update.srcAmount = srcUpdate.amount
          update.srcPrice = srcUpdate.price
          update.srcValueUsd = srcUpdate.valueUsd
        }
        if (t.dstId) {
          const dstUpdate = getUpdate(
            t.transfer.plugin,
            t.dstId,
            t.transfer.dstRawAmount,
            this.logger,
          )
          update.dstAbstractTokenId = dstUpdate.abstractTokenId
          update.dstAmount = dstUpdate.amount
          update.dstPrice = dstUpdate.price
          update.dstValueUsd = dstUpdate.valueUsd
        }
        return { id: t.transfer.messageId, update }
      })

    this.logger.info('Transfers processed', {
      transfers: updates.length,
    })

    await this.db.transaction(async () => {
      await Promise.all(
        updates.map((u) =>
          this.db.bridgeTransfer.updateFinancials(u.id, u.update),
        ),
      )
    })
    this.logger.info('Updated transfers saved in DB', {
      transfers: updates.length,
    })
  }
}
