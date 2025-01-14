import type { ChainId } from '@/chains'

const API_URLS: Map<ChainId, string> = new Map([
  ['alephzero', 'https://rpc.alephzero-testnet.gelato.digital'],
  ['arbitrum', 'https://arbitrum-one.publicnode.com'],
  ['base', 'https://mainnet.base.org'],
  ['blast', 'https://rpc.blast.io/'],
  ['ethereum', 'https://ethereum-rpc.publicnode.com'],
  ['gravity', 'https://rpc.gravity.xyz'],
  ['linea', 'https://linea-rpc.publicnode.com'],
  ['lyra', 'https://rpc.lyra.finance'],
  ['mantle', 'https://rpc.mantle.xyz'],
  ['nova', 'https://nova.arbitrum.io/rpc'],
  ['optimism', 'https://mainnet.optimism.io'],
  ['polygonpos', 'https://polygon-rpc.com/'],
  ['polynomial', 'https://rpc.polynomial.fi'],
  ['scroll', 'https://rpc.scroll.io'],
  ['silicon', 'https://rpc.silicon.network'],
  ['starknet', 'https://starknet-mainnet.public.blastapi.io'],
  ['taiko', 'https://rpc.taiko.xyz'],
  ['worldchain', 'https://worldchain-mainnet.g.alchemy.com/public'],
  ['xai', 'https://xai-chain.net/rpc'],
  ['zircuit', 'https://zircuit1-mainnet.p2pify.com'],
  ['zksync-era', 'https://mainnet.era.zksync.io'],
  ['zora', 'https://rpc.zora.energy'],
])

const SCAN_URLS: Map<ChainId, string> = new Map([
  ['arbitrum', 'https://api.arbiscan.io'],
  ['base', 'https://api.basescan.org'],
  ['ethereum', 'https://api.etherscan.io'],
  ['linea', 'https://api.lineascan.build'],
  ['nova', 'https://api-nova.arbiscan.io'],
  ['optimism', 'https://api.optimism.io'],
  ['polygonpos', 'https://api.polygonscan.com'],
  ['taiko', 'https://api.taikoscan.io'],
  ['worldchain', 'https://api.worldscan.org'],
  ['xai', 'https://api.xaiscan.io'],
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
