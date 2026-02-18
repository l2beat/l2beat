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

interface SideInput {
  id: DeployedTokenId
  timestamp: UnixTime
  rawAmount: bigint | undefined
  prefix: 'src' | 'dst'
}

interface TokenUpdate {
  abstractTokenId: string
  symbol: string
  price: number
  amount: number
  valueUsd: number
}

export class InteropFinancialsLoop extends TimeLoop {
  constructor(
    private chains: { id: string; type: 'evm' }[],
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

    const transfersToProcess =
      await this.db.interopTransfer.getWithMissingFinancials()

    if (transfersToProcess.length === 0) {
      this.logger.info('Skipping run, no transfers to process.')
      return
    }

    const resolveIds = createIdResolver(this.chains)
    const transfersWithTokenIds = transfersToProcess.map(resolveIds)
    const tokenIds = getUniqueTokenIds(transfersWithTokenIds)

    const tokenInfos = await getTokenInfos(
      tokenIds,
      this.tokenDbClient,
      this.logger,
    )

    for (const transferWithIds of transfersWithTokenIds) {
      const { transfer } = transferWithIds
      this.logger.info('Processing transfer', {
        transferId: transfer.transferId,
      })

      try {
        const update = await this.processTransfer(transferWithIds, tokenInfos)

        if (Object.keys(update).length === 0) {
          this.logger.info('Transfer skipped, no financial fields to update', {
            transferId: transfer.transferId,
          })
          continue
        }

        // TODO: isProcessed flag became useless
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

  private async processTransfer(
    transferWithIds: TransferWithResolvedIds,
    tokenInfos: TokenInfos,
  ): Promise<InteropTransferUpdate> {
    const { transfer, srcId, dstId } = transferWithIds
    const update: InteropTransferUpdate = {}

    if (srcId) {
      const sourceSideFinancials = await this.processSide(
        {
          id: srcId,
          timestamp: transfer.srcTime,
          rawAmount: transfer.srcRawAmount,
          prefix: 'src',
        },
        tokenInfos,
      )

      Object.assign(update, sourceSideFinancials)
    }

    if (dstId) {
      const destinationSideFinancials = await this.processSide(
        {
          id: dstId,
          timestamp: transfer.dstTime,
          rawAmount: transfer.dstRawAmount,
          prefix: 'dst',
        },
        tokenInfos,
      )

      Object.assign(update, destinationSideFinancials)
    }

    return update
  }

  private async processSide(side: SideInput, tokenInfos: TokenInfos) {
    const tokenInfo = tokenInfos.get(side.id)
    if (!tokenInfo) {
      return {}
    }

    const price = await this.getPriceForTimestamp(
      tokenInfo.coingeckoId,
      side.timestamp,
    )
    const tokenUpdate = this.generateTokenUpdate(
      tokenInfo,
      price,
      side.id,
      side.rawAmount,
    )

    if (!tokenUpdate) {
      return {}
    }

    return toTransferSideUpdate(side.prefix, tokenUpdate)
  }

  private getPriceForTimestamp(coingeckoId: string, timestamp: UnixTime) {
    return this.db.interopRecentPrices.getClosestPrice(
      coingeckoId,
      timestamp,
      PRICE_ERROR_MARGIN,
    )
  }

  private generateTokenUpdate(
    tokenInfo: TokenInfo,
    price: number | undefined,
    deployedTokenId: DeployedTokenId,
    rawAmount: bigint | undefined,
  ): TokenUpdate | undefined {
    if (price === undefined) {
      this.logger.warn('Missing price data', {
        id: deployedTokenId,
        coingeckoId: tokenInfo.coingeckoId,
      })
      return
    }

    if (rawAmount === undefined) {
      this.logger.warn('Missing raw amount', { id: deployedTokenId })
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
