import {
  ChainSpecificAddress,
  EthereumAddress,
  type EthereumAddress as EthereumAddressValue,
} from '@l2beat/shared-pure'

export const MAYAN_FORWARDER = EthereumAddress(
  '0x337685fdab40d39bd02028545a4ffa7d287cc3e2',
)
export const MAYAN_PROTOCOLS = {
  mayanSwift: EthereumAddress('0xC38e4e6A15593f908255214653d3D947CA1c2338'),
  mayanSwap: EthereumAddress('0xBF5f3f65102aE745A48BD521d10BaB5BF02A9eF4'),
  fastMCTP: EthereumAddress('0xC1062b7C5Dc8E4b1Df9F200fe360cDc0eD6e7741'),
  mayanCircle: EthereumAddress('0x875d6d37EC55c8cF220B9E5080717549d8Aa8EcA'),
  mayanSwap2: EthereumAddress('0x238856DE6d9d32EA3Dd4e9e7dbfe08b23cD5048c'),
} as const satisfies Record<string, EthereumAddressValue>

// Chains where Mayan contracts are deployed
// https://docs.mayan.finance/integration/forwarder-contract
// chainconfeeg
export const MAYAN_EVM_CHAINS = [
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'polygonpos',
  'bsc',
  'avalanche',
  'unichain',
  'linea',
  // no celo
  'hyperevm',
] as const

// Fast MCTP and Circle contracts are not deployed on bsc or avalanche
export const MAYAN_FAST_MCTP_CHAINS = [
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'polygonpos',
] as const
// chainconfeeg
export const MAYAN_WRAPPED_NATIVE_ADDRESSES: Record<
  string,
  EthereumAddressValue
> = {
  ethereum: EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
  base: EthereumAddress('0x4200000000000000000000000000000000000006'),
  arbitrum: EthereumAddress('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'),
  optimism: EthereumAddress('0x4200000000000000000000000000000000000006'),
  polygonpos: EthereumAddress('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'),
  bsc: EthereumAddress('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'),
  avalanche: EthereumAddress('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'),
  unichain: EthereumAddress('0x4200000000000000000000000000000000000006'),
  linea: EthereumAddress('0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f'),
  hyperevm: EthereumAddress('0x5555555555555555555555555555555555555555'),
}

export function toChainSpecificAddresses(
  chains: readonly string[],
  address: EthereumAddressValue,
): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []
  for (const chain of chains) {
    try {
      addresses.push(ChainSpecificAddress.fromLong(chain, address))
    } catch {
      // Chain not supported by ChainSpecificAddress, skip
    }
  }
  return addresses
}
