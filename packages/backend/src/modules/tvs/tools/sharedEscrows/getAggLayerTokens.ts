import type { Logger } from '@l2beat/backend-tools'
import type {
  AggLayerEscrow,
  ChainConfig,
  Project,
  TvsToken,
} from '@l2beat/config'
import type { RpcClient } from '@l2beat/shared'
import {
  assert,
  Bytes,
  EthereumAddress,
  notUndefined,
  TokenId,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { MulticallClient } from '../../../../peripherals/multicall/MulticallClient'
import { toMulticallConfigEntry } from '../../../../peripherals/multicall/MulticallConfig'
import type { MulticallRequest } from '../../../../peripherals/multicall/types'
import { getTimeRangeIntersection } from '../getTimeRangeIntersection'
import type { LocalStorage } from '../LocalStorage'
import { createEscrowToken } from '../legacyConfig/mapLegacyConfig'
import type { LegacyEscrow } from '../legacyConfig/types'
import { isEmptyAddress } from './isEmptyAddress'

export const bridgeInterface = new utils.Interface([
  'function getTokenWrappedAddress(uint32 originNetwork, address originTokenAddress) view returns (address)',
])
const ORIGIN_NETWORK = 0

// We are assuming that the BRIDGE_ADDRESS is the same on all chains
export const AGGLAYER_L2BRIDGE_ADDRESS = EthereumAddress(
  '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe',
)

export async function getAggLayerTokens(
  project: Project<'escrows', 'chainConfig'>,
  associatedTokens: string[],
  escrow: LegacyEscrow & { sharedEscrow: AggLayerEscrow },
  chainOfL1Escrow: ChainConfig,
  rpcClient: RpcClient,
  localStorage: LocalStorage,
  logger: Logger,
): Promise<TvsToken[]> {
  const chain = project.chainConfig
  assert(chain, `${project.id}: chain should be defined`)
  const multicallConfig = (chain.multicallContracts ?? []).map((m) =>
    toMulticallConfigEntry(m),
  )

  const multicallClient = new MulticallClient(rpcClient, multicallConfig)

  const l2Tokens = escrow.tokens.filter(
    (t) =>
      t.address !== undefined &&
      !escrow.sharedEscrow.tokensToAssignFromL1?.includes(t.symbol),
  )

  const resolved: { id: string; address: EthereumAddress }[] = []
  const toResolve: { id: string; request: MulticallRequest }[] = []

  for (const token of l2Tokens) {
    const cachedValue = await localStorage.getAddress(
      `${project.id}-${token.id}`,
    )
    if (cachedValue !== undefined) {
      logger.debug(`Cached value found for ${project.id}-${token.id}`)
      resolved.push({ id: token.id, address: EthereumAddress(cachedValue) })
      continue
    }

    toResolve.push({
      id: token.id,
      request: {
        address: AGGLAYER_L2BRIDGE_ADDRESS,
        data: Bytes.fromHex(
          bridgeInterface.encodeFunctionData('getTokenWrappedAddress', [
            ORIGIN_NETWORK,
            token.address,
          ]),
        ),
      },
    })
  }

  if (toResolve.length > 0) {
    logger.info(
      `Querying for AggLayer L2 tokens addresses for project ${project.id}...`,
    )
    const block = await rpcClient.getLatestBlockNumber()
    const responses = await multicallClient.multicall(
      toResolve.map((e) => ({ ...e.request })),
      block,
    )

    for (const index in toResolve) {
      const id = toResolve[index].id
      const response = responses[index].data.toString()
      const [address] = bridgeInterface.decodeFunctionResult(
        'getTokenWrappedAddress',
        response,
      )
      await localStorage.writeAddress(`${project.id}-${id}`, address)
      resolved.push({ id, address: EthereumAddress(address) })
    }
  }

  const l2TokensTvsConfigs = resolved
    .map((item) => {
      if (isEmptyAddress(item.address)) return

      const token = l2Tokens.find((t) => t.id === item.id)
      assert(token, `${item.id} not found`)

      const { sinceTimestamp, untilTimestamp } = getTimeRangeIntersection(
        escrow,
        chain,
        token,
      )

      return {
        mode: 'auto' as const,
        id: TokenId.create(project.id, token.symbol),
        priceId: token.coingeckoId,
        symbol: token.symbol,
        name: token.name,
        iconUrl: token.iconUrl,
        category: token.category,
        source: 'canonical' as const,
        isAssociated: associatedTokens.includes(token.symbol),
        amount: {
          type: 'totalSupply' as const,
          address: item.address,
          chain: project.id,
          // Assumption: decimals on destination network are the same
          decimals: token.decimals,
          sinceTimestamp,
          ...(untilTimestamp ? { untilTimestamp } : {}),
        },
        bridgedUsing: token.bridgedUsing,
      } satisfies TvsToken
    })
    .filter(notUndefined)

  assert(chain.sinceTimestamp)

  let etherOnL2: TvsToken | undefined

  if (escrow.sharedEscrow.nativeAsset === 'etherWrapped') {
    assert(escrow.sharedEscrow.wethAddress)

    const { sinceTimestamp, untilTimestamp } = getTimeRangeIntersection(
      escrow,
      chain,
    )

    etherOnL2 = {
      mode: 'auto' as const,
      id: TokenId.create(project.id, 'ETH'),
      priceId: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
      category: 'ether' as const,
      source: 'canonical' as const,
      amount: {
        type: 'totalSupply' as const,
        address: escrow.sharedEscrow.wethAddress,
        chain: project.id,
        decimals: 18,
        sinceTimestamp,
        ...(untilTimestamp ? { untilTimestamp } : {}),
      },
      isAssociated: false,
    }
  }

  if (escrow.sharedEscrow.nativeAsset === 'etherPreminted') {
    assert(escrow.sharedEscrow.premintedAmount)

    const { sinceTimestamp, untilTimestamp } = getTimeRangeIntersection(
      escrow,
      chain,
    )

    etherOnL2 = {
      mode: 'auto' as const,
      id: TokenId.create(project.id, 'ETH'),
      priceId: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
      category: 'ether' as const,
      source: 'canonical' as const,
      amount: {
        type: 'calculation',
        operator: 'diff',
        arguments: [
          {
            type: 'const',
            value: escrow.sharedEscrow.premintedAmount,
            decimals: 18,
            sinceTimestamp,
            ...(untilTimestamp ? { untilTimestamp } : {}),
          },
          {
            type: 'balanceOfEscrow',
            chain: project.id,
            decimals: 18,
            address: 'native',
            escrowAddress: AGGLAYER_L2BRIDGE_ADDRESS,
            sinceTimestamp,
            ...(untilTimestamp ? { untilTimestamp } : {}),
          },
        ],
      },
      isAssociated: false,
    } satisfies TvsToken
  }

  assert(etherOnL2)

  const tokensToAssignFromL1: TvsToken[] = []

  if (escrow.sharedEscrow.tokensToAssignFromL1) {
    for (const l1Token of escrow.sharedEscrow.tokensToAssignFromL1) {
      const token = escrow.tokens.find((t) => t.symbol === l1Token)
      assert(token, `${l1Token} not found`)
      tokensToAssignFromL1.push(
        createEscrowToken(
          project,
          associatedTokens,
          escrow,
          chainOfL1Escrow,
          token,
        ),
      )
    }
  }

  return [...l2TokensTvsConfigs, etherOnL2, ...tokensToAssignFromL1]
}
