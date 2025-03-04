import { AGGLAYER_L2BRIDGE_ADDRESS } from '@l2beat/backend-shared'
import type { ChainConfig, Project } from '@l2beat/config'
import {
  assert,
  Bytes,
  type EthereumAddress,
  notUndefined,
} from '@l2beat/shared-pure'
import type { Token as LegacyToken } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import type { MulticallRequest } from '../../../peripherals/multicall/types'
import { type Token, TokenId } from '../types'
import { tokenToTicker } from './tickers'
import type { RpcClient } from '@l2beat/shared'
import { toMulticallConfigEntry } from '../../../peripherals/multicall/MulticallConfig'

export const bridgeInterface = new utils.Interface([
  'function getTokenWrappedAddress(uint32 originNetwork, address originTokenAddress) view returns (address)',
])
const ORIGIN_NETWORK = 0

export async function getAggLayerTokens(
  project: Project<'tvlConfig', 'chainConfig'>,
  chain: ChainConfig,
  tokens: (LegacyToken & { address: EthereumAddress })[],
  rpcClient: RpcClient,
): Promise<Token[]> {
  const multicallConfig = (chain.multicallContracts ?? []).map((m) =>
    toMulticallConfigEntry(m),
  )

  const multicallClient = new MulticallClient(rpcClient, multicallConfig)

  const encoded: MulticallRequest[] = tokens.map((token) => ({
    address: AGGLAYER_L2BRIDGE_ADDRESS,
    data: Bytes.fromHex(
      bridgeInterface.encodeFunctionData('getTokenWrappedAddress', [
        ORIGIN_NETWORK,
        token.address,
      ]),
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
        'getTokenWrappedAddress',
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
