import { EthereumAddress } from '@l2beat/shared-pure'
import { defineNetworks } from '../types'

export interface GasZipNetwork {
  chain: string
  gaszipId: number
  chainId: number
}

export const DEPOSIT_EOA_ADDRESS = EthereumAddress(
  '0x391E7C679d29bD940d63be94AD22A25d25b5A604',
)
export const DEPOSIT_CONTRACT_ADDRESS = EthereumAddress(
  '0x2a37D63EAdFe4b4682a3c28C1c2cD4F109Cc2762',
)

export const GASZIP_NETWORKS = defineNetworks<GasZipNetwork>('gaszip', [
  {
    chain: 'ethereum',
    gaszipId: 255,
    chainId: 1,
  },
  {
    chain: 'arbitrum',
    gaszipId: 57,
    chainId: 42161,
  },
  {
    chain: 'base',
    gaszipId: 54,
    chainId: 8453,
  },
  {
    chain: 'optimism',
    gaszipId: 55,
    chainId: 10,
  },
])

export function getChainByGaszipId(
  gaszipId: number,
): GasZipNetwork | undefined {
  return GASZIP_NETWORKS.find((n) => n.gaszipId === gaszipId)
}

export function getChainNameByGaszipId(gaszipId: number): string {
  return getChainByGaszipId(gaszipId)?.chain ?? `unknown_${gaszipId}`
}
