import { EthereumAddress } from '@l2beat/shared-pure'
import { defineNetworks } from '../types'

export interface GasZipNetwork {
  chain: string
  gaszipId: number
  chainId: number
  solver: EthereumAddress
  depositEoa: EthereumAddress
  depositContract: EthereumAddress
  customGas?: boolean
}

interface GasZipNetworkInput {
  chain: string
  gaszipId: number
  chainId: number
  solver?: EthereumAddress
  depositEoa?: EthereumAddress
  depositContract?: EthereumAddress
  customGas?: boolean
}

export const DEFAULT_DEPOSIT_EOA_ADDRESS = EthereumAddress(
  '0x391E7C679d29bD940d63be94AD22A25d25b5A604',
)
export const DEFAULT_DEPOSIT_CONTRACT_ADDRESS = EthereumAddress(
  '0x2a37D63EAdFe4b4682a3c28C1c2cD4F109Cc2762',
)
export const DEFAULT_SOLVER_EOA_ADDRESS = EthereumAddress(
  '0x8C826F795466E39acbfF1BB4eEeB759609377ba1',
)

function gasZipNetwork(input: GasZipNetworkInput): GasZipNetwork {
  return {
    solver: DEFAULT_SOLVER_EOA_ADDRESS,
    depositEoa: DEFAULT_DEPOSIT_EOA_ADDRESS,
    depositContract: DEFAULT_DEPOSIT_CONTRACT_ADDRESS,
    ...input,
  }
}

// https://dev.gas.zip/gas/chain-support/outbound
// chainconfeeg
export const GASZIP_NETWORKS = defineNetworks<GasZipNetwork>('gaszip', [
  gasZipNetwork({
    chain: 'ethereum',
    gaszipId: 255,
    chainId: 1,
    solver: EthereumAddress('0x5baBE600b9fCD5fB7b66c0611bF4896D967b23A1'),
  }),
  gasZipNetwork({
    chain: 'arbitrum',
    gaszipId: 57,
    chainId: 42161,
  }),
  gasZipNetwork({
    chain: 'base',
    gaszipId: 54,
    chainId: 8453,
  }),
  gasZipNetwork({
    chain: 'optimism',
    gaszipId: 55,
    chainId: 10,
  }),
  gasZipNetwork({
    chain: 'apechain',
    gaszipId: 296,
    chainId: 33139,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'polygonpos',
    gaszipId: 17,
    chainId: 137,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'zksync2',
    gaszipId: 51,
    chainId: 324,
    depositContract: EthereumAddress(
      '0x252fb662e4D7435D2a5DED8EC94d8932CF76C178',
    ),
  }),
  gasZipNetwork({
    chain: 'abstract',
    gaszipId: 110,
    chainId: 2741,
    depositContract: EthereumAddress(
      '0x252fb662e4D7435D2a5DED8EC94d8932CF76C178',
    ),
  }),
  gasZipNetwork({
    chain: 'katana',
    gaszipId: 485,
    chainId: 747474,
  }),
  gasZipNetwork({
    chain: 'bsc',
    gaszipId: 14,
    chainId: 56,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'celo',
    gaszipId: 21,
    chainId: 42220,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'avalanche',
    gaszipId: 15,
    chainId: 43114,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'ink',
    gaszipId: 392,
    chainId: 57073,
  }),
  gasZipNetwork({
    chain: 'linea',
    gaszipId: 59,
    chainId: 59144,
  }),
  gasZipNetwork({
    chain: 'unichain',
    gaszipId: 362,
    chainId: 130,
  }),
  gasZipNetwork({
    chain: 'hyperevm',
    gaszipId: 430,
    chainId: 999,
  }),
])

export function getChainByGaszipId(
  gaszipId: number,
): GasZipNetwork | undefined {
  return GASZIP_NETWORKS.find((n) => n.gaszipId === gaszipId)
}

export function getChainNameByGaszipId(gaszipId: number): string {
  return getChainByGaszipId(gaszipId)?.chain ?? `unknown_${gaszipId}`
}
