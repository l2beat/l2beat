import type { ChainId } from '@/chains'

const API_URLS: Map<ChainId, string> = new Map([
  ['starknet', 'https://starknet-mainnet.public.blastapi.io'],
  ['base', 'https://mainnet.base.org'],
  ['ethereum', 'https://ethereum-rpc.publicnode.com'],
  ['xai', 'https://xai-chain.net/rpc'],
  ['taiko', 'https://rpc.taiko.xyz'],
  ['arbitrum', 'https://arbitrum-one.publicnode.com'],
  ['gravity', 'https://rpc.gravity.xyz'],
  ['optimism', 'https://mainnet.optimism.io'],
  ['zksync-era', 'https://mainnet.era.zksync.io'],
])

const SCAN_URLS: Map<ChainId, string> = new Map([
  ['base', 'https://api.basescan.org'],
  ['ethereum', 'https://api.etherscan.io'],
  ['xai', 'https://api.xaiscan.io'],
  ['taiko', 'https://api.taikoscan.io'],
  ['arbitrum', 'https://api.arbiscan.io'],
  ['optimism', 'https://mainnet.optimism.io'],
  ['zksync-era', 'https://api-era.zksync.network'],
])

export type ApiKeyType = 'RPC' | 'SCAN'

export function getApiUrl(chainId: ChainId): string {
  const url = API_URLS.get(chainId)

  if (!url) {
    throw new Error(`Missing API URL for chain ${chainId}`)
  }

  return url
}

export function getScanUrl(chainId: ChainId): string | undefined {
  const url = SCAN_URLS.get(chainId)
  return url
}

export function getApiKey(
  chainId: ChainId,
  type: ApiKeyType,
): string | undefined {
  const envName = `${chainId.toUpperCase().replace('-', '_')}_${type}_API_KEY`
  const value = process.env[envName]
  return value
}
