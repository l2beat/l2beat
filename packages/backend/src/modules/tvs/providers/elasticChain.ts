import type { ChainConfig, ElasticChainEscrow, Project } from '@l2beat/config'
import {
  assert,
  Bytes,
  type EthereumAddress,
  notUndefined,
} from '@l2beat/shared-pure'
import type { Token as LegacyToken } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import type { MulticallRequest } from '../../../peripherals/multicall/types'
import { type Token, TokenId } from '../types'
import { tokenToTicker } from './tickers'

export const bridgeInterface = new utils.Interface([
  'function l2TokenAddress(address _l1Token) view returns (address)',
])

export async function getElasticChainTokens(
  escrow: ElasticChainEscrow,
  project: Project<'tvlConfig', 'chainConfig'>,
  chain: ChainConfig,
  tokens: (LegacyToken & { address: EthereumAddress })[],
  multicallClient: MulticallClient,
): Promise<Token[]> {
  const encoded: MulticallRequest[] = tokens.map((token) => ({
    address: escrow.l2BridgeAddress,
    data: Bytes.fromHex(
      bridgeInterface.encodeFunctionData('l2TokenAddress', [token.address]),
    ),
  }))

  // TODO: latest block number
  const responses = await multicallClient.multicall(encoded, 20390762)

  return responses
    .map((response, index) => {
      const token = tokens[index]
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
}
