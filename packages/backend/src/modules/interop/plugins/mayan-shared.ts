import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  type EthereumAddress as EthereumAddressValue,
} from '@l2beat/shared-pure'

// Shared Mayan contract addresses
export const MAYAN_SWIFT = EthereumAddress(
  '0xC38e4e6A15593f908255214653d3D947CA1c2338',
)
export const MAYAN_FORWARDER = EthereumAddress(
  '0x337685fdab40d39bd02028545a4ffa7d287cc3e2',
)
export const MAYAN_CIRCLE = EthereumAddress(
  '0x875d6d37EC55c8cF220B9E5080717549d8Aa8EcA',
)
export const MAYAN_FAST_MCTP = EthereumAddress(
  '0xC1062b7C5Dc8E4b1Df9F200fe360cDc0eD6e7741',
)
const MAYAN_SWAP = EthereumAddress('0xBF5f3f65102aE745A48BD521d10BaB5BF02A9eF4')
const MAYAN_SWAP2 = EthereumAddress(
  '0x238856DE6d9d32EA3Dd4e9e7dbfe08b23cD5048c',
)

// Chains where Mayan contracts are deployed
const MAYAN_EVM_CHAINS = [
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'polygonpos',
  'bsc',
  'avalanche',
] as const

export const MAYAN_SWIFT_CHAINS = [...MAYAN_EVM_CHAINS]
export const MAYAN_FORWARDER_CHAINS = [...MAYAN_EVM_CHAINS]

export const MAYAN_FAST_MCTP_CHAINS = [
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'polygonpos',
] as const

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
}

const MAYAN_PROTOCOLS_BY_CHAIN: Record<
  string,
  Record<string, EthereumAddressValue>
> = {
  ethereum: {
    mayanSwift: MAYAN_SWIFT,
    mayanSwap: MAYAN_SWAP,
    fastMCTP: MAYAN_FAST_MCTP,
    mayanCircle: MAYAN_CIRCLE,
    mayanSwap2: MAYAN_SWAP2,
  },
  base: {
    mayanSwift: MAYAN_SWIFT,
    fastMCTP: MAYAN_FAST_MCTP,
    mayanCircle: MAYAN_CIRCLE,
    mayanSwap2: MAYAN_SWAP2,
  },
  arbitrum: {
    mayanSwift: MAYAN_SWIFT,
    fastMCTP: MAYAN_FAST_MCTP,
    mayanCircle: MAYAN_CIRCLE,
    mayanSwap2: MAYAN_SWAP2,
  },
}

const DEAD_ADDRESS = Address32.from(
  '0x000000000000000000000000000000000000dEaD',
)

export function isBurnAddress(address: Address32): boolean {
  return address === Address32.ZERO || address === DEAD_ADDRESS
}

export function decodeMayanProtocol(chain: string, protocolAddress: string) {
  const protocols = MAYAN_PROTOCOLS_BY_CHAIN[chain]
  if (!protocols) return `unknown_chain_${chain}`
  return (
    Object.entries(protocols).find(
      ([, address]) => address === protocolAddress,
    )?.[0] ?? `unknown_protocol_${protocolAddress}_on_${chain}`
  )
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
