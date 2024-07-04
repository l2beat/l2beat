/**
 * In order to add a new badge, you need to:
 * - add it to the const badges object below, specifying the type and display properties
 * - add images to the respective folder in frontend2 (packages/frontend2/public/images/badges)
 *
 * In order to add a new badge type, you need to:
 * - add it to the BadgeType object below & that's it
 */

export const BadgeType = {
  RaaS: 'RaaS',
  DA: 'DA',
  VM: 'VM',
  Token: 'Token',
  Stack: 'Stack',
  Fork: 'Fork',
  L3ParentChain: 'L3ParentChain',
  Infra: 'Infra',
  Other: 'Other',
} as const

export type BadgeType = (typeof BadgeType)[keyof typeof BadgeType]

export const badges = {
  // RaaS
  AltLayer: {
    display: {
      name: 'AltLayer',
      description: 'Lorem AltLayer dolor sit amet...',
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
  StarkEx: {
    display: {
      name: 'StarkEx',
      description:
        'This project was deployed utilizing the StarkEx technology from StarkWare',
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
  EigenDA: {
    display: {
      name: 'EigenDA',
      description: 'This project is posting its data to EigenDA',
    },
    type: BadgeType.DA,
  },
  //should we mention that it is either calldata or blobs depending on the price? should it be one badge or two?
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
  // NOTE: The badges below are missing images
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
      name: 'Cairo',
      description:
        'This project uses the Cairo Virtual Machine to run its smart contracts and supports the Cairo programming language',
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
  CustomVM: {
    display: {
      name: 'Custom',
      description:
        'This project uses a custom-built virtual machine suitable for its own needs',
    },
    type: BadgeType.VM,
  },
  //Infra
  Superchain: {
    display: {
      name: 'Part of the Superchain',
      description: 'The project is part of the Superchain.',
    },
    type: BadgeType.Infra,
  },
  SHARP: {
    display: {
      name: 'Uses SHARP',
      description: 'The project uses a shared prover - SHARP.',
    },
    type: BadgeType.Infra,
  },
  AggLayer: {
    display: {
      name: 'Part of the AggLayer',
      description: 'The project is part of the AggLayer.',
    },
    type: BadgeType.Infra,
  },
  // Stack/forks
  OPStack: {
    display: {
      name: 'Built on OP Stack',
      description: 'The project is built on the OP Stack.',
    },
    type: BadgeType.Stack,
  },
  Orbit: {
    display: {
      name: 'Built on Arbitrum Orbit',
      description: 'The project is built on Arbitrum Orbit.',
    },
    type: BadgeType.Stack,
  },
  // Other
  AccountAbstraction: {
    display: {
      name: 'Account Abstraction',
      description: 'This project supports account abstraction',
    },
    type: BadgeType.Other,
  },
  //should we add link to the forum/dao website?
  Governance: {
    display: {
      name: 'Governance',
      description:
        'This project has a decentralized governance system that votes on proposed changes',
    },
    type: BadgeType.Other,
  },
  //we should probably add some logic here to show which exact L3s are builded on top of this project while hovering over the badge
  L3HostChain: {
    display: {
      name: 'L3 Host Chain',
      description: 'This project serves as a host chain for L3s',
    },
    type: BadgeType.Other,
  },
  //Forks
  ForkOP: {
    display: {
      name: 'Fork of OP Stack',
      description: 'Lorem Fork of OP Stack dolor sit amet...',
    },
    type: BadgeType.Fork,
  },
} as const satisfies Record<
  string,
  {
    display: {
      name: string
      description: string
    }
    type: BadgeType
  }
>

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
