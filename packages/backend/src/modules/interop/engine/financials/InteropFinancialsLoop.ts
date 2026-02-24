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

type TransferToProcess = {
  transferId: string
  sides: SideToProcess[]
}

type SideToProcess = {
  side: 'src' | 'dst'
  timestamp: UnixTime
  priceKey: string
  coingeckoId: string
  abstractTokenId: string
  rawAmount: bigint
  decimals: number
  symbol: string
}

type SideWithPrice = SideToProcess & { price: number }

type TransferToUpdate = {
  transferId: string
  sides: SideWithPrice[]
}

type PriceMap = Map<string, number | undefined>

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

    const preparedTransfers = prepareTransfers(
      transfersWithTokenIds,
      tokenInfos,
    )

    const prices = await this.getPrices(preparedTransfers)

    const transfersWithPrices = assignPrices(preparedTransfers, prices)
    // no sides = no processing
    const transfersToUpdate = transfersWithPrices.filter(
      (transfer) => transfer.sides.length > 0,
    )

    for (const transfer of transfersToUpdate) {
      try {
        const update = this.processTransfer(transfer)

        if (Object.keys(update).length === 0) {
          this.logger.info('Transfer skipped, no financial fields to update', {
            transferId: transfer.transferId,
          })
          continue
        }

        await this.db.interopTransfer.updateFinancials(
          transfer.transferId,
          update,
        )

        this.logger.info('Transfer processed', {
          transferId: transfer.transferId,
          transferWithUpdatedValue:
            update.srcValueUsd !== undefined ||
            update.dstValueUsd !== undefined,
        })
      } catch (error) {
        this.logger.error('Transfer processing failed', error, {
          transferId: transfer.transferId,
        })
      }
    }
  }

  private processTransfer(transfer: TransferToUpdate): InteropTransferUpdate {
    const update: InteropTransferUpdate = {}

    for (const side of transfer.sides) {
      const sideFinancials = this.processSide(side)
      Object.assign(update, sideFinancials)
    }

    return update
  }

  private processSide(side: SideWithPrice) {
    const update = this.generateSideUpdate(side)
    return toTransferSideUpdate(side.side, update)
  }

  private getPrices(preparedTransfers: TransferToProcess[]): Promise<PriceMap> {
    const queryTuples: {
      key: string
      coingeckoId: string
      timestamp: UnixTime
    }[] = []

    for (const transfer of preparedTransfers) {
      for (const side of transfer.sides) {
        queryTuples.push({
          key: side.priceKey,
          coingeckoId: side.coingeckoId,
          timestamp: side.timestamp,
        })
      }
    }

    return this.db.interopRecentPrices.getClosestPricesForQueries(
      queryTuples,
      PRICE_ERROR_MARGIN,
    )
  }

  private generateSideUpdate(side: SideWithPrice): TokenUpdate {
    const amount =
      Number((side.rawAmount * 1_000_000n) / 10n ** BigInt(side.decimals)) /
      1_000_000

    return {
      abstractTokenId: side.abstractTokenId,
      symbol: side.symbol,
      price: side.price,
      amount,
      valueUsd: side.price * amount,
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

function toTransferSideUpdate(prefix: 'src' | 'dst', tokenUpdate: TokenUpdate) {
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

function toSidePriceKey(transferId: string, prefix: 'src' | 'dst') {
  return `${transferId}:${prefix}`
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

function prepareTransfers(
  transfers: TransferWithResolvedIds[],
  tokenInfos: TokenInfos,
): TransferToProcess[] {
  return transfers.map(({ transfer, srcId, dstId }) => {
    const sides: SideToProcess[] = []

    if (
      transfer.srcValueUsd === undefined &&
      transfer.srcRawAmount !== undefined &&
      srcId
    ) {
      const tokenInfo = tokenInfos.get(srcId)

      if (tokenInfo) {
        const side = 'src' as const

        sides.push({
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
        sides.push({
          side,

          timestamp: transfer.dstTime,
          rawAmount: transfer.dstRawAmount,

          decimals: tokenInfo.decimals,
          symbol: tokenInfo.symbol,
          coingeckoId: tokenInfo.coingeckoId,
          abstractTokenId: tokenInfo.abstractId,

          priceKey: toSidePriceKey(transfer.transferId, side),
        })
      }
    }

    return {
      transferId: transfer.transferId,
      sides,
    }
  })
}

function assignPrices(
  transfers: TransferToProcess[],
  prices: PriceMap,
): TransferToUpdate[] {
  return transfers.map((transfer) => ({
    transferId: transfer.transferId,
    sides: transfer.sides.flatMap((side) => {
      const price = prices.get(side.priceKey)

      if (price === undefined) {
        // no price, no data - skip side processing
        return []
      }

      return {
        ...side,
        price,
      }
    }),
  }))
}
