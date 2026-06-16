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

// Swift v1 used a single contract for source and destination operations.
export const MAYAN_SWIFT_V1_CONTRACT = MAYAN_PROTOCOLS.mayanSwift

// Swift v2 splits source and destination responsibilities. Mayan deploys the
// same source address and the same destination address on every supported EVM.
export const MAYAN_SWIFT_V2_SOURCE_CONTRACT = EthereumAddress(
  '0x40fFE85A28DC9993541449464d7529a922142960',
)
export const MAYAN_SWIFT_V2_DESTINATION_CONTRACT = EthereumAddress(
  '0xD78D199f8C402e7B5Cc2abE278dF0412400a3BAe',
)

export const MAYAN_SWIFT_SOURCE_CONTRACTS = [
  MAYAN_SWIFT_V1_CONTRACT,
  MAYAN_SWIFT_V2_SOURCE_CONTRACT,
] as const

export const MAYAN_SWIFT_DESTINATION_CONTRACTS = [
  MAYAN_SWIFT_V1_CONTRACT,
  MAYAN_SWIFT_V2_DESTINATION_CONTRACT,
] as const

export const MAYAN_SWIFT_SETTLEMENT_SENDERS = MAYAN_SWIFT_DESTINATION_CONTRACTS

interface MayanChainConfig {
  chain: string
  wormholeChainId: number
  evmContracts?: true
  fastMctp?: true
  wrappedNative?: EthereumAddressValue
}

// chainconfeeg
// Keep this table aligned with Mayan contract-address docs. The IDs are
// Wormhole chain IDs, including Mayan-observed non-EVM destinations.
const MAYAN_CHAINS: MayanChainConfig[] = [
  { chain: 'solana', wormholeChainId: 1 },
  {
    chain: 'ethereum',
    wormholeChainId: 2,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    ),
  },
  {
    chain: 'bsc',
    wormholeChainId: 4,
    evmContracts: true,
    wrappedNative: EthereumAddress(
      '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    ),
  },
  {
    chain: 'polygonpos',
    wormholeChainId: 5,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    ),
  },
  {
    chain: 'avalanche',
    wormholeChainId: 6,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    ),
  },
  { chain: 'algorand', wormholeChainId: 8 },
  { chain: 'sui', wormholeChainId: 21 },
  {
    chain: 'arbitrum',
    wormholeChainId: 23,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    ),
  },
  {
    chain: 'optimism',
    wormholeChainId: 24,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0x4200000000000000000000000000000000000006',
    ),
  },
  {
    chain: 'base',
    wormholeChainId: 30,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0x4200000000000000000000000000000000000006',
    ),
  },
  {
    chain: 'linea',
    wormholeChainId: 38,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
    ),
  },
  {
    chain: 'unichain',
    wormholeChainId: 44,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0x4200000000000000000000000000000000000006',
    ),
  },
  {
    chain: 'hyperevm',
    wormholeChainId: 47,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0x5555555555555555555555555555555555555555',
    ),
  },
  {
    chain: 'monad',
    wormholeChainId: 48,
    evmContracts: true,
    fastMctp: true,
    wrappedNative: EthereumAddress(
      '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A',
    ),
  },
]

export function isMayanSwiftSettlementSender(
  sender: EthereumAddressValue,
): boolean {
  return (
    MAYAN_SWIFT_SETTLEMENT_SENDERS as readonly EthereumAddressValue[]
  ).includes(sender)
}

export function isMayanSwiftProtocolAddress(
  address: EthereumAddressValue,
): boolean {
  return (
    (MAYAN_SWIFT_SOURCE_CONTRACTS as readonly EthereumAddressValue[]).includes(
      address,
    ) ||
    (
      MAYAN_SWIFT_DESTINATION_CONTRACTS as readonly EthereumAddressValue[]
    ).includes(address)
  )
}

// Chains where Mayan contracts are deployed
// https://docs.mayan.finance/integration/forwarder-contract
export const MAYAN_EVM_CHAINS = MAYAN_CHAINS.filter(
  (chain) => chain.evmContracts,
).map((chain) => chain.chain)

// Fast MCTP is not deployed on BSC.
export const MAYAN_FAST_MCTP_CHAINS = MAYAN_CHAINS.filter(
  (chain) => chain.fastMctp,
).map((chain) => chain.chain)

export const MAYAN_WRAPPED_NATIVE_ADDRESSES: Record<
  string,
  EthereumAddressValue
> = Object.fromEntries(
  MAYAN_CHAINS.flatMap((chain) =>
    chain.wrappedNative ? [[chain.chain, chain.wrappedNative]] : [],
  ),
)

const MAYAN_CHAIN_BY_WORMHOLE_ID = new Map(
  MAYAN_CHAINS.map((chain) => [chain.wormholeChainId, chain.chain]),
)

export function findMayanWormholeChain(
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
  wormholeChainId: number,
): string {
  return (
    wormholeNetworks.find((n) => n.wormholeChainId === wormholeChainId)
      ?.chain ??
    MAYAN_CHAIN_BY_WORMHOLE_ID.get(wormholeChainId) ??
    `Unknown_${wormholeChainId}`
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

export function toChainSpecificAddressesForMany(
  chains: readonly string[],
  addresses: readonly EthereumAddressValue[],
): ChainSpecificAddress[] {
  return addresses.flatMap((address) =>
    toChainSpecificAddresses(chains, address),
  )
}
