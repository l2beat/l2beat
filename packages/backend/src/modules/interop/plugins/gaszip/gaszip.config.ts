import { EthereumAddress } from '@l2beat/shared-pure'
import { defineNetworks } from '../types'

export interface GasZipNetwork {
  chain: string
  gaszipId: number
  chainId: number
  solver: EthereumAddress
}

export const DEPOSIT_EOA_ADDRESS = EthereumAddress(
  '0x391E7C679d29bD940d63be94AD22A25d25b5A604',
)
export const DEPOSIT_CONTRACT_ADDRESS = EthereumAddress(
  '0x2a37D63EAdFe4b4682a3c28C1c2cD4F109Cc2762',
)

// https://dev.gas.zip/gas/chain-support/inbound
export const GASZIP_NETWORKS = defineNetworks<GasZipNetwork>('gaszip', [
  {
    chain: 'ethereum',
    gaszipId: 255,
    chainId: 1,
    solver: EthereumAddress('0x5baBE600b9fCD5fB7b66c0611bF4896D967b23A1'),
  },
  {
    chain: 'arbitrum',
    gaszipId: 57,
    chainId: 42161,
    solver: EthereumAddress('0x8C826F795466E39acbfF1BB4eEeB759609377ba1'),
  },
  {
    chain: 'base',
    gaszipId: 54,
    chainId: 8453,
    solver: EthereumAddress('0x8C826F795466E39acbfF1BB4eEeB759609377ba1'),
  },
  {
    chain: 'optimism',
    gaszipId: 55,
    chainId: 10,
    solver: EthereumAddress('0x8C826F795466E39acbfF1BB4eEeB759609377ba1'),
  },
  {
    chain: 'apechain',
    gaszipId: 296,
    chainId: 33139,
    solver: EthereumAddress('0x8C826F795466E39acbfF1BB4eEeB759609377ba1'),
  },
  {
    chain: 'polygonpos',
    gaszipId: 17,
    chainId: 137,
    solver: EthereumAddress('0x8C826F795466E39acbfF1BB4eEeB759609377ba1'),
  },
  {
    chain: 'zksync2',
    gaszipId: 51,
    chainId: 324,
    solver: EthereumAddress('0x8C826F795466E39acbfF1BB4eEeB759609377ba1'),
  },
  {
    chain: 'abstract',
    gaszipId: 110,
    chainId: 2741,
    solver: EthereumAddress('0x8C826F795466E39acbfF1BB4eEeB759609377ba1'),
  },
  {
    chain: 'katana',
    gaszipId: 485,
    chainId: 747474,
    solver: EthereumAddress('0x8C826F795466E39acbfF1BB4eEeB759609377ba1'),
  },
  {
    chain: 'bsc',
    gaszipId: 14,
    chainId: 56,
    solver: EthereumAddress('0x8C826F795466E39acbfF1BB4eEeB759609377ba1'),
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
