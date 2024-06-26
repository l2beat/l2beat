import { EthereumAddress } from '@l2beat/shared-pure'

import { getMulticall3Config } from '../discovery/provider/multicall/MulticallConfig'
import { MulticallConfig } from '../discovery/provider/multicall/types'

export interface ChainConfig {
  name: string
  chainId: number
  etherscanUrl: string
  multicall: MulticallConfig
  etherscanUnsupported?: {
    getContractCreation?: boolean
  }
}

export const chains: ChainConfig[] = [
  {
    name: 'ethereum',
    chainId: 1,
    multicall: getMulticall3Config(14353601),
    etherscanUrl: 'https://api.etherscan.io/api',
  },
  {
    name: 'arbitrum',
    chainId: 42161,
    multicall: getMulticall3Config(7654707),
    etherscanUrl: 'https://api.arbiscan.io/api',
  },
  {
    name: 'optimism',
    chainId: 10,
    multicall: getMulticall3Config(4286263),
    etherscanUrl: 'https://api-optimistic.etherscan.io/api',
  },
  {
    name: 'polygonpos',
    chainId: 137,
    multicall: getMulticall3Config(25770160),
    etherscanUrl: 'https://api.polygonscan.com/api',
  },
  {
    name: 'bsc',
    chainId: 56,
    multicall: getMulticall3Config(15921452),
    etherscanUrl: 'https://api.bscscan.com/api',
  },
  {
    name: 'avalanche',
    chainId: 43114,
    multicall: getMulticall3Config(11907934),
    etherscanUrl: 'https://api.snowtrace.io/api',
  },
  {
    name: 'celo',
    chainId: 42220,
    multicall: getMulticall3Config(13112599),
    etherscanUrl: 'https://api.celoscan.io/api',
    etherscanUnsupported: {
      getContractCreation: true,
    },
  },
  {
    name: 'linea',
    chainId: 59144,
    multicall: getMulticall3Config(42),
    etherscanUrl: 'https://api.lineascan.build/api',
  },
  {
    name: 'base',
    chainId: 8453,
    multicall: getMulticall3Config(5022),
    etherscanUrl: 'https://api.basescan.org/api',
  },
  {
    name: 'polygonzkevm',
    chainId: 1101,
    multicall: getMulticall3Config(57746),
    etherscanUrl: 'https://api-zkevm.polygonscan.com/api',
  },
  {
    name: 'gnosis',
    chainId: 100,
    multicall: getMulticall3Config(21022491),
    etherscanUrl: 'https://api.gnosisscan.io/api',
    etherscanUnsupported: {
      getContractCreation: true,
    },
  },
  {
    name: 'zksync2',
    chainId: 324,
    multicall: getMulticall3Config(
      3908235,
      EthereumAddress('0xF9cda624FBC7e059355ce98a31693d299FACd963'),
    ),
    etherscanUrl: 'https://api-era.zksync.network/api',
  },
  {
    name: 'sepolia',
    chainId: 11155111,
    multicall: getMulticall3Config(751532),
    etherscanUrl: 'https://api-sepolia.etherscan.io/api',
  },
  {
    name: 'scroll',
    chainId: 534352,
    multicall: getMulticall3Config(14),
    etherscanUrl: 'https://api.scrollscan.com/api',
  },
  {
    name: 'mantle',
    chainId: 5000,
    multicall: getMulticall3Config(304717),
    etherscanUrl:
      'https://api.routescan.io/v2/network/mainnet/evm/5000/etherscan/api',
  },
  {
    name: 'metis',
    chainId: 1088,
    multicall: getMulticall3Config(2338552),
    etherscanUrl:
      'https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan/api',
  },
  {
    name: 'bobanetwork',
    chainId: 288,
    multicall: getMulticall3Config(446859),
    etherscanUrl:
      'https://api.routescan.io/v2/network/mainnet/evm/288/etherscan/api',
  },
  {
    name: 'mode',
    chainId: 34443,
    multicall: getMulticall3Config(2465882),
    etherscanUrl:
      'https://api.routescan.io/v2/network/mainnet/evm/34443/etherscan/api',
  },
  {
    name: 'mantapacific',
    chainId: 169,
    multicall: getMulticall3Config(332890),
    etherscanUrl: 'https://pacific-explorer.manta.network/api',
  },
]
