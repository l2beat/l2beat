import { Env } from '@l2beat/backend-tools'
import { ChainConfig, chains, layer2s } from '@l2beat/config'
import { ChainId, ProjectId, Token, UnixTime } from '@l2beat/shared-pure'

import { toMulticallConfigEntry } from '../../peripherals/multicall/MulticallConfig'
import { ChainTvlConfig } from '../Config'
import { FeatureFlags } from '../FeatureFlags'

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
  flags: FeatureFlags,
  env: Env,
  chain: string,
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
      : layer2s.find((layer2) => layer2.chainConfig?.name === chain)?.id
  if (!projectId) {
    throw new Error('Missing project for chain: ' + chain)
  }

  if (!chainConfig.minTimestampForTvl) {
    throw new Error('Missing minTimestampForTvl for chain: ' + chain)
  }

  if (!chainConfig.explorerApi) {
    throw new Error('Missing explorerApi for chain: ' + chain)
  }

  const enabled = flags.isEnabled('tvl', chain)
  if (!enabled) {
    return { chain }
  }

  const ENV_NAME = chain.toUpperCase()
  return {
    chain,
    config: {
      projectId,
      chainId: ChainId(chainConfig.chainId),
      providerUrl: env.string([
        `${ENV_NAME}_RPC_URL_FOR_TVL`,
        `${ENV_NAME}_RPC_URL`,
      ]),
      providerCallsPerMinute: env.integer(
        [
          `${ENV_NAME}_RPC_CALLS_PER_MINUTE_FOR_TVL`,
          `${ENV_NAME}_RPC_CALLS_PER_MINUTE`,
        ],
        DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
      blockNumberProviderConfig:
        chainConfig.explorerApi.type === 'etherscan'
          ? {
              type: chainConfig.explorerApi.type,
              etherscanApiKey: env.string([
                `${ENV_NAME}_ETHERSCAN_API_KEY_FOR_TVL`,
                `${ENV_NAME}_ETHERSCAN_API_KEY`,
              ]),
              etherscanApiUrl: chainConfig.explorerApi.url,
            }
          : {
              type: chainConfig.explorerApi.type,
              blockscoutApiUrl: chainConfig.explorerApi.url,
            },
      minBlockTimestamp:
        options?.minTimestamp ?? chainConfig.minTimestampForTvl,
      multicallConfig: (chainConfig.multicallContracts ?? []).map(
        toMulticallConfigEntry,
      ),
    },
  }
}
