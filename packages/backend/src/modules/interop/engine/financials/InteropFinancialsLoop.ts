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

interface SideState {
  transferId: string
  side: SidePrefix
  timestamp: UnixTime
  rawAmount: bigint | undefined
  abstractTokenId: string | undefined
  symbol: string | undefined
  price: number | undefined
  amount: number | undefined
  valueUsd: number | undefined
}

type SideDecision =
  | {
      type: 'skip'
    }
  | {
      type: 'delete'
      transferId: string
      side: SidePrefix
    }
  | {
      type: 'update'
      sideToProcess: SideToProcess
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
    const rawTransfersToProcess =
      await this.db.interopTransfer.getWithEitherRawAmount()

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

    const sideDecisions = prepareSideDecisions(
      transfersWithTokenIds,
      tokenInfos,
    )

    if (sideDecisions.length === 0) {
      this.logger.info('Skipping run, no processable transfer sides.')
      return
    }

    const updatesByTransfer = new Map<string, InteropTransferUpdate>()
    let clearedSides = 0

    const sidesToProcess: SideToProcess[] = []
    for (const decision of sideDecisions) {
      switch (decision.type) {
        case 'delete':
          mergeTransferUpdate(
            updatesByTransfer,
            decision.transferId,
            toTransferSideClearUpdate(decision.side),
          )
          clearedSides++
          break
        case 'update':
          sidesToProcess.push(decision.sideToProcess)
          break
        case 'skip':
          break
        default:
          assertUnreachable(decision)
      }
    }

    let missingPriceSides = 0
    if (sidesToProcess.length > 0) {
      const prices = await this.getPrices(sidesToProcess)

      for (const side of sidesToProcess) {
        const price = prices.get(side.priceKey)

        if (price === undefined) {
          missingPriceSides++
          continue
        }

        const sideUpdate = generateSideUpdate(side, price)
        const transferUpdate = toTransferSideUpdate(side.side, sideUpdate)
        mergeTransferUpdate(updatesByTransfer, side.transferId, transferUpdate)
      }
    }

    if (updatesByTransfer.size === 0) {
      this.logger.info('Skipping run, no transfer updates to apply.', {
        sidesMissingPrice: missingPriceSides,
      })
      return
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
      sidesProcessed: sideDecisions.length,
      sidesCleared: clearedSides,
      sidesNeedingPrice: sidesToProcess.length,
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
        timestamp: side.timestamp,
        coingeckoId: side.coingeckoId,
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
      decimals: deployedToken.decimals,
      coingeckoId: abstractToken.coingeckoId,
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
      srcPrice: tokenUpdate.price,
      srcAmount: tokenUpdate.amount,
      srcSymbol: tokenUpdate.symbol,
      srcValueUsd: tokenUpdate.valueUsd,
      srcAbstractTokenId: tokenUpdate.abstractTokenId,
    } satisfies InteropTransferUpdate
  }

  return {
    dstPrice: tokenUpdate.price,
    dstAmount: tokenUpdate.amount,
    dstSymbol: tokenUpdate.symbol,
    dstValueUsd: tokenUpdate.valueUsd,
    dstAbstractTokenId: tokenUpdate.abstractTokenId,
  } satisfies InteropTransferUpdate
}

