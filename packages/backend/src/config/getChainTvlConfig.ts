import { Env } from '@l2beat/backend-tools'
import { chains, layer2s } from '@l2beat/config'
import { ChainId, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { toMulticallConfigEntry } from '../peripherals/ethereum/multicall/MulticallConfig'
import { ChainTvlConfig } from './Config'

const DEFAULT_RPC_CALLS_PER_MINUTE = 60

export function getChainTvlConfig(
  env: Env,
  devId: string,
  options?: {
    minTimestamp?: UnixTime
  },
): ChainTvlConfig {
  const chain = chains.find((c) => c.devId === devId)
  if (!chain) {
    throw new Error('Unknown chain: ' + devId)
  }

  const projectId =
    devId === 'ethereum'
      ? ProjectId.ETHEREUM
      : layer2s.find((layer2) => layer2.chainConfig?.devId === devId)?.id
  if (!projectId) {
    throw new Error('Missing project for chain: ' + devId)
  }

  if (!chain.minTimestampForTvl) {
    throw new Error('Missing minTimestampForTvl for chain: ' + devId)
  }

  if (!chain.explorerApi) {
    throw new Error('Missing explorerApi for chain: ' + devId)
  }

  if (!chain.multicallContracts || chain.multicallContracts.length === 0) {
    throw new Error('Missing multicallContracts for chain: ' + devId)
  }

  const ENV_NAME = devId.toUpperCase()

  const enabled = env.boolean(`TVL_${ENV_NAME}_ENABLED`, false)
  if (!enabled) {
    return { devId }
  }

  return {
    devId,
    config: {
      projectId,
      chainId: ChainId(chain.chainId),
      providerUrl: env.string(`TVL_${ENV_NAME}_PROVIDER_URL`),
      providerCallsPerMinute: env.integer(
        `TVL_${ENV_NAME}_RPC_CALLS_PER_MINUTE`,
        DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
      blockNumberProviderConfig:
        chain.explorerApi.type === 'etherscan'
          ? {
              type: 'EtherscanLike',
              etherscanApiKey: env.string(`TVL_${ENV_NAME}_ETHERSCAN_API_KEY`),
              etherscanApiUrl: chain.explorerApi.url,
            }
          : {
              type: 'RoutescanLike',
              routescanApiUrl: chain.explorerApi.url,
            },
      minBlockTimestamp: options?.minTimestamp ?? chain.minTimestampForTvl,
      multicallConfig: chain.multicallContracts.map(toMulticallConfigEntry),
    },
  }
}
