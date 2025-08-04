import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type SourceEntry = v.infer<typeof SourceEntry>
export const SourceEntry = v
  .object({
    coingeckoId: v.string().optional(),
    category: v
      .enum([
        'ether',
        'stablecoin',
        'btc',
        'rwaRestricted',
        'rwaPublic',
        'other',
      ])
      .optional(),
    source: v.enum(['canonical', 'external', 'native']).optional(),
    supply: v.enum(['totalSupply', 'circulatingSupply', 'zero']).optional(),
    bridgedUsing: v
      .object({
        bridges: v.array(
          v.object({
            name: v.string(),
            slug: v.string().optional(),
          }),
        ),
        warning: v.string().optional(),
      })
      .optional(),
    deploymentTimestamp: v.number().transform(UnixTime).optional(),
    excludeFromTotal: v.literal(true).optional(),
  })
  .optional()