function toTransferSideClearUpdate(prefix: SidePrefix): InteropTransferUpdate {
  if (prefix === 'src') {
    return {
      srcPrice: null,
      srcAmount: null,
      srcSymbol: null,
      srcValueUsd: null,
      srcAbstractTokenId: null,
    }
  }

  return {
    dstPrice: null,
    dstAmount: null,
    dstSymbol: null,
    dstValueUsd: null,
    dstAbstractTokenId: null,
  }
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

function prepareSideDecisions(
  transfers: TransferWithResolvedIds[],
  tokenInfos: TokenInfos,
): SideDecision[] {
  const decisions: SideDecision[] = []

  for (const { transfer, srcId, dstId } of transfers) {
    const srcTokenInfo = srcId ? tokenInfos.get(srcId) : undefined
    decisions.push(decideSideAction(toSideState(transfer, 'src'), srcTokenInfo))

    const dstTokenInfo = dstId ? tokenInfos.get(dstId) : undefined
    decisions.push(decideSideAction(toSideState(transfer, 'dst'), dstTokenInfo))
  }

  return decisions.filter((decision) => decision.type !== 'skip')
}

function decideSideAction(
  side: SideState,
  tokenInfo: TokenInfo | undefined,
): SideDecision {
  // No token info - token deleted?
  if (tokenInfo === undefined) {
    // has some side info - clear it
    if (hasAnySideInfo(side)) {
      return {
        type: 'delete',
        transferId: side.transferId,
        side: side.side,
      }
    }

    // otherwise skip
    return { type: 'skip' }
  }

  // Can't do much
  if (side.rawAmount === undefined) {
    return { type: 'skip' }
  }

  // No usd value or token has been updated in the token-db since last processing - needs update
  if (side.valueUsd === undefined || hasTokenInfoMismatch(side, tokenInfo)) {
    return {
      type: 'update',
      sideToProcess: {
        side: side.side,
        symbol: tokenInfo.symbol,
        timestamp: side.timestamp,
        rawAmount: side.rawAmount,
        transferId: side.transferId,
        decimals: tokenInfo.decimals,
        coingeckoId: tokenInfo.coingeckoId,
        abstractTokenId: tokenInfo.abstractId,
        priceKey: toSidePriceKey(side.transferId, side.side),
      },
    }
  }

  return { type: 'skip' }
}

function hasAnySideInfo(side: SideState): boolean {
  return (
    side.abstractTokenId !== undefined ||
    side.symbol !== undefined ||
    side.price !== undefined ||
    side.amount !== undefined ||
    side.valueUsd !== undefined
  )
}

function hasTokenInfoMismatch(side: SideState, tokenInfo: TokenInfo): boolean {
  return (
    // We should compar coingeckoIds but it is impossible with current data model
    side.symbol !== tokenInfo.symbol ||
    side.abstractTokenId !== tokenInfo.abstractId
  )
}

function toSideState(
  transfer: InteropTransferRecord,
  side: SidePrefix,
): SideState {
  if (side === 'src') {
    return {
      side,
      price: transfer.srcPrice,
      symbol: transfer.srcSymbol,
      amount: transfer.srcAmount,
      timestamp: transfer.srcTime,
      valueUsd: transfer.srcValueUsd,
      transferId: transfer.transferId,
      rawAmount: transfer.srcRawAmount,
      abstractTokenId: transfer.srcAbstractTokenId,
    }
  }

  return {
    side,
    price: transfer.dstPrice,
    symbol: transfer.dstSymbol,
    amount: transfer.dstAmount,
    timestamp: transfer.dstTime,
    rawAmount: transfer.dstRawAmount,
    valueUsd: transfer.dstValueUsd,
    transferId: transfer.transferId,
    abstractTokenId: transfer.dstAbstractTokenId,
  }
}

function mergeTransferUpdate(
  updatesByTransfer: Map<string, InteropTransferUpdate>,
  transferId: string,
  update: InteropTransferUpdate,
) {
  const existingUpdate = updatesByTransfer.get(transferId)
  if (existingUpdate) {
    Object.assign(existingUpdate, update)
  } else {
    updatesByTransfer.set(transferId, update)
  }
}

function generateSideUpdate(side: SideToProcess, price: number): TokenUpdate {
  const amount =
    Number((side.rawAmount * 1_000_000n) / 10n ** BigInt(side.decimals)) /
    1_000_000

  return {
    price,
    amount,
    symbol: side.symbol,
    valueUsd: price * amount,
    abstractTokenId: side.abstractTokenId,
  }
}
