/**
 * In order to add a new badge, you need to:
 * - add it to the const badges object below
 * - add images to the respective folder in frontend (packages/frontend/public/images/badges)
 *
 * In order to add a new badge type, you need to:
 * - add it to the BadgeType object below & that's it
 *
 * Badges are ordered first by type, then alphabetically by display name.
 * Order of types is determined by the order in the BadgeType object.
 */

import type { Badge } from '../types'

export const BadgeType = {
  VM: 'VM',
  DA: 'DA',
  Stack: 'Stack',
  Fork: 'Fork',
  Infra: 'Infra',
  L3ParentChain: 'L3ParentChain',
  Other: 'Other',
  RaaS: 'RaaS',
} as const

export const badges = [
  // RaaS
  {
    id: 'AltLayer',
    type: BadgeType.RaaS,
    name: 'AltLayer',
    description:
      'This project was deployed via the rollup-as-a-service provider AltLayer',
    filterValue: 'AltLayer',
  },
  {
    id: 'Gateway',
    type: BadgeType.RaaS,
    name: 'Gateway',
    description:
      'This project was deployed via the rollup-as-a-service provider Gateway',
    filterValue: 'Gateway',
  },
  {
    id: 'Conduit',
    type: BadgeType.RaaS,
    name: 'Conduit',
    description:
      'This project was deployed via the rollup-as-a-service provider Conduit',
    filterValue: 'Conduit',
  },
  {
    id: 'Gelato',
    type: BadgeType.RaaS,
    name: 'Gelato',
    description:
      'This project was deployed via the rollup-as-a-service provider Gelato',
    filterValue: 'Gelato',
  },
  {
    id: 'Karnot',
    type: BadgeType.RaaS,
    name: 'Karnot',
    description:
      'This project was deployed via the rollup-as-a-service provider Karnot',
    filterValue: 'Karnot',
  },
  {
    id: 'Caldera',
    type: BadgeType.RaaS,
    name: 'Caldera',
    description:
      'This project was deployed via the rollup-as-a-service provider Caldera',
    filterValue: 'Caldera',
  },
  {
    id: 'Syndicate',
    type: BadgeType.RaaS,
    name: 'Syndicate',
    description:
      'This project was deployed via the rollup-as-a-service provider Syndicate',
    filterValue: 'Syndicate',
  },
  {
    id: 'Quicknode',
    type: BadgeType.RaaS,
    name: 'Quicknode',
    description:
      'This project was deployed via the rollup-as-a-service provider Quicknode',
    filterValue: 'Quicknode',
  },
  {
    id: 'Alchemy',
    type: BadgeType.RaaS,
    name: 'Alchemy',
    description:
      'This project was deployed via the rollup-as-a-service provider Alchemy',
    filterValue: 'Alchemy',
  },
  {
    id: 'Zeeve',
    type: BadgeType.RaaS,
    name: 'Zeeve',
    description:
      'This project was deployed via the rollup-as-a-service provider Zeeve',
    filterValue: 'Zeeve',
  },
  // DA
  {
    id: 'Avail',
    type: BadgeType.DA,
    name: 'Avail',
    description: 'This project is posting its data to Avail',
    filterValue: 'Avail',
  },
  {
    id: 'Celestia',
    type: BadgeType.DA,
    name: 'Celestia',
    description: 'This project is posting its data to Celestia',
    filterValue: 'Celestia',
  },
  {
    id: 'CelestiaBlobstream',
    type: BadgeType.DA,
    name: 'Celestia with Blobstream',
    description:
      'This project utilizes Celestia and has Blobstream enabled, facilitating the bridging of data availability commitments between Celestia and Ethereum.',
    filterValue: 'Celestia',
  },
  {
    id: 'EigenDA',
    type: BadgeType.DA,
    name: 'EigenDA',
    description: 'This project is posting its data to EigenDA',
    filterValue: 'EigenDA',
  },
  {
    id: 'NearDA',
    type: BadgeType.DA,
    name: 'NearDA',
    description: 'This project is posting its data to NearDA',
    filterValue: 'NearDA',
  },
  {
    id: 'EthereumBlobs',
    type: BadgeType.DA,
    name: 'Ethereum with blobs',
    description: 'This project is posting its data to Ethereum as blobs',
    filterValue: 'Ethereum',
  },
  {
    id: 'EthereumCalldata',
    type: BadgeType.DA,
    name: 'Ethereum with calldata',
    description: 'This project is posting its data to Ethereum as calldata',
    filterValue: 'Ethereum',
  },
  {
    id: 'CustomDA',
    type: BadgeType.DA,
    name: 'Custom DA solution',
    description: 'This project is using a custom DA solution',
    filterValue: undefined,
  },
  {
    id: 'DAC',
    type: BadgeType.DA,
    name: 'Data Availability Committee',
    description:
      'There is a Data Availability Committee that provides/attests to data availability',
    filterValue: 'DAC',
  },
  // VM
  {
    id: 'EVM',
    type: BadgeType.VM,
    name: 'EVM',
    description:
      'This project uses the Ethereum Virtual Machine to run its smart contracts and supports the Solidity programming language',
    filterValue: 'EVM',
  },
  {
    id: 'EVMLike',
    type: BadgeType.VM,
    name: 'EVM-like',
    description:
      'This project uses the Ethereum Virtual Machine variation to run its smart contracts and supports the Solidity programming language',
    filterValue: 'EVM-like',
  },
  {
    id: 'CairoVM',
    type: BadgeType.VM,
    name: 'CairoVM',
    description:
      'This project uses the Cairo Virtual Machine to run its smart contracts and supports the Cairo programming language',
    filterValue: 'CairoVM',
  },
  {
    id: 'CartesiVM',
    type: BadgeType.VM,
    name: 'CartesiVM',
    description:
      'This project uses the Cartesi Machine to run its smart contracts and supports any programming language that can be ported to RISC-V architecture',
    filterValue: 'CartesiVM',
  },
  {
    id: 'FuelVM',
    type: BadgeType.VM,
    name: 'FuelVM',
    description:
      'This project uses the Fuel Virtual Machine to run its smart contracts and supports the Sway programming language',
    filterValue: 'FuelVM',
  },
  {
    id: 'AztecVM',
    type: BadgeType.VM,
    name: 'AztecVM',
    description:
      'This project uses the Aztec Virtual Machine to run its smart contracts and supports the Noir programming language',
    filterValue: 'AztecVM',
  },
  {
    id: 'MoveVM',
    type: BadgeType.VM,
    name: 'MoveVM',
    description:
      'This project uses the Move Virtual Machine to run its smart contracts and supports the Move programming language',
    filterValue: 'MoveVM',
  },
  {
    id: 'SolanaVM',
    type: BadgeType.VM,
    name: 'SolanaVM',
    description:
      'This project uses the Solana Virtual Machine to run its smart contracts',
    filterValue: 'SolanaVM',
  },
  {
    id: 'WasmVM',
    type: BadgeType.VM,
    name: 'WasmVM',
    description:
      'This project uses a WebAssembly Virtual Machine to run its smart contracts',
    filterValue: 'WasmVM',
  },
  {
    id: 'AppChain',
    type: BadgeType.VM,
    name: 'Application-specific chain',
    description: 'This project is built to operate a specific application',
    filterValue: 'Application-specific chain',
  },
  //Infra
  {
    id: 'Superchain',
    type: BadgeType.Infra,
    name: 'Part of the Superchain',
    description:
      "The project is part of the Superchain, meaning it's included in the Superchain registry or uses the Superchain config",
    filterValue: 'Superchain',
  },
  {
    id: 'SHARP',
    type: BadgeType.Infra,
    name: 'Uses SHARP',
    description: 'The project uses a shared prover contract - SHARP',
    filterValue: 'SHARP',
  },
  {
    id: 'AggLayer',
    type: BadgeType.Infra,
    name: 'Part of the AggLayer',
    description: 'The project is part of the AggLayer',
    filterValue: 'AggLayer',
  },
  {
    id: 'ElasticChain',
    type: BadgeType.Infra,
    name: 'Part of the Elastic Chain',
    description:
      "The project is part of the Elastic Chain, meaning it's based on the ZK stack and uses the shared contracts",
    filterValue: 'Elastic Chain',
  },
  // Stack/forks
  {
    id: 'OPStack',
    type: BadgeType.Stack,
    name: 'Built on OP Stack',
    description: 'The project is built on the OP Stack',
    filterValue: 'OP Stack',
  },
  {
    id: 'Orbit',
    type: BadgeType.Stack,
    name: 'Built on Arbitrum Orbit',
    description: 'The project is built on Arbitrum Orbit',
    filterValue: 'Arbitrum',
  },
  {
    id: 'Nitro',
    type: BadgeType.Stack,
    name: 'Built on Arbitrum Nitro',
    description: 'The project is built on Arbitrum Nitro',
    filterValue: 'Arbitrum',
  },
  {
    id: 'StarkEx',
    type: BadgeType.Stack,
    name: 'StarkEx',
    description:
      'This project was deployed utilizing the StarkEx technology from StarkWare',
    filterValue: 'StarkEx',
  },
  {
    id: 'ZKStack',
    type: BadgeType.Stack,
    name: 'Built on the ZK Stack',
    description: 'The project is built on the ZK Stack',
    filterValue: 'ZK Stack',
  },
  {
    id: 'PolygonCDK',
    type: BadgeType.Stack,
    name: 'Built on the Polygon CDK stack',
    description: 'The project is built on the Polygon CDK stack',
    filterValue: 'Polygon',
  },
  {
    id: 'Cartesi',
    type: BadgeType.Stack,
    name: 'Built on the Cartesi stack',
    description: 'The project is built on the Cartesi stack',
    filterValue: 'Cartesi Rollups',
  },
  {
    id: 'SNStack',
    type: BadgeType.Stack,
    name: 'Built on the SN Stack',
    description: 'The project is built on the SN Stack',
    filterValue: 'SN Stack',
  },
  {
    id: 'LoopringFork',
    type: BadgeType.Fork,
    name: 'Fork of Loopring',
    description: 'The project is fork of Loopring',
    filterValue: 'Loopring',
  },
  {
    id: 'OVM',
    type: BadgeType.Fork,
    name: 'Fork of OVM',
    description: 'The project is fork of the Optimistic Virtual Machine',
    filterValue: 'OVM',
  },
  {
    id: 'ZKsyncLiteFork',
    type: BadgeType.Fork,
    name: 'Fork of ZKsync Lite',
    description: 'The project is fork of ZKsync Lite',
    filterValue: 'ZKsync Lite',
  },
  {
    id: 'TaikoFork',
    type: BadgeType.Fork,
    name: 'Fork of Taiko',
    description: 'The project is fork of Taiko',
    filterValue: 'Taiko',
  },
  //L3 host chains
  {
    id: 'Arbitrum',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of Arbitrum',
    description: 'The project has Arbitrum as its host chain',
    filterValue: 'Arbitrum One',
  },
  {
    id: 'Base',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of Base',
    description: 'The project has Base as its host chain',
    filterValue: 'Base',
  },
  {
    id: 'Linea',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of Linea',
    description: 'The project has Linea as its host chain',
    filterValue: 'Linea',
  },
  {
    id: 'Nova',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of Arbitrum Nova',
    description: 'The project has Arbitrum Nova as its host chain',
    filterValue: 'Arbitrum Nova',
  },
  {
    id: 'OpMainnet',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of OP Mainnet',
    description: 'The project has OP Mainnet as its host chain',
    filterValue: 'OP Mainnet',
  },
  // Other
  {
    id: 'AccountAbstraction',
    type: BadgeType.Other,
    name: 'Account Abstraction',
    description: 'This project supports account abstraction',
    filterValue: undefined,
  },
  {
    id: 'Governance',
    type: BadgeType.Other,
    name: 'Governance',
    description: 'This project features token voting',
    filterValue: undefined,
  },
  {
    id: 'L3HostChain',
    type: BadgeType.Other,
    name: 'L3 Host Chain',
    description: 'This project serves as a host chain for L3s',
    filterValue: undefined,
  },
  {
    id: 'BasedSequencing',
    type: BadgeType.Other,
    name: 'Based Sequencing',
    description:
      'This project is ordering its transactions through Ethereum block proposers',
    filterValue: undefined,
  },
  {
    id: 'EspressoPreconfs',
    type: BadgeType.Other,
    name: 'Espresso Preconfs',
    description:
      'The project integrates with Espresso preconfirmations. The chain batch poster publishes blocks to Espresso Network and runs in a Trusted Execution Environment (TEE) programmed to verify that only Espresso-validated batches reach the host chain.',
    filterValue: undefined,
  },
  {
    id: 'MigratedFromL1',
    type: BadgeType.Other,
    name: 'Migrated from L1 to Ethereum L2',
    description:
      'This project has migrated from being a standalone L1 blockchain to an Ethereum L2',
    filterValue: undefined,
  },
] as const satisfies {
  id: string
  type: keyof typeof BadgeType
  name: string
  description: string
  filterValue: string | undefined
}[]

type AnyBadge = (typeof badges)[number]

export const BADGES: {
  [T in keyof typeof BadgeType]: {
    [K in Extract<AnyBadge, { type: T }>['id']]: Badge
  }
} = badges.reduce((acc, badge) => {
  if (!acc[badge.type]) acc[badge.type] = {}
  acc[badge.type][badge.id] = badge
  return acc
  // biome-ignore lint/suspicious/noExplicitAny: it's way easier to type this as any than to do typecasting gymnastics above (trust)
}, {} as any)

export const badgeTypeOrder = Object.values<string>(BadgeType)
export const badgesCompareFn = (a: Badge, b: Badge) => {
  const typeOrder =
    badgeTypeOrder.indexOf(a.type) - badgeTypeOrder.indexOf(b.type)
  if (typeOrder !== 0) return typeOrder
  return a.name.localeCompare(b.name)
}
