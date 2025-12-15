import type { Logger } from '@l2beat/backend-tools'
import type { Database, InteropTransferUpdate } from '@l2beat/database'
import {
  Address32,
  assertUnreachable,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { TimeLoop } from '../../../../tools/TimeLoop'
import { DeployedTokenId } from './DeployedTokenId'

export type TokenInfos = Map<
  string,
  {
    abstractId: string
    symbol: string
    coingeckoId: string
    decimals: number
  }
>

export class InteropFinancialsLoop extends TimeLoop {
  constructor(
    private chains: { name: string; type: 'evm' }[],
    private db: Database,
    private tokenDbClient: TokenDbClient,
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

    const unprocessed = (await this.db.interopTransfer.getUnprocessed()).map(
      (u) => ({
        transfer: u,
        srcId: toDeployedId(this.chains, u.srcChain, u.srcTokenAddress),
        dstId: toDeployedId(this.chains, u.dstChain, u.dstTokenAddress),
      }),
    )

    if (unprocessed.length === 0) {
      this.logger.info('Skipping run, no transfers to process.')
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

    const tokenInfos = await getTokenInfos(
      tokens,
      this.tokenDbClient,
      this.logger,
    )

    const coingeckoIds = unique(
      Array.from(tokenInfos.values())
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
            tokenInfos,
            prices,
            t.srcId,
            t.transfer.srcRawAmount,
            'src',
            update,
          )
        }
        if (t.dstId) {
          this.applyTokenUpdate(
            tokenInfos,
            prices,
            t.dstId,
            t.transfer.dstRawAmount,
            'dst',
            update,
          )
        }
        return { id: t.transfer.transferId, update }
      })

    await this.db.transaction(async () => {
      for (const { id, update } of updates) {
        await this.db.interopTransfer.updateFinancials(id, update)
      }
    })

    this.logger.info('Transfers processed', {
      transfers: updates.length,
      transfersWithUpdatedValue: updates.filter(
        (u) => u.update.srcValueUsd || u.update.dstValueUsd,
      ).length,
    })
  }

  private applyTokenUpdate(
    tokenInfos: TokenInfos,
    prices: Map<string, number | undefined>,
    id: DeployedTokenId,
    rawAmount: bigint | undefined,
    prefix: 'src' | 'dst',
    update: InteropTransferUpdate,
  ) {
    const tokenUpdate = this.generateTokenUpdate(
      tokenInfos,
      prices,
      id,
      rawAmount,
    )
    if (!tokenUpdate) return

    const fieldMapping = {
      abstractTokenId: `${prefix}AbstractTokenId`,
      symbol: `${prefix}Symbol`,
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

  private generateTokenUpdate(
    tokenInfos: TokenInfos,
    prices: Map<string, number | undefined>,
    id: DeployedTokenId,
    rawAmount: bigint | undefined,
  ) {
    const tokenInfo = tokenInfos.get(id)
    if (!tokenInfo) return

    const price = prices.get(tokenInfo.coingeckoId)
    if (price === undefined) {
      this.logger.warn('Missing price data', {
        id,
        coingeckoId: tokenInfo.coingeckoId,
      })
      return
    }

    if (rawAmount === undefined) {
      this.logger.warn('Missing raw amount', { id })
      return
    }

    // This calculation gives us 6 decimal places of precision while not
    // calculating absurd values using basic numbers
    const amount =
      Number((rawAmount * 1_000_000n) / 10n ** BigInt(tokenInfo.decimals)) /
      1_000_000

    return {
      abstractTokenId: tokenInfo.abstractId,
      symbol: tokenInfo.symbol,
      price,
      amount,
      valueUsd: price * amount,
    }
  }
}

export async function getTokenInfos(
  deployedTokens: DeployedTokenId[],
  tokenDbClient: TokenDbClient,
  logger: Logger,
) {
  const result: TokenInfos = new Map()

  const tokens = await tokenDbClient.deployedTokens.getByChainAndAddress.query(
    deployedTokens.map((d) => ({
      chain: DeployedTokenId.chain(d),
      address: DeployedTokenId.address(d),
    })),
  )

  const tokensMap = new Map(
    tokens.map((t) => [
      DeployedTokenId.from(t.deployedToken.chain, t.deployedToken.address),
      t,
    ]),
  )

  for (const d of deployedTokens) {
    const tokenData = tokensMap.get(d)

    if (!tokenData) {
      logger.info('Missing token detected', { deployedTokenId: d })
      continue
    }

    const { deployedToken, abstractToken } = tokenData

    if (!abstractToken) {
      logger.info('Missing abstract token', { deployedTokenId: d })
      continue
    }

    if (!abstractToken.coingeckoId) {
      logger.info('Missing coingeckoId', {
        deployedTokenId: d,
        abstractToken,
      })
      continue
    }

    result.set(d, {
      abstractId: abstractToken.id,
      symbol: deployedToken.symbol,
      coingeckoId: abstractToken.coingeckoId,
      decimals: deployedToken.decimals,
    })
  }

  return result
}

export function toDeployedId(
  chains: { name: string; type: 'evm' }[],
  chain: string | undefined,
  address: string | undefined,
) {
  if (!chain || !address) {
    return
  }

  if (address === 'native') {
    return DeployedTokenId.from(chain, 'native')
  }

  if (address === '0x' || address === Address32.ZERO) {
    return
  }

  const chainConfig = chains.find((c) => c.name === chain)
  if (!chainConfig) return

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
