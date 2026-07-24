import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropRecentPriceRequest,
  InteropTransferRecord,
  InteropTransferUpdate,
} from '@l2beat/database'
import {
  Address32,
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

interface InteropFinancialsLoopOptions {
  analyzer?: InteropTransferAnalyzer
  intervalMs?: number
  notifier?: InteropNotifier
  maxTokenPriceUsd?: number
  maxTransferValueUsd?: number
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
  }

  async run() {
    const unprocessed = (await this.db.interopTransfer.getUnprocessed()).map(
      (u) => ({
        transfer: u,
        srcId: toDeployedId(this.chains, u.srcChain, u.srcTokenAddress),
        dstId: toDeployedId(this.chains, u.dstChain, u.dstTokenAddress),
      }),
    )

    if (unprocessed.length === 0) {
      this.logger.debug('Skipping run, no transfers to process.')
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

    const { requests, getRequestId } = createPriceRequests(tokenInfos)
    const transfersWithPriceRequests = unprocessed.map((transfer) => ({
      ...transfer,
      srcPriceRequestId: transfer.srcId
        ? getRequestId(
            transfer.srcId,
            transfer.transfer.srcTime ?? transfer.transfer.timestamp,
          )
        : undefined,
      dstPriceRequestId: transfer.dstId
        ? getRequestId(
            transfer.dstId,
            transfer.transfer.dstTime ?? transfer.transfer.timestamp,
          )
        : undefined,
    }))

    const prices = await this.db.interopRecentPrices.getClosestPricesAtOrBefore(
      requests,
      UnixTime.DAY,
    )

    const skippedValuations: InteropSkippedTransferValuationNotification[] = []

    const updates = transfersWithPriceRequests.map((t) => {
      const update: InteropTransferUpdate = getEmptyFinancialUpdate()
      if (t.srcId) {
        const skipped = this.applyTokenUpdate(
          tokenInfos,
          prices,
          t.srcPriceRequestId,
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
          t.dstPriceRequestId,
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

    await this.db.transaction(async () => {
      for (const { id, update } of updates) {
        await this.db.interopTransfer.updateFinancials(id, update)
      }
    })

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
  }

  private applyTokenUpdate(
    tokenInfos: TokenInfos,
    prices: Map<number, number | undefined>,
    priceRequestId: number | undefined,
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
      priceRequestId,
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
    prices: Map<number, number | undefined>,
    priceRequestId: number | undefined,
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

    const price =
      priceRequestId === undefined ? undefined : prices.get(priceRequestId)
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

function createPriceRequests(tokenInfos: TokenInfos) {
  const requests: InteropRecentPriceRequest[] = []
  const requestIdsByCoinAndTimestamp = new Map<string, Map<UnixTime, number>>()

  function getRequestId(
    deployedTokenId: DeployedTokenId,
    timestamp: UnixTime,
  ): number | undefined {
    const tokenInfo = tokenInfos.get(deployedTokenId)
    if (!tokenInfo || tokenInfo.isPriceUnreliable) {
      return undefined
    }

    let requestIdsByTimestamp = requestIdsByCoinAndTimestamp.get(
      tokenInfo.coingeckoId,
    )
    if (!requestIdsByTimestamp) {
      requestIdsByTimestamp = new Map()
      requestIdsByCoinAndTimestamp.set(
        tokenInfo.coingeckoId,
        requestIdsByTimestamp,
      )
    }

    const existingRequestId = requestIdsByTimestamp.get(timestamp)
    if (existingRequestId !== undefined) {
      return existingRequestId
    }

    const requestId = requests.length
    requests.push({
      requestId,
      coingeckoId: tokenInfo.coingeckoId,
      timestamp,
    })
    requestIdsByTimestamp.set(timestamp, requestId)
    return requestId
  }

  return { requests, getRequestId }
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
