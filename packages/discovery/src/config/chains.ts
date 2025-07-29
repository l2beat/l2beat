import { EthereumAddress } from '@l2beat/shared-pure'

import { getMulticall3Config } from '../discovery/provider/multicall/MulticallConfig'
import type { MulticallConfig } from '../discovery/provider/multicall/types'
import type { EtherscanUnsupportedMethods } from '../utils/IEtherscanClient'

interface ChainConfig {
  name: string
  chainId: number
  // See: https://github.com/safe-global/safe-core-sdk/blob/9b64da33bc55615349d527909d4b792e05bb9826/packages/protocol-kit/src/utils/eip-3770/config.ts
  shortName: string
  explorer:
    | {
        type: 'etherscan' | 'blockscout' | 'routescan'
        url: string
        unsupported?: EtherscanUnsupportedMethods
      }
    | {
        type: 'sourcify'
        chainId: number
      }
  multicall: MulticallConfig | undefined
  coingeckoPlatform?: string
}

export const chains: ChainConfig[] = [
  {
    name: 'ethereum',
    chainId: 1,
    shortName: 'eth',
    multicall: getMulticall3Config(14353601),
    explorer: {
      type: 'etherscan',
      url: 'https://api.etherscan.io/api',
    },
    coingeckoPlatform: 'ethereum',
  },
  {
    name: 'arbitrum',
    chainId: 42161,
    shortName: 'arb1',
    multicall: getMulticall3Config(7654707),
    explorer: {
      type: 'etherscan',
      url: 'https://api.arbiscan.io/api',
    },
    coingeckoPlatform: 'arbitrum-one',
  },
  {
    name: 'nova',
    chainId: 42170,
    shortName: 'arb-nova',
    multicall: getMulticall3Config(1746963),
    explorer: {
      type: 'etherscan',
      url: 'https://api-nova.arbiscan.io/api',
    },
    coingeckoPlatform: 'arbitrum-nova',
  },
  {
    name: 'optimism',
    chainId: 10,
    shortName: 'oeth',
    multicall: getMulticall3Config(4286263),
    explorer: {
      type: 'etherscan',
      url: 'https://api-optimistic.etherscan.io/api',
    },
    coingeckoPlatform: 'optimistic-ethereum',
  },
  {
    name: 'polygonpos',
    chainId: 137,
    shortName: 'matic',
    multicall: getMulticall3Config(25770160),
    explorer: {
      type: 'etherscan',
      url: 'https://api.polygonscan.com/api',
    },
  },
  {
    name: 'bsc',
    chainId: 56,
    shortName: 'bnb',
    multicall: getMulticall3Config(15921452),
    explorer: {
      type: 'etherscan',
      url: 'https://api.bscscan.com/api',
    },
  },
  {
    name: 'avalanche',
    chainId: 43114,
    shortName: 'avax',
    multicall: getMulticall3Config(11907934),
    explorer: {
      type: 'etherscan',
      url: 'https://api.snowtrace.io/api',
    },
  },
  {
    name: 'celo',
    chainId: 42220,
    shortName: 'celo',
    multicall: getMulticall3Config(13112599),
    explorer: {
      type: 'etherscan',
      url: 'https://api.celoscan.io/api',
      unsupported: {
        getContractCreation: true,
      },
    },
    coingeckoPlatform: 'celo',
  },
  {
    name: 'linea',
    chainId: 59144,
    shortName: 'linea',
    multicall: getMulticall3Config(42),
    explorer: {
      type: 'etherscan',
      url: 'https://api.lineascan.build/api',
    },
    coingeckoPlatform: 'linea',
  },
  {
    name: 'base',
    chainId: 8453,
    shortName: 'base',
    multicall: getMulticall3Config(5022),
    explorer: {
      type: 'etherscan',
      url: 'https://api.basescan.org/api',
    },
    coingeckoPlatform: 'base',
  },
  {
    name: 'polygonzkevm',
    chainId: 1101,
    shortName: 'zkevm',
    multicall: getMulticall3Config(57746),
    explorer: {
      type: 'etherscan',
      url: 'https://api-zkevm.polygonscan.com/api',
    },
  },
  {
    name: 'gnosis',
    chainId: 100,
    shortName: 'gno',
    multicall: getMulticall3Config(21022491),
    explorer: {
      type: 'etherscan',
      url: 'https://api.gnosisscan.io/api',
      unsupported: {
        getContractCreation: true,
      },
    },
  },
  {
    name: 'zksync2',
    chainId: 324,
    shortName: 'zksync',
    multicall: getMulticall3Config(
      3908235,
      EthereumAddress('0xF9cda624FBC7e059355ce98a31693d299FACd963'),
    ),
    explorer: {
      type: 'etherscan',
      url: 'https://api-era.zksync.network/api',
    },
    coingeckoPlatform: 'zksync',
  },
  {
    name: 'sepolia',
    chainId: 11155111,
    shortName: 'sep',
    multicall: getMulticall3Config(751532),
    explorer: {
      type: 'etherscan',
      url: 'https://api-sepolia.etherscan.io/api',
    },
  },
  {
    name: 'scroll',
    chainId: 534352,
    shortName: 'scr',
    multicall: getMulticall3Config(14),
    explorer: {
      type: 'etherscan',
      url: 'https://api.scrollscan.com/api',
    },
    coingeckoPlatform: 'scroll',
  },
  {
    name: 'mantle',
    chainId: 5000,
    shortName: 'mantle',
    multicall: getMulticall3Config(304717),
    explorer: {
      type: 'blockscout',
      url: 'https://explorer.mantle.xyz/api',
    },
    coingeckoPlatform: 'mantle',
  },
  {
    name: 'metis',
    chainId: 1088,
    shortName: 'metis-andromeda',
    multicall: getMulticall3Config(2338552),
    explorer: {
      type: 'routescan',
      url: 'https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan/api',
    },
    coingeckoPlatform: 'metis',
  },
  {
    name: 'bobanetwork',
    chainId: 288,
    shortName: 'boba',
    multicall: getMulticall3Config(446859),
    explorer: {
      type: 'routescan',
      url: 'https://api.routescan.io/v2/network/mainnet/evm/288/etherscan/api',
    },
    coingeckoPlatform: 'boba',
  },
  {
    name: 'mode',
    chainId: 34443,
    shortName: 'mode',
    multicall: getMulticall3Config(2465882),
    explorer: {
      type: 'routescan',
      url: 'https://api.routescan.io/v2/network/mainnet/evm/34443/etherscan/api',
    },
    coingeckoPlatform: 'mode',
  },
  {
    name: 'zora',
    chainId: 7777777,
    shortName: 'zora',
    multicall: getMulticall3Config(5882),
    explorer: {
      type: 'blockscout',
      url: 'https://explorer.zora.energy/api',
    },
    coingeckoPlatform: 'zora',
  },
  {
    name: 'mantapacific',
    chainId: 169,
    shortName: 'manta',
    multicall: getMulticall3Config(332890),
    explorer: {
      type: 'blockscout',
      url: 'https://pacific-explorer.manta.network/api',
    },
    coingeckoPlatform: 'manta',
  },
  {
    name: 'blast',
    chainId: 81457,
    shortName: 'blastmainnet',
    multicall: getMulticall3Config(88189),
    explorer: {
      type: 'etherscan',
      url: 'https://api.blastscan.io/api',
    },
    coingeckoPlatform: 'blast',
  },
  {
    name: 'kinto',
    chainId: 7887,
    shortName: 'kinto',
    multicall: getMulticall3Config(
      218560,
      EthereumAddress('0x2cc0188fA85FD8Ce748C7Df6066873fdcfaD95e9'),
    ),
    explorer: {
      type: 'blockscout',
      url: 'https://explorer.kinto.xyz/api',
    },
  },
  {
    name: 'unichain',
    chainId: 130,
    shortName: 'unichain',
    multicall: getMulticall3Config(8000000),
    explorer: {
      type: 'etherscan',
      url: 'https://api.uniscan.xyz/api',
    },
    coingeckoPlatform: 'unichain',
  },
  {
    name: 'ink',
    chainId: 57073,
    shortName: 'ink',
    multicall: getMulticall3Config(
      1,
      EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
    ),
    explorer: {
      type: 'blockscout',
      url: 'https://explorer.inkonchain.com/api',
    },
    coingeckoPlatform: 'ink',
  },
  {
    name: 'everclear',
    chainId: 25327,
    shortName: 'everclear',
    multicall: undefined,
    explorer: {
      type: 'blockscout',
      url: 'https://scan.everclear.org/api',
    },
  },
  {
    name: 'zircuit',
    chainId: 48900,
    shortName: 'zircuit',
    multicall: undefined,
    explorer: {
      type: 'sourcify',
      chainId: 48900,
    },
    coingeckoPlatform: 'zircuit',
  },
  {
    name: 'katana',
    chainId: 747474,
    shortName: 'katana',
    multicall: undefined,
    explorer: {
      type: 'blockscout',
      url: 'https://explorer.katanarpc.com/api',
    },
    coingeckoPlatform: 'katana',
  },
  {
    name: 'gateway',
    chainId: 9075,
    shortName: 'gateway',
    multicall: undefined,
    explorer: {
      type: 'routescan',
      url: 'https://block-explorer-api.era-gateway-mainnet.zksync.dev/api',
    },
  },
] as const satisfies ChainConfig[]
