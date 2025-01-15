import { z } from 'zod'

export const DiscoLupeProject = z.object({
  id: z.string(),
  display: z.object({
    name: z.string(),
    slug: z.string(),
    provider: z.string().optional(),
  }),
  tvl: z.number(),
  type: z.string(),
  arePermissionsDiscoveryDriven: z.boolean(),
  areContractsDiscoveryDriven: z.boolean(),
  isArchived: z.boolean(),
  isUpcoming: z.boolean(),
  isUnderReview: z.boolean(),
  milestones: z.array(z.object({})).optional(),
})
export type DiscoLupeProject = z.infer<typeof DiscoLupeProject>

export const DiscoLupeModel = z.object({
  success: z.boolean(),
  data: z.object({
    projects: z.array(DiscoLupeProject),
  }),
})
