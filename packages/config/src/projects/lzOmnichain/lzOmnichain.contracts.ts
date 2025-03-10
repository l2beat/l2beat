import {
  assert,
  EthereumAddress,
  UnixTime,
  assertUnreachable,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

interface LzTokenEscrow {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  tokens: [string]
  type: 'oft' | 'wrapped oft'
}

const escrows: LzTokenEscrow[] = [
  {
    address: EthereumAddress('0x7122985656e38BDC0302Db86685bb972b145bD3C'),
    sinceTimestamp: UnixTime(1700658000),
    tokens: ['STONE'],
    type: 'oft',
  },
  {
    address: EthereumAddress('0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6'),
    sinceTimestamp: UnixTime(1647504559),
    tokens: ['STG'],
    type: 'oft',
  },
  {
    address: EthereumAddress('0x92cc36d66e9d739d50673d1f27929a371fb83a67'),
    sinceTimestamp: UnixTime(1695376800),
    tokens: ['WAGMI'],
    type: 'oft',
  },
  {
    address: EthereumAddress('0x4fa745fccc04555f2afa8874cd23961636cdf982'),
    sinceTimestamp: UnixTime(1657699079),
    tokens: ['EURA'],
    type: 'wrapped oft',
  },
  {
    address: EthereumAddress('0xee381e476b4335b8584a2026f3e845edac2c69de'),
    sinceTimestamp: UnixTime(1663802015),
    tokens: ['LINK'],
    type: 'wrapped oft',
  },
  {
    address: EthereumAddress('0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E'),
    sinceTimestamp: UnixTime(1665428735),
    tokens: ['USDC'],
    type: 'wrapped oft',
  },
  {
    address: EthereumAddress('0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55'),
    sinceTimestamp: UnixTime(1663003197),
    tokens: ['BOBA'],
    type: 'wrapped oft',
  },
  {
    address: EthereumAddress('0xb0003eb166654f7e57c0463f8d1a438eb238c490'),
    sinceTimestamp: UnixTime(1661794745),
    tokens: ['BOBA'],
    type: 'wrapped oft',
  },
  {
    address: EthereumAddress('0x6f537839714761388b6d7ed61bc09579d5da2f41'),
    sinceTimestamp: UnixTime(1660932033),
    tokens: ['BOBA'],
    type: 'wrapped oft',
  },
]

export const OMNICHAIN_TOKENS = escrows
  .map((escrow) => getName(escrow))
  .filter((x, i, a) => a.indexOf(x) === i)

const discovery = new ProjectDiscovery('lzomnichain')

export const OMNICHAIN_ESCROWS = escrows.map((escrow) => ({
  address: escrow.address,
  sinceTimestamp: escrow.sinceTimestamp,
  tokens: escrow.tokens,
  newVersion: true,
  useContractName: true,
  contract: discovery.getContractDetails(escrow.address),
  chain: 'ethereum',
}))

function getName(escrow: LzTokenEscrow) {
  switch (escrow.type) {
    case 'oft':
      return `${escrow.tokens[0]}`
    case 'wrapped oft':
      return `Wrapped ${escrow.tokens[0]}`
    default:
      assertUnreachable(escrow.type)
  }
}

const inactiveChainIds = ['2', '12']
interface AppConfig {
  relayer: string
  oracle: string
}
const defaultAppConfigs = discovery.getContractValue(
  'UltraLightNodeV2',
  'defaultAppConfig',
) as unknown as Partial<Record<string, AppConfig>>

const relevantAppConfigs = Object.fromEntries(
  Object.entries(defaultAppConfigs).filter(
    ([key]) => !inactiveChainIds.includes(key),
  ),
)

export const RELAYERS = Object.values(relevantAppConfigs)
  .flatMap((x) => (x ? EthereumAddress(x.relayer) : []))
  .filter((x, i, a) => a.indexOf(x) === i)

assert(
  RELAYERS.length === 1,
  'Expected exactly one relayer. Please update the project contracts section.',
)

export const ORACLES = Object.values(relevantAppConfigs)
  .flatMap((x) => (x ? EthereumAddress(x.oracle) : []))
  .filter((x, i, a) => a.indexOf(x) === i)

const inboundProofLibraries = discovery.getContractValue<
  Partial<Record<string, string[] | string>>
>('UltraLightNodeV2', 'inboundProofLibrary')

export const INBOUND_PROOF_LIBRARIES = Object.values(inboundProofLibraries)
  .flatMap((x) => x ?? [])
  .filter((x, i, a) => a.indexOf(x) === i)
  .map((address) => EthereumAddress(address))
