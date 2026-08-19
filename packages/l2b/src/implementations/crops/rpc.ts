import type { AttestationNetworkConfig } from '@l2beat/config/build/crops/eas'

const DEFAULT_RPCS: Record<string, string> = {
  sepolia: 'https://ethereum-sepolia-rpc.publicnode.com',
  ethereum: 'https://ethereum-rpc.publicnode.com',
}

export function defaultRpcUrl(network: AttestationNetworkConfig): string {
  const url = DEFAULT_RPCS[network.name]
  if (!url) {
    throw new Error(
      `No default rpc for ${network.name}; pass --rpc-url or set L2B_CROPS_RPC_URL.`,
    )
  }
  return url
}
