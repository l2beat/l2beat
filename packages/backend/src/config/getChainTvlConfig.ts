import { Env } from '@l2beat/backend-tools'
import { chainsByDevId } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'

import { ChainTvlConfig } from './Config'

export function getChainTvlConfig(
  env: Env,
  devId: string,
  envName: string,
  options?: {
    // TODO: phase this out and make the env variables required
    defaultCallsPerMinute?: number
    overrideMinTimestamp?: UnixTime
  },
): ChainTvlConfig | false {
  const chain = chainsByDevId.get(devId)
  if (!chain) {
    throw new Error('Unknown chain: ' + devId)
  }

  if (!chain.minTimestampForTvl) {
    throw new Error('Missing minTimestampForTvl for chain: ' + devId)
  }

  if (!chain.explorerApi) {
    throw new Error('Missing explorerApi for chain: ' + devId)
  }

  const enabled = env.boolean(`TVL_${envName}_ENABLED`, false)
  if (!enabled) {
    return false
  }

  return {
    providerUrl: env.string(`TVL_${envName}_PROVIDER_URL`),
    providerCallsPerMinute: env.integer(
      `TVL_${envName}_RPC_CALLS_PER_MINUTE`,
      options?.defaultCallsPerMinute,
    ),
    blockNumberProviderConfig:
      chain.explorerApi.type === 'etherscan'
        ? {
            type: 'EtherscanLike',
            etherscanApiKey: env.string(`TVL_${envName}_ETHERSCAN_API_KEY`),
            etherscanApiUrl: chain.explorerApi.url,
          }
        : {
            type: 'RoutescanLike',
            routescanApiUrl: chain.explorerApi.url,
          },
    minBlockTimestamp:
      options?.overrideMinTimestamp ?? chain.minTimestampForTvl,
  }
}
