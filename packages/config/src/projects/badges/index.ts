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
      description: 'Lorem Conduit dolor sit amet...',
    },
    type: BadgeType.RaaS,
  },
  Gelato: {
    display: {
      name: 'Gelato',
      description: 'Lorem Gelato dolor sit amet...',
    },
    type: BadgeType.RaaS,
  },
  Karnot: {
    display: {
      name: 'Karnot',
      description: 'Lorem Karnot dolor sit amet...',
    },
    type: BadgeType.RaaS,
  },
  StarkEx: {
    display: {
      name: 'StarkEx',
      description: 'Lorem StarkEx dolor sit amet...',
    },
    type: BadgeType.RaaS,
  },
  Caldera: {
    display: {
      name: 'Caldera',
      description: 'Lorem Caldera dolor sit amet...',
    },
    type: BadgeType.RaaS,
  },
  Syndicate: {
    display: {
      name: 'Syndicate',
      description: 'Lorem Syndicate dolor sit amet...',
    },
    type: BadgeType.RaaS,
  },
  // DA
  Avail: {
    display: {
      name: 'Avail',
      description: 'Lorem Avail dolor sit amet...',
    },
    type: BadgeType.DA,
  },
  Celestia: {
    display: {
      name: 'Celestia',
      description: 'Lorem Celestia dolor sit amet...',
    },
    type: BadgeType.DA,
  },
  EigenDA: {
    display: {
      name: 'EigenDA',
      description: 'Lorem EigenDA dolor sit amet...',
    },
    type: BadgeType.DA,
  },
  EthereumBlobs: {
    display: {
      name: 'Ethereum with blobs',
      description: 'Lorem Ethereum with blobs dolor sit amet...',
    },
    type: BadgeType.DA,
  },
  EthereumCalldata: {
    display: {
      name: 'Ethereum with calldata',
      description: 'Lorem Ethereum with calldata dolor sit amet...',
    },
    type: BadgeType.DA,
  },
  // NOTE: The badges below are missing images
  // VM
  EVM: {
    display: {
      name: 'EVM',
      description: 'Lorem EVM dolor sit amet...',
    },
    type: BadgeType.VM,
  },
  EVMLike: {
    display: {
      name: 'EVM-like',
      description: 'Lorem EVM-like dolor sit amet...',
    },
    type: BadgeType.VM,
  },
  Cairo: {
    display: {
      name: 'Cairo',
      description: 'Lorem Cairo dolor sit amet...',
    },
    type: BadgeType.VM,
  },
  FuelVM: {
    display: {
      name: 'FuelVM',
      description: 'Lorem FuelVM dolor sit amet...',
    },
    type: BadgeType.VM,
  },
  AztecVM: {
    display: {
      name: 'AztecVM',
      description: 'Lorem AztecVM dolor sit amet...',
    },
    type: BadgeType.VM,
  },
  MoveVM: {
    display: {
      name: 'MoveVM',
      description: 'Lorem MoveVM dolor sit amet...',
    },
    type: BadgeType.VM,
  },
  SolanaVM: {
    display: {
      name: 'SolanaVM',
      description: 'Lorem SolanaVM dolor sit amet...',
    },
    type: BadgeType.VM,
  },
  CustomVM: {
    display: {
      name: 'Custom',
      description: 'Lorem Custom dolor sit amet...',
    },
    type: BadgeType.VM,
  },
  // Other
  AccountAbstraction: {
    display: {
      name: 'Account Abstraction',
      description: 'Lorem Account Abstraction dolor sit amet...',
    },
    type: BadgeType.Other,
  },
  Governance: {
    display: {
      name: 'Governance',
      description: 'Lorem Governance dolor sit amet...',
    },
    type: BadgeType.Other,
  },
  L3HostChain: {
    display: {
      name: 'L3 Host Chain',
      description: 'Lorem L3 Host Chain dolor sit amet...',
    },
    type: BadgeType.Other,
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
