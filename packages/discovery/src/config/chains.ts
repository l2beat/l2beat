import { getMulticall3Config } from '../discovery/provider/multicall/MulticallConfig'
import { MulticallConfig } from '../discovery/provider/multicall/types'
import { EthereumAddress } from '../utils/EthereumAddress'

export interface ChainConfig {
  name: string
  etherscanUrl: string
  multicall: MulticallConfig
  etherscanUnsupported?: {
    getContractCreation?: boolean
  }
}

export const chains: ChainConfig[] = [
  {
    name: 'ethereum',
    multicall: getMulticall3Config(14353601),
    etherscanUrl: 'https://api.etherscan.io/api',
  },
  {
    name: 'arbitrum',
    multicall: getMulticall3Config(7654707),
    etherscanUrl: 'https://api.arbiscan.io/api',
  },
  {
    name: 'optimism',
    multicall: getMulticall3Config(4286263),
    etherscanUrl: 'https://api-optimistic.etherscan.io/api',
  },
  {
    name: 'polygonpos',
    multicall: getMulticall3Config(25770160),
    etherscanUrl: 'https://api.polygonscan.com/api',
  },
  {
    name: 'bsc',
    multicall: getMulticall3Config(15921452),
    etherscanUrl: 'https://api.bscscan.com/api',
  },
  {
    name: 'avalanche',
    multicall: getMulticall3Config(11907934),
    etherscanUrl: 'https://api.snowtrace.io/api',
  },
  {
    name: 'celo',
    multicall: getMulticall3Config(13112599),
    etherscanUrl: 'https://api.celoscan.io/api',
    etherscanUnsupported: {
      getContractCreation: true,
    },
  },
  {
    name: 'linea',
    multicall: getMulticall3Config(42),
    etherscanUrl: 'https://api.lineascan.build/api',
  },
  {
    name: 'base',
    multicall: getMulticall3Config(5022),
    etherscanUrl: 'https://api.basescan.org/api',
  },
  {
    name: 'polygonzkevm',
    multicall: getMulticall3Config(57746),
    etherscanUrl: 'https://api-zkevm.polygonscan.com/api',
  },
  {
    name: 'gnosis',
    multicall: getMulticall3Config(21022491),
    etherscanUrl: 'https://api.gnosisscan.io/api',
    etherscanUnsupported: {
      getContractCreation: true,
    },
  },
  {
    name: 'zksync2',
    multicall: getMulticall3Config(
      3908235,
      EthereumAddress('0xF9cda624FBC7e059355ce98a31693d299FACd963'),
    ),
    etherscanUrl: 'https://api-era.zksync.network/api',
  },

  {
    name: 'sepolia',
    multicall: getMulticall3Config(751532),
    etherscanUrl: 'https://api-sepolia.etherscan.io/api',
  },
]
