import type {
  PrivacyCleanOriginTool,
  PrivacyComplianceConsequence,
  PrivacyComplianceGatekeeper,
  PrivacyComplianceRules,
  PrivacyComplianceTiming,
} from '../types'

// What the Compliance section prints for each fact type.

/** Hardest to get around first. */
export const PRIVACY_COMPLIANCE_GATEKEEPERS = {
  contract: 'the contracts',
  operator: 'the operator',
  relayer: 'relayers',
  app: 'the app',
  none: 'nobody',
} as const satisfies Record<PrivacyComplianceGatekeeper, string>

export const PRIVACY_COMPLIANCE_RULES = {
  public: 'public',
  closed: 'closed',
  none: 'none',
} as const satisfies Record<PrivacyComplianceRules, string>

export const PRIVACY_COMPLIANCE_TIMINGS = {
  entry: 'once at entry, then final',
  anytime: 'at any time, also after entry',
  everyUse: 'at each use',
} as const satisfies Record<PrivacyComplianceTiming, string>

/** Mildest first. */
export const PRIVACY_COMPLIANCE_CONSEQUENCES = {
  access: 'loss of access',
  privacy: 'loss of privacy',
  funds: 'frozen funds',
} as const satisfies Record<PrivacyComplianceConsequence, string>

/** Least revealing first. */
export const PRIVACY_CLEAN_ORIGIN_TOOLS = {
  proof: 'a proof against a list',
  payment: 'disclosure of one payment',
  key: 'a viewing key for the whole history',
  public: 'not needed, the origin is public',
  none: 'none',
} as const satisfies Record<PrivacyCleanOriginTool, string>

/** The section's three parts, in page order. */
export const PRIVACY_COMPLIANCE_HEADINGS = [
  'Enforcement',
  'Access to private data',
  'Proof of clean origin',
] as const
