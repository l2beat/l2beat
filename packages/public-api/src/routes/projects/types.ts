import { v } from '@l2beat/validate'

const RiskSentimentSchema = v.enum([
  'bad',
  'warning',
  'good',
  'neutral',
  'UnderReview',
])

export type ScalingRisk = v.infer<typeof ScalingRiskSchema>
export const ScalingRiskSchema = v
  .object({
    name: v.string(),
    value: v.string(),
    sentiment: RiskSentimentSchema.optional(),
    description: v.string().optional(),
    warning: v
      .object({
        value: v.string(),
        sentiment: v.enum(['bad', 'warning', 'neutral']),
      })
      .optional(),
    regular: v
      .object({
        value: v.string(),
        sentiment: RiskSentimentSchema.optional(),
        description: v.string(),
      })
      .optional()
      .meta({
        description:
          'Exit Window only: the window for regular upgrades, when `value` is the one for emergency upgrades.',
      }),
  })
  .describe('ScalingRisk')

export type ProjectTvs = v.infer<typeof ProjectTvsSchema>
export const ProjectTvsSchema = v
  .object({
    timestamp: v.number().meta({
      description:
        'UNIX timestamp (seconds) of the hour the values come from. The project is lagging when this is before the start of the hour that began 75 minutes ago.',
    }),
    breakdown: v
      .object({
        total: v.number(),
        ether: v.number(),
        stablecoin: v.number(),
        associated: v.number(),
      })
      .meta({ description: 'USD values. `total` includes the other three.' }),
    change7d: v.union([v.number(), v.null()]).meta({
      description:
        'Change of `breakdown.total` over seven days, as a fraction (0.05 is +5%). Null when there is no value from seven days before, or that value was 0.',
    }),
  })
  .describe('ProjectTvs')

export type ProjectData = v.infer<typeof ProjectSchema>
export const ProjectSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    shortName: v.string().optional(),
    chainId: v.number().optional(),
    layer: v.enum(['layer2', 'layer3']).optional().meta({
      description: 'Layer 2 and layer 3 projects only.',
    }),
    type: v.string().optional().meta({
      description:
        'Layer 2 and layer 3 projects only, e.g. "Optimistic Rollup".',
    }),
    isArchived: v.boolean(),
    category: v.string().optional(),
    hostChain: v.string().optional(),
    stacks: v.array(v.string()),
    ecosystem: v.string().optional(),
    gasTokens: v.array(v.string()),
    stage: v.string().optional().meta({
      description:
        'Layer 2 and layer 3 projects only. Stages rate rollups, so a project of type "Other" has "Not applicable", as on the website.',
    }),
    purposes: v.array(v.string()),
    badges: v.array(v.string()),
    isUnderReview: v.boolean().meta({
      description:
        'True while we are reviewing the project, or while its contracts changed in a way nobody has assessed yet. Its stage and risks may be out of date.',
    }),
    risks: v.array(ScalingRiskSchema).optional().meta({
      description:
        "Layer 2 and layer 3 projects only: the five risks of the website's risk rosette. A project without the field has no such assessment, which is not the same as having no risks.",
    }),
    tvs: v.union([ProjectTvsSchema, v.null()]).meta({
      description:
        "Latest Total Value Secured. Null when we do not track TVS for the project or have not synced it yet: unknown, not zero. Counts associated tokens and leaves out restricted RWA tokens, like the website's scaling summary.",
    }),
    associatedTokens: v.array(v.string()).meta({
      description:
        'Symbols of the tokens associated with the project, e.g. its governance token.',
    }),
  })
  .describe('Project')

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
