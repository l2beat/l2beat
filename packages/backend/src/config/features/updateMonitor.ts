import { Env } from '@l2beat/backend-tools'
import { chains } from '@l2beat/config'
import { getMulticall3Config } from '@l2beat/discovery'

import { UpdateMonitorChainConfig } from '../Config'

export function getChainDiscoveryConfig(
  env: Env,
  chain: string,
): UpdateMonitorChainConfig {
  const chainConfig = chains.find((c) => c.name === chain)
  if (!chainConfig) {
    throw new Error('Unknown chain: ' + chain)
  }

  const multicallV3 = chainConfig.multicallContracts?.find(
    (x) => x.version === '3',
  )
  if (!multicallV3) {
    throw new Error('Missing multicallV3 for chain: ' + chain)
  }

  if (!chainConfig.explorerApi) {
    throw new Error('Missing explorerApi for chain: ' + chain)
  }

  if (chainConfig.explorerApi.type !== 'etherscan') {
    throw new Error('Only etherscan explorerApi is supported: ' + chain)
  }

  const ENV_NAME = chain.toUpperCase()

  return {
    name: chainConfig.name,
    rpcUrl: env.string([
      `${ENV_NAME}_RPC_URL_FOR_DISCOVERY`,
      `${ENV_NAME}_RPC_URL`,
    ]),
    rpcGetLogsMaxRange: env.optionalInteger([
      `${ENV_NAME}_RPC_GETLOGS_MAX_RANGE_FOR_DISCOVERY`,
      `${ENV_NAME}_RPC_GETLOGS_MAX_RANGE`,
    ]),
    multicall: getMulticall3Config(
      multicallV3.sinceBlock,
      multicallV3.address,
      multicallV3.batchSize,
    ),
    etherscanApiKey: env.string([
      `${ENV_NAME}_ETHERSCAN_API_KEY_FOR_DISCOVERY`,
      `${ENV_NAME}_ETHERSCAN_API_KEY`,
    ]),
    etherscanUrl: chainConfig.explorerApi.url,
    etherscanUnsupported: chainConfig.explorerApi.missingFeatures,
  }
}
