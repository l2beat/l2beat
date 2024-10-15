import type { ChainId } from '@/chains'

const API_URLS: Map<ChainId, string> = new Map([
  ['starknet', 'https://starknet-mainnet.public.blastapi.io'],
  ['base', 'https://dawn-fluent-frog.base-mainnet.quiknode.pro'],
  ['ethereum', 'https://blue-small-smoke.quiknode.pro'],
  ['xai', 'https://xai-chain.net/rpc'],
  ['taiko', 'https://rpc.taiko.xyz'],
  ['arbitrum', 'https://cold-fluent-card.arbitrum-mainnet.quiknode.pro'],
  ['gravity', 'https://rpc.gravity.xyz'],
  ['optimism', 'https://icy-late-sailboat.optimism.quiknode.pro'],
])

const SCAN_URLS: Map<ChainId, string> = new Map([
  ['base', 'https://api.basescan.org'],
  ['ethereum', 'https://api.etherscan.io'],
  ['xai', 'https://api.xaiscan.io'],
  ['taiko', 'https://api.taikoscan.io'],
  ['arbitrum', 'https://api.arbiscan.io'],
  ['optimism', 'https://mainnet.optimism.io'],
])

export type ApiKeyType = 'RPC' | 'SCAN'

export function getApiUrl(chainId: ChainId): string {
  const url = API_URLS.get(chainId)

  if (!url) {
    throw new Error(`Missing API URL for chain ${chainId}`)
  }

  return url
}

export function getScanUrl(chainId: ChainId): string {
  const url = SCAN_URLS.get(chainId)

  if (!url) {
    throw new Error(`Missing SCAN URL for chain ${chainId}`)
  }

  return url
}

export function getApiKey(chainId: ChainId, type: ApiKeyType): string {
  const envName = `${chainId.toUpperCase()}_${type}_API_KEY`
  const value = process.env[envName]

  if (!value) {
    return ''
  }

  return value
}
