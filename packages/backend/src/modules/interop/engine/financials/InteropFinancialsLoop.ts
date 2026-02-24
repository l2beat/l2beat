import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
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
import { DeployedTokenId } from './DeployedTokenId'

const PRICE_ERROR_MARGIN = UnixTime.DAY

interface TokenInfo {
  abstractId: string
  symbol: string
  coingeckoId: string
  decimals: number
}

export type TokenInfos = Map<DeployedTokenId, TokenInfo>

interface TransferWithResolvedIds {
  transfer: InteropTransferRecord
  srcId: DeployedTokenId | undefined
  dstId: DeployedTokenId | undefined
}

interface TokenUpdate {
  abstractTokenId: string
  symbol: string
  price: number
  amount: number
  valueUsd: number
}

type SidePrefix = 'src' | 'dst'

type SideToProcess = {
  transferId: string
  side: SidePrefix
  timestamp: UnixTime
  priceKey: SidePriceKey
  coingeckoId: string
  abstractTokenId: string
  rawAmount: bigint
  decimals: number
  symbol: string
}

type SidePriceKey = string & { readonly __brand: 'SidePriceKey' }
type PriceMap = Map<SidePriceKey, number | undefined>

export class InteropFinancialsLoop extends TimeLoop {
  constructor(
    private chains: { id: string; type: 'evm' }[],
    private db: Database,
    private tokenDbClient: TokenDbClient,
    protected logger: Logger,
    intervalMs = 60_000,
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

    const rawTransfersToProcess =
      await this.db.interopTransfer.getWithMissingFinancials()

    if (rawTransfersToProcess.length === 0) {
      this.logger.info('Skipping run, no transfers to process.')
      return
    }

    const resolveIds = createIdResolver(this.chains)
    const transfersWithTokenIds = rawTransfersToProcess.map(resolveIds)
    const tokenIds = getUniqueTokenIds(transfersWithTokenIds)

    const tokenInfos = await getTokenInfos(
      tokenIds,
      this.tokenDbClient,
      this.logger,
    )

    const sidesToProcess = prepareTransferSides(
      transfersWithTokenIds,
      tokenInfos,
    )

    if (sidesToProcess.length === 0) {
      this.logger.info('Skipping run, no processable transfer sides.')
      return
    }

    const prices = await this.getPrices(sidesToProcess)
    let missingPriceSides = 0
    const updatesByTransfer = new Map<string, InteropTransferUpdate>()

    for (const side of sidesToProcess) {
      const price = prices.get(side.priceKey)
      if (price === undefined) {
        missingPriceSides++
        continue
      }

      const sideUpdate = generateSideUpdate(side, price)
      const transferUpdate = toTransferSideUpdate(side.side, sideUpdate)
      const existingUpdate = updatesByTransfer.get(side.transferId)

      if (existingUpdate) {
        Object.assign(existingUpdate, transferUpdate)
      } else {
        updatesByTransfer.set(side.transferId, transferUpdate)
      }
    }

    let processedTransfers = 0
    let failedTransfers = 0

    for (const [transferId, update] of updatesByTransfer) {
      try {
        await this.db.interopTransfer.updateFinancials(transferId, update)
        processedTransfers++

        this.logger.debug('Transfer processed', { transferId })
      } catch (error) {
        failedTransfers++
        this.logger.error('Transfer processing failed', error, {
          transferId,
        })
      }
    }

    this.logger.info('Interop financials run finished', {
      transfersLoaded: rawTransfersToProcess.length,
      sidesProcessed: sidesToProcess.length,
      sidesMissingPrice: missingPriceSides,
      updatedTransfers: processedTransfers,
      failedTransfers,
    })
  }

  private getPrices(sidesToProcess: SideToProcess[]): Promise<PriceMap> {
    const queryTuples: {
      key: SidePriceKey
      coingeckoId: string
      timestamp: UnixTime
    }[] = []

    for (const side of sidesToProcess) {
      queryTuples.push({
        key: side.priceKey,
        coingeckoId: side.coingeckoId,
        timestamp: side.timestamp,
      })
    }

    return this.db.interopRecentPrices.getClosestPricesForQueries(
      queryTuples,
      PRICE_ERROR_MARGIN,
    )
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

function createIdResolver(chains: readonly { id: string; type: 'evm' }[]) {
  return function (transfer: InteropTransferRecord) {
    return {
      transfer,
      srcId: toDeployedId(chains, transfer.srcChain, transfer.srcTokenAddress),
      dstId: toDeployedId(chains, transfer.dstChain, transfer.dstTokenAddress),
    }
  }
}

function getUniqueTokenIds(
  transfersWithTokenIds: TransferWithResolvedIds[],
): DeployedTokenId[] {
  return unique(
    transfersWithTokenIds
      .flatMap((transfer) => [transfer.srcId, transfer.dstId])
      .filter((id) => id !== undefined),
  )
}

function toTransferSideUpdate(prefix: SidePrefix, tokenUpdate: TokenUpdate) {
  if (prefix === 'src') {
    return {
      srcAbstractTokenId: tokenUpdate.abstractTokenId,
      srcSymbol: tokenUpdate.symbol,
      srcPrice: tokenUpdate.price,
      srcAmount: tokenUpdate.amount,
      srcValueUsd: tokenUpdate.valueUsd,
    } satisfies InteropTransferUpdate
  }

  return {
    dstAbstractTokenId: tokenUpdate.abstractTokenId,
    dstSymbol: tokenUpdate.symbol,
    dstPrice: tokenUpdate.price,
    dstAmount: tokenUpdate.amount,
    dstValueUsd: tokenUpdate.valueUsd,
  } satisfies InteropTransferUpdate
}

function toSidePriceKey(transferId: string, prefix: SidePrefix): SidePriceKey {
  return `${transferId}:${prefix}` as SidePriceKey
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

function prepareTransferSides(
  transfers: TransferWithResolvedIds[],
  tokenInfos: TokenInfos,
): SideToProcess[] {
  const result: SideToProcess[] = []

  for (const { transfer, srcId, dstId } of transfers) {
    if (
      transfer.srcValueUsd === undefined &&
      transfer.srcRawAmount !== undefined &&
      srcId
    ) {
      const tokenInfo = tokenInfos.get(srcId)

      if (tokenInfo) {
        const side = 'src' as const

        result.push({
          transferId: transfer.transferId,
          side,
          timestamp: transfer.srcTime,
          rawAmount: transfer.srcRawAmount,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals,
          coingeckoId: tokenInfo.coingeckoId,
          abstractTokenId: tokenInfo.abstractId,
          priceKey: toSidePriceKey(transfer.transferId, side),
        })
      }
    }

    if (
      transfer.dstValueUsd === undefined &&
      transfer.dstRawAmount !== undefined &&
      dstId
    ) {
      const tokenInfo = tokenInfos.get(dstId)

      if (tokenInfo) {
        const side = 'dst' as const
        result.push({
          transferId: transfer.transferId,
          side,
          timestamp: transfer.dstTime,
          rawAmount: transfer.dstRawAmount,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals,
          coingeckoId: tokenInfo.coingeckoId,
          abstractTokenId: tokenInfo.abstractId,
          priceKey: toSidePriceKey(transfer.transferId, side),
        })
      }
    }
  }

  return result
}

function generateSideUpdate(side: SideToProcess, price: number): TokenUpdate {
  const amount =
    Number((side.rawAmount * 1_000_000n) / 10n ** BigInt(side.decimals)) /
    1_000_000

  return {
    abstractTokenId: side.abstractTokenId,
    symbol: side.symbol,
    price,
    amount,
    valueUsd: price * amount,
  }
}
