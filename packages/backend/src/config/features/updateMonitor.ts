import type { Env } from '@l2beat/backend-tools'
import type { ChainConfig } from '@l2beat/config'
import {
  type DiscoveryChainConfig,
  getMulticall3Config,
} from '@l2beat/discovery'

export function getChainDiscoveryConfig(
  env: Env,
  chain: string,
  chains: ChainConfig[],
): DiscoveryChainConfig {
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

  const ENV_NAME = chain.toUpperCase()

  return {
    name: chainConfig.name,
    chainId: chainConfig.chainId,
    rpcUrl: env.string([
      `${ENV_NAME}_RPC_URL_FOR_DISCOVERY`,
      `${ENV_NAME}_RPC_URL`,
    ]),
    eventRpcUrl: env.optionalString(`${ENV_NAME}_EVENT_RPC_URL_FOR_DISCOVERY`),
    reorgSafeDepth: env.optionalInteger([
      `${ENV_NAME}_REORG_SAFE_DEPTH_FOR_DISCOVERY`,
      `${ENV_NAME}_REORG_SAFE_DEPTH`,
    ]),
    beaconApiUrl: env.optionalString([
      'ETHEREUM_BEACON_API_URL_FOR_DISCOVERY',
      'ETHEREUM_BEACON_API_URL',
    ]),
    multicall: getMulticall3Config(
      multicallV3.sinceBlock,
      multicallV3.address,
      multicallV3.batchSize,
    ),
    explorer:
      chainConfig.explorerApi.type === 'blockscout'
        ? {
            type: chainConfig.explorerApi.type,
            url: chainConfig.explorerApi.url,
            unsupported: chainConfig.explorerApi.missingFeatures,
          }
        : {
            type: chainConfig.explorerApi.type,
            url: chainConfig.explorerApi.url,
            apiKey: env.string([
              `${ENV_NAME}_ETHERSCAN_API_KEY_FOR_DISCOVERY`,
              `${ENV_NAME}_ETHERSCAN_API_KEY`,
            ]),
            unsupported: chainConfig.explorerApi.missingFeatures,
          },
  }
}
