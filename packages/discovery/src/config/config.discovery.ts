import { getEnv } from '@l2beat/backend-tools'

import type { ExplorerConfig } from '../utils/IEtherscanClient'
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

export function isChainShortName(name: string): boolean {
  return chains.some((chain) => chain.shortName === name)
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
    celestiaApiUrl: env.optionalString([
      'CELESTIA_API_URL_FOR_DISCOVERY',
      'CELESTIA_API_URL',
    ]),
    reorgSafeDepth: env.optionalInteger([
      `${ENV_NAME}_REORG_SAFE_DEPTH_FOR_DISCOVERY`,
      `${ENV_NAME}_REORG_SAFE_DEPTH`,
    ]),
    coingeckoApiKey: env.optionalString([
      'COINGECKO_API_KEY_FOR_DISCOVERY',
      'COINGECKO_API_KEY',
    ]),
    multicall: chainConfig.multicall,
    explorer: ensureArray(chainConfig.explorer).map((e) =>
      e.type === 'blockscout'
        ? { type: e.type, url: e.url, unsupported: e.unsupported }
        : e.type === 'sourcify'
          ? { type: e.type, chainId: chainConfig.chainId }
          : e.type === 'etherscan'
            ? {
                type: e.type,
                chainId: chainConfig.chainId,
                url: e.customUrl ?? 'https://api.etherscan.io/v2/api',
                apiKey: e.customUrl
                  ? ''
                  : env.string([
                      'ETHERSCAN_API_KEY_FOR_DISCOVERY',
                      'ETHERSCAN_API_KEY',
                    ]),
                unsupported: e.unsupported,
              }
            : ({
                type: e.type,
                url: e.url,
                apiKey: env.string([
                  `${ENV_NAME}_ETHERSCAN_V1_API_KEY_FOR_DISCOVERY`,
                  `${ENV_NAME}_ETHERSCAN_V1_API_KEY`,
                  //support for legacy local configs
                  `DISCOVERY_${ENV_NAME}_ETHERSCAN_V1_API_KEY`,
                ]),
                unsupported: e.unsupported,
              } as ExplorerConfig),
    ),
  }
}

function ensureArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v]
}
