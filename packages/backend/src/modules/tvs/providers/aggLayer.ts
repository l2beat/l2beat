import { AGGLAYER_L2BRIDGE_ADDRESS } from '@l2beat/backend-shared'
import type { AggLayerEscrow, Project, ProjectTvlEscrow } from '@l2beat/config'
import type { RpcClient } from '@l2beat/shared'
import { assert, Bytes, notUndefined } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { toMulticallConfigEntry } from '../../../peripherals/multicall/MulticallConfig'
import type { MulticallRequest } from '../../../peripherals/multicall/types'
import { bigIntToNumber } from '../bigIntToNumber'
import { createEscrowToken } from '../mapConfig'
import { type Token, TokenId } from '../types'

export const bridgeInterface = new utils.Interface([
  'function getTokenWrappedAddress(uint32 originNetwork, address originTokenAddress) view returns (address)',
])
const ORIGIN_NETWORK = 0

export async function getAggLayerTokens(
  project: Project<'tvlConfig', 'chainConfig'>,
  escrow: ProjectTvlEscrow & { sharedEscrow: AggLayerEscrow },
  rpcClient: RpcClient,
): Promise<Token[]> {
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

  const encoded: MulticallRequest[] = l2Tokens.map((token) => ({
    address: AGGLAYER_L2BRIDGE_ADDRESS,
    data: Bytes.fromHex(
      bridgeInterface.encodeFunctionData('getTokenWrappedAddress', [
        ORIGIN_NETWORK,
        token.address,
      ]),
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
        'getTokenWrappedAddress',
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

  let etherOnL2: Token | undefined

  if (escrow.sharedEscrow.nativeAsset === 'etherWrapped') {
    assert(escrow.sharedEscrow.wethAddress)

    etherOnL2 = {
      id: TokenId.create(project.id, 'ETH'),
      priceId: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      sinceTimestamp: chain.sinceTimestamp,
      category: 'ether' as const,
      source: 'canonical' as const,
      amount: {
        type: 'totalSupply' as const,
        address: escrow.sharedEscrow.wethAddress,
        chain: project.id,
        decimals: 18,
      },
      isAssociated: false,
    }
  }

  if (escrow.sharedEscrow.nativeAsset === 'etherPreminted') {
    assert(escrow.sharedEscrow.premintedAmount)

    etherOnL2 = {
      id: TokenId.create(project.id, 'ETH'),
      priceId: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      sinceTimestamp: chain.sinceTimestamp,
      category: 'ether' as const,
      source: 'canonical' as const,
      amount: {
        type: 'calculation',
        operator: 'diff',
        arguments: [
          {
            type: 'const',
            value: bigIntToNumber(escrow.sharedEscrow.premintedAmount, 18),
          },
          {
            type: 'balanceOfEscrow',
            chain: project.id,
            decimals: 18,
            address: 'native',
            escrowAddress: AGGLAYER_L2BRIDGE_ADDRESS,
          },
        ],
      },
      isAssociated: false,
    }
  }

  assert(etherOnL2)

  const tokensToAssignFromL1: Token[] = []

  if (escrow.sharedEscrow.tokensToAssignFromL1) {
    for (const l1Token of escrow.sharedEscrow.tokensToAssignFromL1) {
      const token = escrow.tokens.find((t) => t.symbol === l1Token)
      assert(token, `${l1Token} not found`)
      tokensToAssignFromL1.push(createEscrowToken(project, escrow, token))
    }
  }

  return [...l2TokensTvsConfigs, etherOnL2, ...tokensToAssignFromL1]
}
