import { getEnv } from '@l2beat/backend-tools'

import { chains } from './chains'
import type { DiscoveryChainConfig } from './types'

export function getChainShortName(chain: string) {
  const chainConfig = chains.find((c) => c.name === chain)
  if (!chainConfig) {
    throw new Error(`No config for chain: ${chain}`)
  }
  return chainConfig.shortName
}

export function getChainFullName(shortName: string) {
  const chainConfig = chains.find((c) => c.shortName === shortName)
  if (!chainConfig) {
    throw new Error(`No config for chain: ${shortName}`)
  }
  return chainConfig.name
}

export function getChainConfigs(): DiscoveryChainConfig[] {
  return chains.flatMap((chain) => {
    try {
      return [getChainConfig(chain.name)]
    } catch {
      return []
    }
  })
}

export function getChainConfig(chain: string): DiscoveryChainConfig {
  const env = getEnv()

  const chainConfig = chains.find((c) => c.name === chain)
  if (!chainConfig) {
    throw new Error(`No config for chain: ${chain}`)
  }

  const ENV_NAME = chainConfig.name.toUpperCase()
  return {
    name: chainConfig.name,
    chainId: chainConfig.chainId,
    rpcUrl: env.string([
      `${ENV_NAME}_RPC_URL_FOR_DISCOVERY`,
      `${ENV_NAME}_RPC_URL`,
      //support for legacy local configs
      `DISCOVERY_${ENV_NAME}_RPC_URL`,
    ]),
    eventRpcUrl: env.optionalString(`${ENV_NAME}_EVENT_RPC_URL_FOR_DISCOVERY`),
    beaconApiUrl: env.optionalString([
      `${ENV_NAME}_BEACON_API_URL_FOR_DISCOVERY`,
      `${ENV_NAME}_BEACON_API_URL`,
    ]),
    reorgSafeDepth: env.optionalInteger([
      `${ENV_NAME}_REORG_SAFE_DEPTH_FOR_DISCOVERY`,
      `${ENV_NAME}_REORG_SAFE_DEPTH`,
    ]),
    multicall: chainConfig.multicall,
    explorer:
      chainConfig.explorer.type === 'blockscout'
        ? {
            type: chainConfig.explorer.type,
            url: chainConfig.explorer.url,
            unsupported: chainConfig.explorer.unsupported,
          }
        : {
            type: chainConfig.explorer.type,
            url: chainConfig.explorer.url,
            apiKey: env.string([
              `${ENV_NAME}_ETHERSCAN_API_KEY_FOR_DISCOVERY`,
              `${ENV_NAME}_ETHERSCAN_API_KEY`,
              //support for legacy local configs
              `DISCOVERY_${ENV_NAME}_ETHERSCAN_API_KEY`,
            ]),
            unsupported: chainConfig.explorer.unsupported,
          },
  }
}
