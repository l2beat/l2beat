import { v } from '@l2beat/validate'

export const DiscoLupeProject = v.object({
  id: v.string(),
  display: v.object({
    name: v.string(),
    slug: v.string(),
    stack: v.string().optional(),
    category: v.string(),
  }),
  tvs: v.number(),
  type: v.string(),
  arePermissionsDiscoveryDriven: v.boolean(),
  areContractsDiscoveryDriven: v.boolean(),
  isArchived: v.boolean(),
  isUpcoming: v.boolean(),
  isUnderReview: v.boolean(),

  costsConfigured: v.boolean(),
  livenessConfigured: v.boolean(),
  milestonesConfigured: v.boolean(),
  operatorConfigured: v.boolean(),
  withdrawalsConfigured: v.boolean(),
  otherConsiderationsConfigured: v.boolean(),
  stateDerivationConfigured: v.boolean(),
  stateValidationConfigured: v.boolean(),
  upgradesAndGovernanceConfigured: v.boolean(),
})
export type DiscoLupeProject = v.infer<typeof DiscoLupeProject>

export const DiscoLupeModel = v.object({
  success: v.boolean(),
  data: v.object({
    projects: v.array(DiscoLupeProject),
  }),
})
