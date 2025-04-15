import type { Logger } from '@l2beat/backend-tools'
import type {
  ChainConfig,
  ElasticChainEscrow,
  Project,
  ProjectTvlEscrow,
  TvsToken,
} from '@l2beat/config'
import { type RpcClient, encodeTotalSupply } from '@l2beat/shared'
import { assert, Bytes, TokenId, notUndefined } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { MulticallClient } from '../../../../peripherals/multicall/MulticallClient'
import { toMulticallConfigEntry } from '../../../../peripherals/multicall/MulticallConfig'
import type { MulticallRequest } from '../../../../peripherals/multicall/types'
import type { LocalStorage } from '../LocalStorage'
import { getTimeRangeIntersection } from '../getTimeRangeIntersection'
import { createEscrowToken } from '../mapConfig'

export const bridgeInterface = new utils.Interface([
  'function l2TokenAddress(address _l1Token) view returns (address)',
])

export async function getElasticChainTokens(
  project: Project<'tvlConfig', 'chainConfig'>,
  escrow: ProjectTvlEscrow & { sharedEscrow: ElasticChainEscrow },
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

  const resolved: { id: string; address: string }[] = []
  const toResolve: { id: string; request: MulticallRequest }[] = []

  for (const token of l2Tokens) {
    const cachedValue = await localStorage.getAddress(token.id)
    if (cachedValue !== undefined) {
      logger.debug(`Cached value found for ${token.id}`)
      resolved.push({ id: token.id, address: cachedValue })
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

  const block = await rpcClient.getLatestBlockNumber()
  if (toResolve.length > 0) {
    logger.info(
      `Querying for ElasticChain L2 tokens addresses for project ${project.id}...`,
    )
    const responses = await multicallClient.multicall(
      toResolve.map((e) => ({ ...e.request })),
      block,
    )

    for (const index in toResolve) {
      const id = toResolve[index].id
      const address = responses[index].data.toString()
      await localStorage.writeAddress(id, address)
      resolved.push({ id, address })
    }
  }

  const l2TokensTvsConfigs = await Promise.all(
    resolved.map(async (item) => {
      if (
        item.address === '0x' ||
        item.address ===
          '0x0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        return
      }

      const [address] = bridgeInterface.decodeFunctionResult(
        'l2TokenAddress',
        item.address,
      )

      try {
        // try fetching totalSupply, if it does not fail then add token
        const res = await rpcClient.call(encodeTotalSupply(address), block)
        if (res.length === 0) {
          throw new Error('Token does not exist')
        }

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
          isAssociated: !!project.tvlConfig.associatedTokens?.includes(
            token.symbol,
          ),
          amount: {
            type: 'totalSupply' as const,
            address: address,
            chain: project.id,
            // Assumption: decimals on destination network are the same
            decimals: token.decimals,
            sinceTimestamp,
            ...(untilTimestamp ? { untilTimestamp } : {}),
          },
        }
      } catch {
        return
      }
    }),
  )

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
  }

  const tokensToAssignFromL1: TvsToken[] = []

  if (escrow.sharedEscrow.tokensToAssignFromL1) {
    for (const l1Token of escrow.sharedEscrow.tokensToAssignFromL1) {
      const token = escrow.tokens.find((t) => t.symbol === l1Token)
      assert(token, `${l1Token} not found`)
      tokensToAssignFromL1.push(
        createEscrowToken(project, escrow, chainOfL1Escrow, token),
      )
    }
  }

  return [
    ...l2TokensTvsConfigs.filter(notUndefined),
    etherOnL2,
    ...tokensToAssignFromL1,
  ]
}
