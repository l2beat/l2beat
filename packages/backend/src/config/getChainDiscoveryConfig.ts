import { Env } from '@l2beat/backend-tools'
import { chainsByDevId } from '@l2beat/config'
import { getMulticall3Config } from '@l2beat/discovery'

import { UpdateMonitorChainConfig } from './Config'

export function getChainDiscoveryConfig(
  env: Env,
  devId: string,
): UpdateMonitorChainConfig {
  const chain = chainsByDevId.get(devId)
  if (!chain) {
    throw new Error('Unknown chain: ' + devId)
  }

  const multicallV3 = chain.multicallContracts?.find((x) => x.version === '3')
  if (!multicallV3) {
    throw new Error('Missing multicallV3 for chain: ' + devId)
  }

  if (!chain.explorerApi) {
    throw new Error('Missing explorerApi for chain: ' + devId)
  }

  if (chain.explorerApi.type !== 'etherscan') {
    throw new Error('Only etherscan explorerApi is supported: ' + devId)
  }

  const ENV_NAME = devId.toUpperCase()

  return {
    chain: chain.devId,
    rpcUrl: env.string(`DISCOVERY_${ENV_NAME}_RPC_URL`),
    rpcGetLogsMaxRange: env.optionalInteger(
      `DISCOVERY_${ENV_NAME}_RPC_GETLOGS_MAX_RANGE`,
    ),
    multicall: getMulticall3Config(
      multicallV3.sinceBlock,
      multicallV3.address,
      multicallV3.batchSize,
    ),
    etherscanApiKey: env.string(`DISCOVERY_${ENV_NAME}_ETHERSCAN_API_KEY`),
    etherscanUrl: chain.explorerApi.url,
    etherscanUnsupported: chain.explorerApi.missingFeatures,
  }
}
