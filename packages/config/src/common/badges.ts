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

export type BadgeId = (typeof badges)[number]['id']
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
    filterName: 'AltLayer',
  },
  {
    id: 'Gateway',
    type: BadgeType.RaaS,
    name: 'Gateway',
    description:
      'This project was deployed via the rollup-as-a-service provider Gateway',
    filterName: 'Gateway',
  },
  {
    id: 'Conduit',
    type: BadgeType.RaaS,
    name: 'Conduit',
    description:
      'This project was deployed via the rollup-as-a-service provider Conduit',
    filterName: 'Conduit',
  },
  {
    id: 'Gelato',
    type: BadgeType.RaaS,
    name: 'Gelato',
    description:
      'This project was deployed via the rollup-as-a-service provider Gelato',
    filterName: 'Gelato',
  },
  {
    id: 'Karnot',
    type: BadgeType.RaaS,
    name: 'Karnot',
    description:
      'This project was deployed via the rollup-as-a-service provider Karnot',
    filterName: 'Karnot',
  },
  {
    id: 'Caldera',
    type: BadgeType.RaaS,
    name: 'Caldera',
    description:
      'This project was deployed via the rollup-as-a-service provider Caldera',
    filterName: 'Caldera',
  },
  {
    id: 'Syndicate',
    type: BadgeType.RaaS,
    name: 'Syndicate',
    description:
      'This project was deployed via the rollup-as-a-service provider Syndicate',
    filterName: 'Syndicate',
  },
  {
    id: 'Quicknode',
    type: BadgeType.RaaS,
    name: 'Quicknode',
    description:
      'This project was deployed via the rollup-as-a-service provider Quicknode',
    filterName: 'Quicknode',
  },
  {
    id: 'Alchemy',
    type: BadgeType.RaaS,
    name: 'Alchemy',
    description:
      'This project was deployed via the rollup-as-a-service provider Alchemy',
    filterName: 'Alchemy',
  },
  {
    id: 'Zeeve',
    type: BadgeType.RaaS,
    name: 'Zeeve',
    description:
      'This project was deployed via the rollup-as-a-service provider Zeeve',
    filterName: 'Zeeve',
  },
  // DA
  {
    id: 'Avail',
    type: BadgeType.DA,
    name: 'Avail',
    description: 'This project is posting its data to Avail',
  },
  {
    id: 'Celestia',
    type: BadgeType.DA,
    name: 'Celestia',
    description: 'This project is posting its data to Celestia',
  },
  {
    id: 'CelestiaBlobstream',
    type: BadgeType.DA,
    name: 'Celestia with Blobstream',
    description:
      'This project utilizes Celestia and has Blobstream enabled, facilitating the bridging of data availability commitments between Celestia and Ethereum.',
  },
  {
    id: 'EigenDA',
    type: BadgeType.DA,
    name: 'EigenDA',
    description: 'This project is posting its data to EigenDA',
  },
  {
    id: 'NearDA',
    type: BadgeType.DA,
    name: 'NearDA',
    description: 'This project is posting its data to NearDA',
  },
  {
    id: 'EthereumBlobs',
    type: BadgeType.DA,
    name: 'Ethereum with blobs',
    description: 'This project is posting its data to Ethereum as blobs',
  },
  {
    id: 'EthereumCalldata',
    type: BadgeType.DA,
    name: 'Ethereum with calldata',
    description: 'This project is posting its data to Ethereum as calldata',
  },
  {
    id: 'CustomDA',
    type: BadgeType.DA,
    name: 'Custom DA solution',
    description: 'This project is using a custom DA solution',
  },
  {
    id: 'DAC',
    type: BadgeType.DA,
    name: 'Data Availability Committee',
    description:
      'There is a Data Availability Committee that provides/attests to data availability',
  },
  // VM
  {
    id: 'EVM',
    type: BadgeType.VM,
    name: 'EVM',
    description:
      'This project uses the Ethereum Virtual Machine to run its smart contracts and supports the Solidity programming language',
    filterName: 'EVM',
  },
  {
    id: 'EVMLike',
    type: BadgeType.VM,
    name: 'EVM-like',
    description:
      'This project uses the Ethereum Virtual Machine variation to run its smart contracts and supports the Solidity programming language',
    filterName: 'EVM-like',
  },
  {
    id: 'CairoVM',
    type: BadgeType.VM,
    name: 'CairoVM',
    description:
      'This project uses the Cairo Virtual Machine to run its smart contracts and supports the Cairo programming language',
    filterName: 'Cairo',
  },
  {
    id: 'CartesiVM',
    type: BadgeType.VM,
    name: 'CartesiVM',
    description:
      'This project uses the Cartesi Machine to run its smart contracts and supports any programming language that can be ported to RISC-V architecture',
    filterName: 'Cartesi',
  },
  {
    id: 'FuelVM',
    type: BadgeType.VM,
    name: 'FuelVM',
    description:
      'This project uses the Fuel Virtual Machine to run its smart contracts and supports the Sway programming language',
    filterName: 'Fuel',
  },
  {
    id: 'AztecVM',
    type: BadgeType.VM,
    name: 'AztecVM',
    description:
      'This project uses the Aztec Virtual Machine to run its smart contracts and supports the Noir programming language',
    filterName: 'Aztec',
  },
  {
    id: 'MoveVM',
    type: BadgeType.VM,
    name: 'MoveVM',
    description:
      'This project uses the Move Virtual Machine to run its smart contracts and supports the Move programming language',
    filterName: 'Move',
  },
  {
    id: 'SolanaVM',
    type: BadgeType.VM,
    name: 'SolanaVM',
    description:
      'This project uses the Solana Virtual Machine to run its smart contracts',
    filterName: 'Solana',
  },
  {
    id: 'WasmVM',
    type: BadgeType.VM,
    name: 'WasmVM',
    description:
      'This project uses a WebAssembly Virtual Machine to run its smart contracts',
    filterName: 'Wasm',
  },
  {
    id: 'AppChain',
    type: BadgeType.VM,
    name: 'Application-specific chain',
    description: 'This project is built to operate a specific application',
    filterName: 'Application-specific chain',
  },
  //Infra
  {
    id: 'Superchain',
    type: BadgeType.Infra,
    name: 'Part of the Superchain',
    description:
      "The project is part of the Superchain, meaning it's included in the Superchain registry or uses the Superchain config",
    filterName: 'Superchain',
  },
  {
    id: 'SHARP',
    type: BadgeType.Infra,
    name: 'Uses SHARP',
    description: 'The project uses a shared prover contract - SHARP',
    filterName: 'SHARP',
  },
  {
    id: 'AggLayer',
    type: BadgeType.Infra,
    name: 'Part of the AggLayer',
    description: 'The project is part of the AggLayer',
    filterName: 'AggLayer',
  },
  {
    id: 'ElasticChain',
    type: BadgeType.Infra,
    name: 'Part of the Elastic Chain',
    description:
      "The project is part of the Elastic Chain, meaning it's based on the ZK stack and uses the shared contracts",
    filterName: 'Elastic Chain',
  },
  // Stack/forks
  {
    id: 'OPStack',
    type: BadgeType.Stack,
    name: 'Built on OP Stack',
    description: 'The project is built on the OP Stack',
    filterName: 'OP Stack',
  },
  {
    id: 'Orbit',
    type: BadgeType.Stack,
    name: 'Built on Arbitrum Orbit',
    description: 'The project is built on Arbitrum Orbit',
    filterName: 'Arbitrum',
  },
  {
    id: 'Nitro',
    type: BadgeType.Stack,
    name: 'Built on Arbitrum Nitro',
    description: 'The project is built on Arbitrum Nitro',
    filterName: 'Arbitrum',
  },
  {
    id: 'StarkEx',
    type: BadgeType.Stack,
    name: 'StarkEx',
    description:
      'This project was deployed utilizing the StarkEx technology from StarkWare',
    filterName: 'StarkEx',
  },
  {
    id: 'ZKStack',
    type: BadgeType.Stack,
    name: 'Built on the ZK Stack',
    description: 'The project is built on the ZK Stack',
    filterName: 'ZK Stack',
  },
  {
    id: 'PolygonCDK',
    type: BadgeType.Stack,
    name: 'Built on the Polygon CDK stack',
    description: 'The project is built on the Polygon CDK stack',
    filterName: 'Polygon',
  },
  {
    id: 'Cartesi',
    type: BadgeType.Stack,
    name: 'Built on the Cartesi stack',
    description: 'The project is built on the Cartesi stack',
    filterName: 'Cartesi Rollups',
  },
  {
    id: 'SNStack',
    type: BadgeType.Stack,
    name: 'Built on the SN Stack',
    description: 'The project is built on the SN Stack',
    filterName: 'SN Stack',
  },
  {
    id: 'LoopringFork',
    type: BadgeType.Fork,
    name: 'Fork of Loopring',
    description: 'The project is fork of Loopring',
    filterName: 'Loopring',
  },
  {
    id: 'OVM',
    type: BadgeType.Fork,
    name: 'Fork of OVM',
    description: 'The project is fork of the Optimistic Virtual Machine',
    filterName: 'OVM',
  },
  {
    id: 'ZKsyncLiteFork',
    type: BadgeType.Fork,
    name: 'Fork of ZKsync Lite',
    description: 'The project is fork of ZKsync Lite',
    filterName: 'ZKsync Lite',
  },
  {
    id: 'TaikoFork',
    type: BadgeType.Fork,
    name: 'Fork of Taiko',
    description: 'The project is fork of Taiko',
    filterName: 'Taiko',
  },
  //L3 host chains
  {
    id: 'Arbitrum',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of Arbitrum',
    description: 'The project has Arbitrum as its host chain',
    filterName: 'Arbitrum One',
  },
  {
    id: 'Base',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of Base',
    description: 'The project has Base as its host chain',
    filterName: 'Base',
  },
  {
    id: 'Linea',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of Linea',
    description: 'The project has Linea as its host chain',
    filterName: 'Linea',
  },
  {
    id: 'Nova',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of Arbitrum Nova',
    description: 'The project has Arbitrum Nova as its host chain',
    filterName: 'Arbitrum Nova',
  },
  {
    id: 'OpMainnet',
    type: BadgeType.L3ParentChain,
    name: 'Built on top of OP Mainnet',
    description: 'The project has OP Mainnet as its host chain',
    filterName: 'OP Mainnet',
  },
  // Other
  {
    id: 'AccountAbstraction',
    type: BadgeType.Other,
    name: 'Account Abstraction',
    description: 'This project supports account abstraction',
  },
  {
    id: 'Governance',
    type: BadgeType.Other,
    name: 'Governance',
    description: 'This project features token voting',
  },
  {
    id: 'L3HostChain',
    type: BadgeType.Other,
    name: 'L3 Host Chain',
    description: 'This project serves as a host chain for L3s',
  },
  {
    id: 'BasedSequencing',
    type: BadgeType.Other,
    name: 'Based Sequencing',
    description:
      'This project is ordering its transactions through Ethereum block proposers',
  },
  {
    id: 'EspressoPreconfs',
    type: BadgeType.Other,
    name: 'Espresso Preconfs',
    description:
      'The project integrates with Espresso preconfirmations. The chain batch poster publishes blocks to Espresso Network and runs in a Trusted Execution Environment (TEE) programmed to verify that only Espresso-validated batches reach the host chain.',
  },
  {
    id: 'MigratedFromL1',
    type: BadgeType.Other,
    name: 'Migrated from L1 to Ethereum L2',
    description:
      'This project has migrated from being a standalone L1 blockchain to an Ethereum L2',
  },
] as const

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
