import type { Env } from '@l2beat/backend-tools'
import { type ChainConfig, layer2s, layer3s } from '@l2beat/config'
import {
  ChainId,
  ProjectId,
  type Token,
  type UnixTime,
} from '@l2beat/shared-pure'

import { toMulticallConfigEntry } from '../../peripherals/multicall/MulticallConfig'
import type { ChainTvlConfig } from '../Config'

export function getChainsWithTokens(tokenList: Token[], chains: ChainConfig[]) {
  const results = new Set<string>()
  for (const { chainId } of tokenList) {
    const chain = chains.find((x) => x.chainId === +chainId)
    if (chain) {
      results.add(chain.name)
    }
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

  if (!chainConfig.minTimestampForTvl) {
    throw new Error('Missing minTimestampForTvl for chain: ' + chain)
  }

  if (!isEnabled) {
    return { chain }
  }

  const project =
    layer2s.find((layer2) => layer2.id === projectId) ??
    layer3s.find((layer3) => layer3.id === projectId)

  const ENV_NAME = chain.toUpperCase()
  return {
    chain,
    config: {
      projectId,
      chainId: ChainId(chainConfig.chainId),
      providerUrl: env.string(
        [`${ENV_NAME}_RPC_URL_FOR_TVL`, `${ENV_NAME}_RPC_URL`],
        project?.config.transactionApi?.type === 'rpc'
          ? project.config.transactionApi.defaultUrl
          : undefined,
      ),
      providerCallsPerMinute: env.integer(
        [
          `${ENV_NAME}_RPC_CALLS_PER_MINUTE_FOR_TVL`,
          `${ENV_NAME}_RPC_CALLS_PER_MINUTE`,
        ],
        DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
      blockExplorerConfig: chainConfig.explorerApi
        ? chainConfig.explorerApi.type === 'etherscan'
          ? {
              type: chainConfig.explorerApi.type,
              apiKey: env.string([
                `${ENV_NAME}_ETHERSCAN_API_KEY_FOR_TVL`,
                `${ENV_NAME}_ETHERSCAN_API_KEY`,
              ]),
              url: chainConfig.explorerApi.url,
            }
          : {
              type: chainConfig.explorerApi.type,
              url: chainConfig.explorerApi.url,
            }
        : undefined,
      minBlockTimestamp:
        options?.minTimestamp ?? chainConfig.minTimestampForTvl,
      multicallConfig: (chainConfig.multicallContracts ?? []).map(
        toMulticallConfigEntry,
      ),
    },
  }
}
