/**
 * In order to add a new badge, you need to:
 * - add it to the const badges object below, specifying the type and display properties
 * - add images to the respective folder in frontend (packages/frontend/public/images/badges)
 *
 * In order to add a new badge type, you need to:
 * - add it to the BadgeType object below & that's it
 *
 * Badges are ordered first by type, then alphabetically by display name.
 * Order of types is determined by the order in the BadgeType object.
 */

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

export type BadgeType = (typeof BadgeType)[keyof typeof BadgeType]

export const badges = {
  // RaaS
  AltLayer: {
    display: {
      name: 'AltLayer',
      description:
        'This project was deployed via the rollup-as-a-service provider AltLayer',
    },
    type: BadgeType.RaaS,
  },
  Gateway: {
    display: {
      name: 'Gateway',
      description:
        'This project was deployed via the rollup-as-a-service provider Gateway',
    },
    type: BadgeType.RaaS,
  },
  Conduit: {
    display: {
      name: 'Conduit',
      description:
        'This project was deployed via the rollup-as-a-service provider Conduit',
    },
    type: BadgeType.RaaS,
  },
  Gelato: {
    display: {
      name: 'Gelato',
      description:
        'This project was deployed via the rollup-as-a-service provider Gelato',
    },
    type: BadgeType.RaaS,
  },
  Karnot: {
    display: {
      name: 'Karnot',
      description:
        'This project was deployed via the rollup-as-a-service provider Karnot',
    },
    type: BadgeType.RaaS,
  },
  Caldera: {
    display: {
      name: 'Caldera',
      description:
        'This project was deployed via the rollup-as-a-service provider Caldera',
    },
    type: BadgeType.RaaS,
  },
  Syndicate: {
    display: {
      name: 'Syndicate',
      description:
        'This project was deployed via the rollup-as-a-service provider Syndicate',
    },
    type: BadgeType.RaaS,
  },
  Quicknode: {
    display: {
      name: 'Quicknode',
      description:
        'This project was deployed via the rollup-as-a-service provider Quicknode',
    },
    type: BadgeType.RaaS,
  },
  Alchemy: {
    display: {
      name: 'Alchemy',
      description:
        'This project was deployed via the rollup-as-a-service provider Alchemy',
    },
    type: BadgeType.RaaS,
  },
  Zeeve: {
    display: {
      name: 'Zeeve',
      description:
        'This project was deployed via the rollup-as-a-service provider Zeeve',
    },
    type: BadgeType.RaaS,
  },
  // DA
  Avail: {
    display: {
      name: 'Avail',
      description: 'This project is posting its data to Avail',
    },
    type: BadgeType.DA,
  },
  Celestia: {
    display: {
      name: 'Celestia',
      description: 'This project is posting its data to Celestia',
    },
    type: BadgeType.DA,
  },
  CelestiaBlobstream: {
    display: {
      name: 'Celestia with Blobstream',
      description:
        'This project utilizes Celestia and has Blobstream enabled, facilitating the bridging of data availability commitments between Celestia and Ethereum.',
    },
    type: BadgeType.DA,
  },
  EigenDA: {
    display: {
      name: 'EigenDA',
      description: 'This project is posting its data to EigenDA',
    },
    type: BadgeType.DA,
  },
  NearDA: {
    display: {
      name: 'NearDA',
      description: 'This project is posting its data to NearDA',
    },
    type: BadgeType.DA,
  },
  EthereumBlobs: {
    display: {
      name: 'Ethereum with blobs',
      description: 'This project is posting its data to Ethereum as blobs',
    },
    type: BadgeType.DA,
  },
  EthereumCalldata: {
    display: {
      name: 'Ethereum with calldata',
      description: 'This project is posting its data to Ethereum as calldata',
    },
    type: BadgeType.DA,
  },
  CustomDA: {
    display: {
      name: 'Custom DA solution',
      description: 'This project is using a custom DA solution',
    },
    type: BadgeType.DA,
  },
  DAC: {
    display: {
      name: 'Data Availability Committee',
      description:
        'There is a Data Availability Committee that provides/attests to data availability',
    },
    type: BadgeType.DA,
  },
  // VM
  EVM: {
    display: {
      name: 'EVM',
      description:
        'This project uses the Ethereum Virtual Machine to run its smart contracts and supports the Solidity programming language',
    },
    type: BadgeType.VM,
  },
  EVMLike: {
    display: {
      name: 'EVM-like',
      description:
        'This project uses the Ethereum Virtual Machine variation to run its smart contracts and supports the Solidity programming language',
    },
    type: BadgeType.VM,
  },
  CairoVM: {
    display: {
      name: 'CairoVM',
      description:
        'This project uses the Cairo Virtual Machine to run its smart contracts and supports the Cairo programming language',
    },
    type: BadgeType.VM,
  },
  CartesiVM: {
    display: {
      name: 'CartesiVM',
      description:
        'This project uses the Cartesi Machine to run its smart contracts and supports any programming language that can be ported to RISC-V architecture',
    },
    type: BadgeType.VM,
  },
  FuelVM: {
    display: {
      name: 'FuelVM',
      description:
        'This project uses the Fuel Virtual Machine to run its smart contracts and supports the Sway programming language',
    },
    type: BadgeType.VM,
  },
  AztecVM: {
    display: {
      name: 'AztecVM',
      description:
        'This project uses the Aztec Virtual Machine to run its smart contracts and supports the Noir programming language',
    },
    type: BadgeType.VM,
  },
  MoveVM: {
    display: {
      name: 'MoveVM',
      description:
        'This project uses the Move Virtual Machine to run its smart contracts and supports the Move programming language',
    },
    type: BadgeType.VM,
  },
  SolanaVM: {
    display: {
      name: 'SolanaVM',
      description:
        'This project uses the Solana Virtual Machine to run its smart contracts',
    },
    type: BadgeType.VM,
  },
  WasmVM: {
    display: {
      name: 'WasmVM',
      description:
        'This project uses a WebAssembly Virtual Machine to run its smart contracts',
    },
    type: BadgeType.VM,
  },
  AppChain: {
    display: {
      name: 'Application-specific chain',
      description: 'This project is built to operate a specific application',
    },
    type: BadgeType.VM,
  },
  //Infra
  Superchain: {
    display: {
      name: 'Part of the Superchain',
      description:
        "The project is part of the Superchain, meaning it's included in the Superchain registry or uses the Superchain config",
    },
    type: BadgeType.Infra,
  },
  SHARP: {
    display: {
      name: 'Uses SHARP',
      description: 'The project uses a shared prover contract - SHARP',
    },
    type: BadgeType.Infra,
  },
  AggLayer: {
    display: {
      name: 'Part of the AggLayer',
      description: 'The project is part of the AggLayer',
    },
    type: BadgeType.Infra,
  },
  ElasticChain: {
    display: {
      name: 'Part of the Elastic Chain',
      description:
        "The project is part of the Elastic Chain, meaning it's based on the ZK stack and uses the shared contracts",
    },
    type: BadgeType.Infra,
  },
  // Stack/forks
  OPStack: {
    display: {
      name: 'Built on OP Stack',
      description: 'The project is built on the OP Stack',
    },
    type: BadgeType.Stack,
  },
  Orbit: {
    display: {
      name: 'Built on Arbitrum Orbit',
      description: 'The project is built on Arbitrum Orbit',
    },
    type: BadgeType.Stack,
  },
  Nitro: {
    display: {
      name: 'Built on Arbitrum Nitro',
      description: 'The project is built on Arbitrum Nitro',
    },
    type: BadgeType.Stack,
  },
  StarkEx: {
    display: {
      name: 'StarkEx',
      description:
        'This project was deployed utilizing the StarkEx technology from StarkWare',
    },
    type: BadgeType.Stack,
  },
  ZKStack: {
    display: {
      name: 'Built on the ZK Stack',
      description: 'The project is built on the ZK Stack',
    },
    type: BadgeType.Stack,
  },
  PolygonCDK: {
    display: {
      name: 'Built on the Polygon CDK stack',
      description: 'The project is built on the Polygon CDK stack',
    },
    type: BadgeType.Stack,
  },
  Cartesi: {
    display: {
      name: 'Built on the Cartesi stack',
      description: 'The project is built on the Cartesi stack',
    },
    type: BadgeType.Stack,
  },
  SNStack: {
    display: {
      name: 'Built on the SN Stack',
      description: 'The project is built on the SN Stack',
    },
    type: BadgeType.Stack,
  },
  LoopringFork: {
    display: {
      name: 'Fork of Loopring',
      description: 'The project is fork of Loopring',
    },
    type: BadgeType.Fork,
  },
  OVM: {
    display: {
      name: 'Fork of OVM',
      description: 'The project is fork of the Optimistic Virtual Machine',
    },
    type: BadgeType.Fork,
  },
  ZKsyncLiteFork: {
    display: {
      name: 'Fork of ZKsync Lite',
      description: 'The project is fork of ZKsync Lite',
    },
    type: BadgeType.Fork,
  },
  StarknetFork: {
    display: {
      name: 'Fork of Starknet',
      description: 'The project is fork of Starknet',
    },
    type: BadgeType.Fork,
  },
  TaikoFork: {
    display: {
      name: 'Fork of Taiko',
      description: 'The project is fork of Taiko',
    },
    type: BadgeType.Fork,
  },
  //L3 host chains
  Arbitrum: {
    display: {
      name: 'Built on top of Arbitrum',
      description: 'The project has Arbitrum as its host chain',
    },
    type: BadgeType.L3ParentChain,
  },
  Base: {
    display: {
      name: 'Built on top of Base',
      description: 'The project has Base as its host chain',
    },
    type: BadgeType.L3ParentChain,
  },
  Linea: {
    display: {
      name: 'Built on top of Linea',
      description: 'The project has Linea as its host chain',
    },
    type: BadgeType.L3ParentChain,
  },
  Nova: {
    display: {
      name: 'Built on top of Arbitrum Nova',
      description: 'The project has Arbitrum Nova as its host chain',
    },
    type: BadgeType.L3ParentChain,
  },
  OpMainnet: {
    display: {
      name: 'Built on top of OP Mainnet',
      description: 'The project has OP Mainnet as its host chain',
    },
    type: BadgeType.L3ParentChain,
  },
  // Other
  AccountAbstraction: {
    display: {
      name: 'Account Abstraction',
      description: 'This project supports account abstraction',
    },
    type: BadgeType.Other,
  },
  Governance: {
    display: {
      name: 'Governance',
      description: 'This project features token voting',
    },
    type: BadgeType.Other,
  },
  L3HostChain: {
    display: {
      name: 'L3 Host Chain',
      description: 'This project serves as a host chain for L3s',
    },
    type: BadgeType.Other,
  },
  BasedSequencing: {
    display: {
      name: 'Based Sequencing',
      description:
        'This project is ordering its transactions through Ethereum block proposers',
    },
    type: BadgeType.Other,
  },
  EspressoPreconfs: {
    display: {
      name: 'Espresso Preconfs',
      description:
        'The project integrates with Espresso preconfirmations. The chain batch poster publishes blocks to Espresso Network and runs in a Trusted Execution Environment (TEE) programmed to verify that only Espresso-validated batches reach the host chain.',
    },
    type: BadgeType.Other,
  },
  MigratedFromL1: {
    display: {
      name: 'Migrated from L1 to Ethereum L2',
      description:
        'This project has migrated from being a standalone L1 blockchain to an Ethereum L2',
    },
    type: BadgeType.Other,
  },
} as const satisfies Record<string, BadgeInfo>

export type BadgeInfo = {
  display: {
    name: string
    description: string
  }
  type: BadgeType
}

export const Badge: {
  [T in BadgeType]: {
    [K in keyof typeof badges as (typeof badges)[K]['type'] extends T
      ? K
      : never]: K
  }
} = Object.entries(badges).reduce((acc, [key, value]) => {
  if (!acc[value.type]) acc[value.type] = {}
  acc[value.type][key] = key
  return acc
  // biome-ignore lint/suspicious/noExplicitAny: it's way easier to type this as any than to do typecasting gymnastics above (trust)
}, {} as any)

export type BadgeId = keyof typeof badges
export type AnyBadge = (typeof badges)[BadgeId]

export const badgeTypeOrder = Object.values(BadgeType)
export const badgesCompareFn = (a: BadgeId, b: BadgeId) => {
  const typeOrder =
    badgeTypeOrder.indexOf(badges[a].type) -
    badgeTypeOrder.indexOf(badges[b].type)
  if (typeOrder !== 0) return typeOrder
  return badges[a].display.name.localeCompare(badges[b].display.name)
}
