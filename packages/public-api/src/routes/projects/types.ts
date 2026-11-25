import { v } from '@l2beat/validate'

export const ProjectSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    chainId: v.number().optional(),
  })
  .describe('Project')

export const DetailedProjectSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    chainId: v.number().optional(),
    type: v.string().optional(),
    isArchived: v.boolean().optional(),
    category: v.string().optional(),
    hostChain: v.string().optional(),
    stacks: v.array(v.string()),
    ecosystem: v.string().optional(),
    gasTokens: v.array(v.string()),
    stage: v.string().optional(),
    purposes: v.array(v.string()),
    badges: v.array(v.string()),
  })
  .describe('DetailedProject')

export const ContractSchema = v
  .object({
    name: v.string(),
    contractAddress: v.string(),
    chain: v.string(),
  })
  .describe('Contract')

const TokenAddressSchema = v.object({
  address: v.string().meta({ description: 'Token contract address.' }),
  chain: v.string().meta({
    description: 'Name of the chain the contract is on, e.g. "arbitrum".',
  }),
})

const TokenBridgedUsingSchema = v.object({
  bridges: v.array(
    v.object({
      name: v.string().meta({ description: 'Bridge name.' }),
      slug: v.string().optional().meta({
        description: 'Slug of the bridge project on ETHBEAT, when we list it.',
      }),
    }),
  ),
  warning: v.string().optional().meta({
    description: 'Caveat about how the token is bridged.',
  }),
})

export type Token = v.infer<typeof TokenSchema>
export const TokenSchema = v
  .object({
    tokenId: v.string(),
    symbol: v.string(),
    source: v.enum(['canonical', 'external', 'native']),
    category: v.enum([
      'ether',
      'stablecoin',
      'btc',
      'rwaRestricted',
      'rwaPublic',
      'other',
    ]),
    priceUsd: v.number().meta({ description: 'Token price in USD.' }),
    valueUsd: v.number().meta({
      description:
        "USD value counted toward the project's TVS: usually amount times priceUsd, with custom rules for some tokens to avoid double counting.",
    }),
    name: v.string().meta({ description: 'Full token name, e.g. "Ether".' }),
    iconUrl: v.union([v.string(), v.null()]).meta({
      description: 'URL of the token icon. Null when we have no icon for it.',
    }),
    amount: v.number().meta({
      description:
        'Amount of the token secured by the project, in whole tokens (decimals already applied).',
    }),
    addresses: v.array(TokenAddressSchema).meta({
      description:
        'Token contracts the amount is read from, one per distinct address. Several entries mean the amount sums the token across several contracts; empty means it comes from a native balance or a fixed value.',
    }),
    isGasToken: v.boolean().meta({
      description: "Whether the token pays for gas on the project's chain.",
    }),
    isAssociated: v.boolean().meta({
      description:
        'Whether the token is associated with the project, e.g. its governance token. The website\'s "Exclude associated tokens" option leaves these out of TVS.',
    }),
    bridgedUsing: v.union([TokenBridgedUsingSchema, v.null()]).meta({
      description:
        'Bridges the token reaches the project through. Null when we list none.',
    }),
    timestamp: v.number().meta({
      description:
        'UNIX timestamp (seconds) of the hour priceUsd, amount and valueUsd come from. The website marks the token as not synced when this is before the start of the hour that began 75 minutes ago.',
    }),
  })
  .describe('Token')
