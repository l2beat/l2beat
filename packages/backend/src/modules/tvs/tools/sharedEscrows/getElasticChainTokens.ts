import type { Logger } from '@l2beat/backend-tools'
import type {
  ChainConfig,
  ElasticChainEscrow,
  Project,
  TvsToken,
} from '@l2beat/config'
import { encodeTotalSupply, type RpcClient } from '@l2beat/shared'
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
  'function l2TokenAddress(address _l1Token) view returns (address)',
])

export async function getElasticChainTokens(
  project: Project<'escrows', 'chainConfig'>,
  associatedTokens: string[],
  escrow: LegacyEscrow & { sharedEscrow: ElasticChainEscrow },
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
  const toCheckTotalSupply: {
    id: string
    address: string
    request: MulticallRequest
  }[] = []

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
        address: escrow.sharedEscrow.l2BridgeAddress,
        data: Bytes.fromHex(
          bridgeInterface.encodeFunctionData('l2TokenAddress', [token.address]),
        ),
      },
    })
  }

  if (toResolve.length > 0) {
    logger.info(
      `Querying for ElasticChain L2 tokens addresses for project ${project.id}...`,
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
        'l2TokenAddress',
        response,
      )

      if (!isEmptyAddress(address)) {
        const encoded = encodeTotalSupply(address)
        toCheckTotalSupply.push({
          id,
          address,
          request: {
            address: encoded.to,
            data: encoded.data,
          },
        })
        continue
      }

      await localStorage.writeAddress(`${project.id}-${id}`, address)
      resolved.push({ id, address })
    }
  }

  if (toCheckTotalSupply.length > 0) {
    const block = await rpcClient.getLatestBlockNumber()
    const responses = await multicallClient.multicall(
      toCheckTotalSupply.map((e) => ({ ...e.request })),
      block,
    )

    for (const index in toCheckTotalSupply) {
      const id = toCheckTotalSupply[index].id
      const response = responses[index]
      const address = response.success
        ? toCheckTotalSupply[index].address
        : EthereumAddress.ZERO

      await localStorage.writeAddress(`${project.id}-${id}`, address)
      resolved.push({ id, address: EthereumAddress(address) })
    }
  }

  const l2TokensTvsConfigs = resolved.map((item) => {
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

  const { sinceTimestamp, untilTimestamp } = getTimeRangeIntersection(
    escrow,
    chain,
  )

  const etherOnL2 = {
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
      address: escrow.sharedEscrow.l2EtherAddress,
      chain: project.id,
      decimals: 18,
      sinceTimestamp,
      ...(untilTimestamp ? { untilTimestamp } : {}),
    },
    isAssociated: false,
  } satisfies TvsToken

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

  return [
    ...l2TokensTvsConfigs.filter(notUndefined),
    etherOnL2,
    ...tokensToAssignFromL1,
  ]
}
