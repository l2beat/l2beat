import {
  type ChainConfig,
  type ElasticChainEscrow,
  type Project,
  ProjectService,
  type ProjectTvlEscrow,
} from '@l2beat/config'
import type { RpcClient } from '@l2beat/shared'
import { assert, Bytes, ProjectId, notUndefined } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { toMulticallConfigEntry } from '../../../peripherals/multicall/MulticallConfig'
import type { MulticallRequest } from '../../../peripherals/multicall/types'
import { createToken } from '../mapConfig'
import { type Token, TokenId } from '../types'

export const bridgeInterface = new utils.Interface([
  'function l2TokenAddress(address _l1Token) view returns (address)',
])

export async function getElasticChainTokens(
  project: Project<'tvlConfig', 'chainConfig'>,
  chain: ChainConfig,
  escrow: ProjectTvlEscrow & { sharedEscrow: ElasticChainEscrow },
  rpcClient: RpcClient,
): Promise<Token[]> {
  const multicallConfig = (chain.multicallContracts ?? []).map((m) =>
    toMulticallConfigEntry(m),
  )
  const multicallClient = new MulticallClient(rpcClient, multicallConfig)

  const l2Tokens = escrow.tokens.filter(
    (t) =>
      t.address !== undefined &&
      !escrow.sharedEscrow.tokensToAssignFromL1?.includes(t.symbol),
  )

  const encoded: MulticallRequest[] = l2Tokens.map((token) => ({
    address: escrow.sharedEscrow.l2BridgeAddress,
    data: Bytes.fromHex(
      bridgeInterface.encodeFunctionData('l2TokenAddress', [token.address]),
    ),
  }))

  const block = await rpcClient.getLatestBlockNumber()
  const responses = await multicallClient.multicall(encoded, block)

  const l2TokensTvsConfigs = responses
    .map((response, index) => {
      const token = l2Tokens[index]
      if (
        response.data.toString() === '0x' ||
        response.data.toString() ===
          '0x0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        return
      }

      const [address] = bridgeInterface.decodeFunctionResult(
        'l2TokenAddress',
        response.data.toString(),
      )
      assert(chain.sinceTimestamp)

      return {
        id: TokenId.create(project.id, token.symbol),
        priceId: token.coingeckoId,
        symbol: token.symbol,
        name: token.name,
        // TODO: get token deployment timestamp on chain
        sinceTimestamp: chain.sinceTimestamp,
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
        },
      }
    })
    .filter(notUndefined)

  assert(chain.sinceTimestamp)

  const etherOnL2 = {
    id: TokenId.create(project.id, 'ETH'),
    priceId: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    sinceTimestamp: chain.sinceTimestamp,
    category: 'ether' as const,
    source: 'canonical' as const,
    amount: {
      type: 'totalSupply' as const,
      address: escrow.sharedEscrow.l2EtherAddress,
      chain: project.id,
      decimals: 18,
    },
    isAssociated: false,
  }

  const tokensToAssignFromL1: Token[] = []

  if (escrow.sharedEscrow.tokensToAssignFromL1) {
    const ethereum = await new ProjectService().getProject({
      id: ProjectId('ethereum'),
      select: ['chainConfig'],
    })
    assert(ethereum)
    for (const l1Token of escrow.sharedEscrow.tokensToAssignFromL1) {
      const token = escrow.tokens.find((t) => t.symbol === l1Token)
      assert(token, `${l1Token} not found`)
      tokensToAssignFromL1.push(
        createToken(token, project, ethereum.chainConfig, escrow),
      )
    }
  }

  return [...l2TokensTvsConfigs, etherOnL2, ...tokensToAssignFromL1]
}
