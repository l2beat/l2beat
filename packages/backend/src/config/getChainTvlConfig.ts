import { Env } from '@l2beat/backend-tools'
import { chains, layer2s } from '@l2beat/config'
import { ChainId, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { toMulticallConfigEntry } from '../peripherals/ethereum/multicall/MulticallConfig'
import { ChainTvlConfig } from './Config'

const DEFAULT_RPC_CALLS_PER_MINUTE = 60

export function getChainTvlConfig(
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

  if (
    !chainConfig.multicallContracts ||
    chainConfig.multicallContracts.length === 0
  ) {
    throw new Error('Missing multicallContracts for chain: ' + chain)
  }

  const ENV_NAME = chain.toUpperCase()

  const enabled = env.boolean(`TVL_${ENV_NAME}_ENABLED`, false)
  if (!enabled) {
    return { chain }
  }

  return {
    chain,
    config: {
      projectId,
      chainId: ChainId(chainConfig.chainId),
      providerUrl: env.string(`TVL_${ENV_NAME}_PROVIDER_URL`),
      providerCallsPerMinute: env.integer(
        `TVL_${ENV_NAME}_RPC_CALLS_PER_MINUTE`,
        DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
      blockNumberProviderConfig:
        chainConfig.explorerApi.type === 'etherscan'
          ? {
              type: 'EtherscanLike',
              etherscanApiKey: env.string(`TVL_${ENV_NAME}_ETHERSCAN_API_KEY`),
              etherscanApiUrl: chainConfig.explorerApi.url,
            }
          : {
              type: 'RoutescanLike',
              routescanApiUrl: chainConfig.explorerApi.url,
            },
      minBlockTimestamp:
        options?.minTimestamp ?? chainConfig.minTimestampForTvl,
      multicallConfig: chainConfig.multicallContracts.map(
        toMulticallConfigEntry,
      ),
    },
  }
}
