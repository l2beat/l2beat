import type { Logger } from '@l2beat/backend-tools'
import type { Database, InteropTransferUpdate } from '@l2beat/database'
import { assertUnreachable, UnixTime, unique } from '@l2beat/shared-pure'
import { TimeLoop } from '../../../../tools/TimeLoop'
import { Address32 } from '../../plugins/types'
import { DeployedTokenId, type ITokenDb, type PriceInfo } from './TokenDb'

export class InteropFinancialsLoop extends TimeLoop {
  constructor(
    private chains: { name: string; type: 'evm' }[],
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
    const unprocessed = (await this.db.interopTransfer.getUnprocessed()).map(
      (u) => ({
        transfer: u,
        srcId: this.toDeployedId(u.srcChain, u.srcTokenAddress),
        dstId: this.toDeployedId(u.dstChain, u.dstTokenAddress),
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

    const updates: { id: string; update: InteropTransferUpdate }[] =
      unprocessed.map((t) => {
        const update: InteropTransferUpdate = {}
        if (t.srcId) {
          this.applyTokenUpdate(
            update,
            t.transfer.plugin,
            t.srcId,
            t.transfer.srcRawAmount,
            priceInfos,
            prices,
            'src',
          )
        }
        if (t.dstId) {
          this.applyTokenUpdate(
            update,
            t.transfer.plugin,
            t.dstId,
            t.transfer.dstRawAmount,
            priceInfos,
            prices,
            'dst',
          )
        }
        return { id: t.transfer.messageId, update }
      })

    await this.db.transaction(async () => {
      await Promise.all(
        updates.map((u) =>
          this.db.interopTransfer.updateFinancials(u.id, u.update),
        ),
      )
    })

    this.logger.info('Transfers processed', {
      transfers: updates.length,
      transfersWithUpdatedValue: updates.filter(
        (u) => u.update.srcValueUsd || u.update.dstValueUsd,
      ).length,
    })
  }

  private applyTokenUpdate(
    update: InteropTransferUpdate,
    plugin: string,
    id: DeployedTokenId,
    rawAmount: bigint | undefined,
    priceInfos: PriceInfo,
    prices: Map<string, number | undefined>,
    prefix: 'src' | 'dst',
  ) {
    const tokenUpdate = this.calculateTokenUpdate(
      plugin,
      id,
      rawAmount,
      priceInfos,
      prices,
    )

    if (!tokenUpdate) return

    const fieldMapping = {
      abstractTokenId: `${prefix}AbstractTokenId`,
      price: `${prefix}Price`,
      amount: `${prefix}Amount`,
      valueUsd: `${prefix}ValueUsd`,
    } as const

    Object.entries(tokenUpdate).forEach(([key, value]) => {
      if (value !== undefined) {
        const updateKey = fieldMapping[key as keyof typeof fieldMapping]
        // biome-ignore lint/suspicious/noExplicitAny: generic type
        ;(update as any)[updateKey] = value
      }
    })
  }

  private calculateTokenUpdate(
    plugin: string,
    id: DeployedTokenId,
    rawAmount: bigint | undefined,
    priceInfos: PriceInfo,
    prices: Map<string, number | undefined>,
  ) {
    const priceInfo = priceInfos.get(id)
    if (!priceInfo) {
      this.logger.warn('Missing price info', {
        plugin,
        id,
        chain: DeployedTokenId.chain(id),
        token: DeployedTokenId.address(id),
      })
      return
    }

    const price = prices.get(priceInfo.coingeckoId)
    if (price === undefined) {
      this.logger.warn('Missing price data', {
        plugin,
        id,
        coingeckoId: priceInfo.coingeckoId,
      })
      return
    }

    if (!rawAmount) {
      this.logger.warn('Missing raw amount', {
        plugin,
        id,
        rawAmount,
      })
      return
    }

    // This calculation gives us 6 decimal places of precision while not
    // calculating absurd values using basic numbers
    const amount =
      Number((rawAmount * 1_000_000n) / 10n ** BigInt(priceInfo.decimals)) /
      1_000_000

    const valueUsd = price * amount

    this.logger.info('Token value calculated', {
      plugin,
      id,
      amount,
      price,
      valueUsd,
    })

    return {
      abstractTokenId: priceInfo.abstractId,
      price,
      amount,
      valueUsd,
    }
  }

  toDeployedId(chain: string | undefined, address: string | undefined) {
    if (!chain || !address) {
      return
    }

    if (address === 'native') {
      return DeployedTokenId.from(chain, 'native')
    }

    if (
      address === 'native' ||
      address === '0x' ||
      address === Address32.ZERO
    ) {
      return
    }
    const chainConfig = this.chains.find((c) => c.name === chain)
    if (!chainConfig) {
      return
    }

    switch (chainConfig.type) {
      case 'evm':
        return DeployedTokenId.from(
          chain,
          Address32.cropToEthereumAddress(Address32(address)),
        )
      default:
        assertUnreachable(chainConfig.type)
    }
  }
}
