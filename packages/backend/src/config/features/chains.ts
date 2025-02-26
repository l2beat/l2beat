import type { Env } from '@l2beat/backend-tools'
import { type ChainConfig, layer2s, layer3s } from '@l2beat/config'
import { ProjectId, type Token, type UnixTime } from '@l2beat/shared-pure'

import { toMulticallConfigEntry } from '../../peripherals/multicall/MulticallConfig'
import type { ChainTvlConfig } from '../Config'

export function getChainsWithTokens(tokenList: Token[]) {
  const results = new Set<string>()
  for (const { chainName } of tokenList) {
    results.add(chainName)
  }
  return Array.from(results)
}

const DEFAULT_RPC_CALLS_PER_MINUTE = 60

export function getChainTvlConfig(
  isEnabled: boolean,
  env: Env,
  chain: string,
  chains: ChainConfig[],
  options?: {
    minTimestamp?: UnixTime
  },
): ChainTvlConfig {
  const chainConfig = chains.find((c) => c.name === chain)
  if (!chainConfig) {
    throw new Error('Unknown chain: ' + chain)
  }

  const projectId =
    chain === 'ethereum'
      ? ProjectId.ETHEREUM
      : (layer2s.find((layer2) => layer2.chainConfig?.name === chain)?.id ??
        layer3s.find((layer3) => layer3.chainConfig?.name === chain)?.id)
  if (!projectId) {
    throw new Error('Missing project for chain: ' + chain)
  }

  if (!chainConfig.sinceTimestamp) {
    throw new Error('Missing sinceTimestamp for chain: ' + chain)
  }

  if (!isEnabled) {
    return { chain }
  }

  const project =
    layer2s.find((layer2) => layer2.id === projectId) ??
    layer3s.find((layer3) => layer3.id === projectId)

  const rpcApi = project?.chainConfig?.apis.find((x) => x.type === 'rpc')
  const explorerApi = project?.chainConfig?.apis.find(
    (x) => x.type === 'etherscan' || x.type === 'blockscout',
  )

  const ENV_NAME = chain.toUpperCase()
  return {
    chain,
    config: {
      projectId,
      providerUrl: env.string(
        [`${ENV_NAME}_RPC_URL_FOR_TVL`, `${ENV_NAME}_RPC_URL`],
        rpcApi?.url,
      ),
      providerCallsPerMinute: env.integer(
        [
          `${ENV_NAME}_RPC_CALLS_PER_MINUTE_FOR_TVL`,
          `${ENV_NAME}_RPC_CALLS_PER_MINUTE`,
        ],
        rpcApi?.callsPerMinute ?? DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
      blockExplorerConfig: explorerApi
        ? explorerApi.type === 'etherscan'
          ? {
              type: explorerApi.type,
              apiKey: env.string([
                `${ENV_NAME}_ETHERSCAN_API_KEY_FOR_TVL`,
                `${ENV_NAME}_ETHERSCAN_API_KEY`,
              ]),
              url: explorerApi.url,
            }
          : { type: explorerApi.type, url: explorerApi.url }
        : undefined,
      minBlockTimestamp: options?.minTimestamp ?? chainConfig.sinceTimestamp,
      multicallConfig: (chainConfig.multicallContracts ?? []).map(
        toMulticallConfigEntry,
      ),
    },
  }
}
