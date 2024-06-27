import { Env } from '@l2beat/backend-tools'
import { chains } from '@l2beat/config'
import { DiscoveryChainConfig, getMulticall3Config } from '@l2beat/discovery'

export function getChainDiscoveryConfig(
  env: Env,
  chain: string,
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
