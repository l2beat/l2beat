import type {
  ChainConfig,
  ElasticChainEscrow,
  Project,
  ProjectTvlEscrow,
} from '@l2beat/config'
import { assert, Bytes, notUndefined } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import type { MulticallRequest } from '../../../peripherals/multicall/types'
import { createToken } from '../mapConfig'
import { type Token, TokenId } from '../types'
import { tokenToTicker } from './tickers'

export const bridgeInterface = new utils.Interface([
  'function l2TokenAddress(address _l1Token) view returns (address)',
])

export async function getElasticChainTokens(
  project: Project<'tvlConfig', 'chainConfig'>,
  chain: ChainConfig,
  escrow: ProjectTvlEscrow & { sharedEscrow: ElasticChainEscrow },
  multicallClient: MulticallClient,
): Promise<Token[]> {
  const l2Tokens = escrow.tokens.filter((t) => t.address !== undefined)

  const encoded: MulticallRequest[] = l2Tokens.map((token) => ({
    address: escrow.sharedEscrow.l2BridgeAddress,
    data: Bytes.fromHex(
      bridgeInterface.encodeFunctionData('l2TokenAddress', [token.address]),
    ),
  }))

  // TODO: latest block number
  const responses = await multicallClient.multicall(encoded, 1296670)

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
        id: TokenId.create(project.id, address),
        // This is a temporary solution
        ticker: tokenToTicker(token),
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
    id: TokenId.create(project.id, 'native'),
    ticker: 'ethereum',
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
    for (const l1Token of escrow.sharedEscrow.tokensToAssignFromL1) {
      const token = escrow.tokens.find((t) => t.symbol === l1Token)
      assert(token, `${l1Token} not found`)
      tokensToAssignFromL1.push(createToken(token, project, chain, escrow))
    }
  }

  return [etherOnL2, ...l2TokensTvsConfigs, ...tokensToAssignFromL1]
}
