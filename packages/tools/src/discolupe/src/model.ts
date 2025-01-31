import { z } from 'zod'

export const DiscoLupeProject = z.object({
  id: z.string(),
  display: z.object({
    name: z.string(),
    slug: z.string(),
    stack: z.string().optional(),
    category: z.string(),
  }),
  tvs: z.number(),
  type: z.string(),
  arePermissionsDiscoveryDriven: z.boolean(),
  areContractsDiscoveryDriven: z.boolean(),
  isArchived: z.boolean(),
  isUpcoming: z.boolean(),
  isUnderReview: z.boolean(),

  costsConfigured: z.boolean(),
  livenessConfigured: z.boolean(),
  finalityConfigured: z.boolean(),
  milestonesConfigured: z.boolean(),
  operatorConfigured: z.boolean(),
  withdrawalsConfigured: z.boolean(),
  otherConsiderationsConfigured: z.boolean(),
  stateDerivationConfigured: z.boolean(),
  stateValidationConfigured: z.boolean(),
  upgradesAndGovernanceConfigured: z.boolean(),
  knowledgeNuggetsConfigured: z.boolean(),
})
export type DiscoLupeProject = z.infer<typeof DiscoLupeProject>

export const DiscoLupeModel = z.object({
  success: z.boolean(),
  data: z.object({
    projects: z.array(DiscoLupeProject),
  }),
})
