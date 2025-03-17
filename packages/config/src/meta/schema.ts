import { UnixTime as OriginalUnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { badges } from '../common/badges'

/*

You might wonder why do we "duplicate" the types from BaseProject here. Some
of the zod types are identical to what we have in types.ts. Shouldn't we reuse
those then?

No! The idea is to have a clean separation between what researchers configure
and what apps consume. That way we can add logic into the transformation between
those two types and resolve host chain dependencies, find reused contracts, etc.

 */

export type HttpsUrl = z.infer<typeof HttpsUrl>
export const HttpsUrl = z.string().regex(/^https:\/\//)

export type DateYYYYMMDD = z.infer<typeof DateYYYYMMDD>
export const DateYYYYMMDD = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export type UnixTime = z.infer<typeof UnixTime>
export const UnixTime = z.union([
  z
    .number()
    .int()
    .min(OriginalUnixTime.from('2000-01-01'))
    .max(OriginalUnixTime.from('2100-01-01')),
  z.string().regex(OriginalUnixTime.DATE_REGEX),
])

export type EthereumAddress = z.infer<typeof EthereumAddress>
export const EthereumAddress = z.string().regex(/^0x[\da-f]{40}$/i)

export type Statuses = z.infer<typeof Statuses>
export const Statuses = z.object({
  yellowWarning: z.string().optional(),
  redWarning: z.string().optional(),
  isUnderReview: z.boolean().optional(),
  isUnverified: z.boolean().optional(),
})

export type Badge = z.infer<typeof Badge>
export const Badge = z.enum(
  badges.map((x) => `${x.type}.${x.id}`).sort() as [string],
)

export type Display = z.infer<typeof Display>
export const Display = z.object({
  description: z.string(),
  links: z.object({
    websites: z.array(z.string()).optional(),
    apps: z.array(z.string()).optional(),
    documentation: z.array(z.string()).optional(),
    explorers: z.array(z.string()).optional(),
    repositories: z.array(z.string()).optional(),
    socialMedia: z.array(z.string()).optional(),
    rollupCodes: z.string().optional(),
  }),
  badges: z.array(Badge).optional(),
})

export type Milestone = z.infer<typeof Milestone>
export const Milestone = z.object({
  type: z.enum(['general', 'incident']),
  title: z.string(),
  description: z.string().optional(),
  date: DateYYYYMMDD,
  url: HttpsUrl,
})

export type MulticallContractConfig = z.infer<typeof MulticallContractConfig>
export const MulticallContractConfig = z.object({
  address: EthereumAddress,
  sinceBlock: z.number().int().min(0),
  batchSize: z.number().int(),
  version: z.enum(['1', '2', '3', 'optimism']),
  isNativeBalanceSupported: z.boolean().optional(),
})

export type ChainApiConfig = z.infer<typeof ChainApiConfig>
export const ChainApiConfig = z.union([
  z.object({
    type: z.enum(['rpc', 'starknet', 'zksync', 'loopring', 'degate3', 'fuel']),
    url: HttpsUrl,
    callsPerMinute: z.number().int().optional(),
  }),
  z.object({
    type: z.enum(['etherscan', 'blockscout', 'blockscoutV2']),
    url: HttpsUrl,
    contractCreationUnsupported: z.boolean().optional(),
  }),
  z.object({
    type: z.enum(['starkex']),
    product: z.array(z.string()),
  }),
])

export type ChainConfig = z.infer<typeof ChainConfig>
export const ChainConfig = z.object({
  chainId: z.number().int().min(0).nullable(),
  explorerUrl: z.string().optional(),
  gasTokens: z.array(z.string()).optional(),
  multicallContracts: z.array(MulticallContractConfig).optional(),
  coingeckoPlatform: z.string().optional(),
  sinceTimestamp: UnixTime.optional(),
  untilTimestamp: UnixTime.optional(),
  apis: z.array(ChainApiConfig),
})

export type Scaling = z.infer<typeof Scaling>
export const Scaling = z.object({
  hostChain: z
    .string()
    .optional()
    .describe('Host chain project id. Only for L3s.'),
  type: z.enum([
    'Optimistic Rollup',
    'ZK Rollup',
    'Plasma',
    'Validium',
    'Optimium',
    'Other',
  ]),
  capability: z.enum(['universal', 'appchain']),
  stack: z
    .enum([
      'Arbitrum',
      'Cartesi Rollups',
      'Loopring',
      'OP Stack',
      'OVM',
      'Polygon',
      'SN Stack',
      'StarkEx',
      'Taiko',
      'ZK Stack',
      'ZKsync Lite',
    ])
    .optional(),
  raas: z
    .enum(
      badges.filter((x) => x.type === 'RaaS').map((x) => x.name) as [string],
    )
    .optional(),
  purposes: z.array(
    z.enum([
      'AI',
      'Auctions',
      'Betting',
      'Bitcoin DApps',
      'Bug bounty',
      'Exchange',
      'Gaming',
      'Identity',
      'Information',
      'Interoperability',
      'KYC-ed DeFi',
      'Launchpad',
      'Lending',
      'Music',
      'NFT',
      'Oracles',
      'Payments',
      'Privacy',
      'Universal',
      'Social',
      'Storage',
      'RWA',
      'IoT',
      'Restaking',
    ]),
  ),
})

export type Project = z.infer<typeof Project>
export const Project = z.object({
  $schema: z.string().optional(),
  id: z
    .string()
    .describe(
      'DO NOT EDIT! The backend infrastructure relies on the immutability of ids.',
    ),
  slug: z
    .string()
    .regex(/^[a-z\-\d]+$/)
    .describe('A unique but changeable identifier used in the frontend.'),
  name: z.string(),
  shortName: z
    .string()
    .optional()
    .describe('Used by the frontend in situations where the name is too long.'),
  addedAt: DateYYYYMMDD.describe('When was the project added to L2BEAT?'),
  isUpcoming: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  statuses: Statuses.optional(),
  display: Display,
  milestones: z.array(Milestone).optional(),
  chainConfig: ChainConfig.optional(),
  scaling: Scaling.optional(),
})

export const schema = zodToJsonSchema(Project, {
  definitions: {
    Badge,
    ChainApiConfig,
    ChainConfig,
    DateYYYYMMDD,
    Display,
    EthereumAddress,
    HttpsUrl,
    Milestone,
    MulticallContractConfig,
    Project,
    Scaling,
    Statuses,
    UnixTime,
  },
})
