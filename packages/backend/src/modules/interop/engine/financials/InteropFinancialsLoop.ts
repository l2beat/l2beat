import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropTransferRecord,
  InteropTransferUpdate,
} from '@l2beat/database'
import {
  Address32,
  assert,
  assertUnreachable,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { TimeLoop } from '../../../../tools/TimeLoop'
import type {
  InteropTransferAnalyzer,
  InteropTransferAnalyzerRecord,
} from '../InteropTransferAnalyzer'
import type {
  InteropNotifier,
  InteropSkippedTransferValuationNotification,
} from '../notifications/InteropNotifier'
import { DeployedTokenId } from './DeployedTokenId'

export type TokenInfos = Map<
  string,
  {
    abstractId: string
    symbol: string
    coingeckoId: string
    decimals: number
    isPriceUnreliable: boolean
  }
>

const DEFAULT_BATCH_SIZE = 10_000

interface InteropFinancialsLoopOptions {
  analyzer?: InteropTransferAnalyzer
  intervalMs?: number
  notifier?: InteropNotifier
  maxTokenPriceUsd?: number
  maxTransferValueUsd?: number
  batchSize?: number
}

interface GeneratedTokenUpdate {
  abstractTokenId: string
  symbol: string
  price?: number
  amount: number
  valueUsd?: number
  skippedValuation?: Omit<
    InteropSkippedTransferValuationNotification,
    | 'plugin'
    | 'type'
    | 'transferId'
    | 'srcChain'
    | 'dstChain'
    | 'side'
    | 'symbol'
  >
}

export class InteropFinancialsLoop extends TimeLoop {
  private readonly analyzer: InteropTransferAnalyzer | undefined
  private readonly notifier: InteropNotifier | undefined
  private readonly maxTokenPriceUsd: number
  private readonly maxTransferValueUsd: number
  private readonly batchSize: number

  constructor(
    private chains: { id: string; type: 'evm' }[],
    private db: Database,
    private tokenDbClient: TokenDbClient,
    protected logger: Logger,
    options: InteropFinancialsLoopOptions = {},
  ) {
    super({ intervalMs: options.intervalMs ?? 10_000 })
    this.logger = logger.for(this)
    this.analyzer = options.analyzer
    this.notifier = options.notifier
    this.maxTokenPriceUsd = options.maxTokenPriceUsd ?? Number.POSITIVE_INFINITY
    this.maxTransferValueUsd =
      options.maxTransferValueUsd ?? Number.POSITIVE_INFINITY
    this.batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE
    assert(this.batchSize > 0, 'batch size must be positive')
  }

  async run() {
    const hasAnyPrices = await this.db.interopRecentPrices.hasAnyPrices()
    if (!hasAnyPrices) {
      this.logger.debug('Skipping run. No prices found.')
      return
    }

    let processed = 0
    do {
      processed = await this.processBatch()
    } while (processed === this.batchSize)
  }

  private async processBatch(): Promise<number> {
    const unprocessed = (
      await this.db.interopTransfer.getUnprocessed(this.batchSize)
    ).map((u) => ({
      transfer: u,
      srcId: toDeployedId(this.chains, u.srcChain, u.srcTokenAddress),
      dstId: toDeployedId(this.chains, u.dstChain, u.dstTokenAddress),
    }))

    if (unprocessed.length === 0) {
      this.logger.debug('Skipping run, no transfers to process.')
      return 0
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

    const skippedValuations: InteropSkippedTransferValuationNotification[] = []

    const updates = unprocessed.map((t) => {
      const update: InteropTransferUpdate = getEmptyFinancialUpdate()
      if (t.srcId) {
        const skipped = this.applyTokenUpdate(
          tokenInfos,
          prices,
          t.srcId,
          t.transfer.srcRawAmount,
          t.transfer.srcTime ?? t.transfer.timestamp,
          t.transfer,
          'src',
          update,
        )
        if (skipped) {
          skippedValuations.push(skipped)
        }
      }
      if (t.dstId) {
        const skipped = this.applyTokenUpdate(
          tokenInfos,
          prices,
          t.dstId,
          t.transfer.dstRawAmount,
          t.transfer.dstTime ?? t.transfer.timestamp,
          t.transfer,
          'dst',
          update,
        )
        if (skipped) {
          skippedValuations.push(skipped)
        }
      }
      return {
        id: t.transfer.transferId,
        update,
        transfer: toAnalyzerRecord(t.transfer, update),
      }
    })

    const processedAt = UnixTime.now()

    await this.db.interopTransfer.updateManyFinancials(
      updates.map(({ id, update }) => ({ id, update })),
    )

    this.notifier?.notifySkippedTransferValuations(
      processedAt,
      skippedValuations,
    )

    this.logger.info('Transfers processed', {
      transfers: updates.length,
      transfersWithUpdatedValue: updates.filter(
        (u) => u.update.srcValueUsd !== null || u.update.dstValueUsd !== null,
      ).length,
    })

    const processedTransfers = updates.map((update) => update.transfer)
    if (this.analyzer) {
      this.analyzer.handleProcessedTransfers(processedTransfers, processedAt)
    }

    return unprocessed.length
  }

  private applyTokenUpdate(
    tokenInfos: TokenInfos,
    prices: Map<string, number | undefined>,
    id: DeployedTokenId,
    rawAmount: bigint | undefined,
    priceTimestamp: UnixTime,
    transfer: Pick<
      InteropTransferRecord,
      'plugin' | 'type' | 'transferId' | 'srcChain' | 'dstChain'
    >,
    prefix: 'src' | 'dst',
    update: InteropTransferUpdate,
  ): InteropSkippedTransferValuationNotification | undefined {
    const tokenUpdate = this.generateTokenUpdate(
      tokenInfos,
      prices,
      id,
      rawAmount,
      priceTimestamp,
    )
    if (!tokenUpdate) return undefined

    const fieldMapping = {
      abstractTokenId: `${prefix}AbstractTokenId`,
      symbol: `${prefix}Symbol`,
      price: `${prefix}Price`,
      amount: `${prefix}Amount`,
      valueUsd: `${prefix}ValueUsd`,
    } as const

    const { skippedValuation, ...financialFields } = tokenUpdate

    Object.entries(financialFields).forEach(([key, value]) => {
      const updateKey = fieldMapping[key as keyof typeof fieldMapping]
      // biome-ignore lint/suspicious/noExplicitAny: generic type
      ;(update as any)[updateKey] = value
    })

    if (!skippedValuation) {
      return undefined
    }

    return {
      plugin: transfer.plugin,
      type: transfer.type,
      transferId: transfer.transferId,
      srcChain: transfer.srcChain,
      dstChain: transfer.dstChain,
      side: prefix,
      symbol: tokenUpdate.symbol,
      ...skippedValuation,
    }
  }

  private generateTokenUpdate(
    tokenInfos: TokenInfos,
    prices: Map<string, number | undefined>,
    id: DeployedTokenId,
    rawAmount: bigint | undefined,
    priceTimestamp: UnixTime,
  ): GeneratedTokenUpdate | undefined {
    const tokenInfo = tokenInfos.get(id)
    if (!tokenInfo) return

    if (rawAmount === undefined) {
      this.logger.warn('Missing raw amount', { id })
      return
    }

    const amount = calculateAmount(rawAmount, tokenInfo.decimals)

    if (tokenInfo.isPriceUnreliable) {
      return {
        abstractTokenId: tokenInfo.abstractId,
        symbol: tokenInfo.symbol,
        amount,
      }
    }

    const price = prices.get(tokenInfo.coingeckoId)
    if (price === undefined) {
      this.logger.warn('Missing price data', {
        id,
        coingeckoId: tokenInfo.coingeckoId,
        priceTimestamp,
      })
      return
    }

    if (price > this.maxTokenPriceUsd) {
      return {
        abstractTokenId: tokenInfo.abstractId,
        symbol: tokenInfo.symbol,
        price,
        amount,
        skippedValuation: {
          coingeckoId: tokenInfo.coingeckoId,
          priceUsd: price,
          amount,
          valueUsd: undefined,
          reason: 'priceAboveThreshold',
          thresholdUsd: this.maxTokenPriceUsd,
        },
      }
    }

    const valueUsd = price * amount
    if (valueUsd > this.maxTransferValueUsd) {
      return {
        abstractTokenId: tokenInfo.abstractId,
        symbol: tokenInfo.symbol,
        price,
        amount,
        skippedValuation: {
          coingeckoId: tokenInfo.coingeckoId,
          priceUsd: price,
          amount,
          valueUsd,
          reason: 'valueAboveThreshold',
          thresholdUsd: this.maxTransferValueUsd,
        },
      }
    }

    return {
      abstractTokenId: tokenInfo.abstractId,
      symbol: tokenInfo.symbol,
      price,
      amount,
      valueUsd,
    }
  }
}

function calculateAmount(rawAmount: bigint, decimals: number): number {
  // This calculation gives us 6 decimal places of precision while not
  // calculating absurd values using basic numbers
  return Number((rawAmount * 1_000_000n) / 10n ** BigInt(decimals)) / 1_000_000
}

function getEmptyFinancialUpdate(): InteropTransferUpdate {
  return {
    srcAbstractTokenId: null,
    srcSymbol: null,
    srcPrice: null,
    srcAmount: null,
    srcValueUsd: null,
    dstAbstractTokenId: null,
    dstSymbol: null,
    dstPrice: null,
    dstAmount: null,
    dstValueUsd: null,
  }
}

function toAnalyzerRecord(
  transfer: InteropTransferRecord,
  update: InteropTransferUpdate,
): InteropTransferAnalyzerRecord {
  return {
    plugin: transfer.plugin,
    type: transfer.type,
    transferId: transfer.transferId,
    timestamp: transfer.timestamp,
    srcChain: transfer.srcChain,
    srcTxHash: transfer.srcTxHash,
    srcTokenAddress: transfer.srcTokenAddress,
    srcSymbol: update.srcSymbol ?? undefined,
    srcValueUsd: update.srcValueUsd ?? undefined,
    dstChain: transfer.dstChain,
    dstTxHash: transfer.dstTxHash,
    dstTokenAddress: transfer.dstTokenAddress,
    dstSymbol: update.dstSymbol ?? undefined,
    dstValueUsd: update.dstValueUsd ?? undefined,
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
      isPriceUnreliable: abstractToken.isPriceUnreliable,
    })
  }

  return result
}

export function toDeployedId(
  chains: readonly { id: string; type: 'evm' }[],
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

  const chainConfig = chains.find((c) => c.id === chain)
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
