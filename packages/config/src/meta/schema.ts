import { UnixTime as OriginalUnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { badges } from '../common/badges'

export const HttpsUrl = z.string().regex(/^https:\/\//)
export const DateYYYYMMDD = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
export const UnixTime = z.union([
  z
    .number()
    .int()
    .min(OriginalUnixTime.from('2000-01-01'))
    .max(OriginalUnixTime.from('2100-01-01')),
  z.string().regex(OriginalUnixTime.DATE_REGEX),
])
export const EthereumAddress = z.string().regex(/^0x[\da-f]{40}$/i)

export const Statuses = z.object({
  yellowWarning: z.string().optional(),
  redWarning: z.string().optional(),
  isUnderReview: z.boolean().optional(),
  isUnverified: z.boolean().optional(),
})

export const Badge = z.enum(
  badges.map((x) => `${x.type}.${x.id}`).sort() as [string],
)

export const Display = z.object({
  description: z.string().optional(),
  links: z
    .object({
      websites: z.array(z.string()).optional(),
      apps: z.array(z.string()).optional(),
      documentation: z.array(z.string()).optional(),
      explorers: z.array(z.string()).optional(),
      repositories: z.array(z.string()).optional(),
      socialMedia: z.array(z.string()).optional(),
      rollupCodes: z.string().optional(),
    })
    .optional(),
  badges: z.array(Badge),
})

export const Milestone = z.object({
  type: z.enum(['general', 'incident']),
  title: z.string(),
  description: z.string().optional(),
  date: DateYYYYMMDD,
  url: HttpsUrl,
})

export const MulticallContractConfig = z.object({
  address: EthereumAddress,
  sinceBlock: z.number().int().min(0),
  batchSize: z.number().int(),
  version: z.enum(['1', '2', '3', 'optimism']),
  isNativeBalanceSupported: z.boolean().optional(),
})

export const ChainConfig = z.object({
  chainId: z.number().int().min(0).nullable(),
  explorerUrl: z.string().optional(),
  gasTokens: z.array(z.string()).optional(),
  multicallContracts: z.array(MulticallContractConfig).optional(),
  coingeckoPlatform: z.string().optional(),
  sinceTimestamp: UnixTime.optional(),
  untilTimestamp: UnixTime.optional(),
})

export const Project = z.object({
  $schema: z.string().optional(),
  extends: z.string().optional(),
  template: z.string().optional(),
  id: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  statuses: Statuses.optional(),
  display: Display.optional(),
  milestones: z.array(Milestone).optional(),
  chainConfig: ChainConfig.optional(),
})

export const schema = zodToJsonSchema(Project, {
  definitions: {
    Badge,
    ChainConfig,
    DateYYYYMMDD,
    Display,
    EthereumAddress,
    HttpsUrl,
    Milestone,
    MulticallContractConfig,
    Project,
    Statuses,
    UnixTime,
  },
})
