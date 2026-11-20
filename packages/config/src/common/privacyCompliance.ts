import type {
  PrivacyCleanOriginTool,
  PrivacyComplianceCost,
  PrivacyComplianceLayer,
  PrivacyComplianceRules,
  PrivacyComplianceTiming,
} from '../types'

/** The layers, hardest to get around first. */
export const PRIVACY_COMPLIANCE_LAYERS = {
  contract: 'the contracts',
  operator: 'the operator',
  relayer: 'relayers',
  app: 'the app',
  none: 'nobody',
} as const satisfies Record<PrivacyComplianceLayer, string>

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

/** What a refusal takes, mildest first. */
export const PRIVACY_COMPLIANCE_COSTS = {
  access: 'loss of access',
  privacy: 'loss of privacy',
  funds: 'loss of funds, for as long as it lasts',
} as const satisfies Record<PrivacyComplianceCost, string>

/** The tools, least revealing first. */
export const PRIVACY_CLEAN_ORIGIN_TOOLS = {
  proof: 'a proof that reveals nothing else',
  payment: 'per-payment disclosure',
  key: 'one key that opens everything',
  public: 'not needed, the origin is public',
  none: 'none',
} as const satisfies Record<PrivacyCleanOriginTool, string>

/** The section's three parts. The page puts each part's facts under its heading, above the prose. */
export const PRIVACY_COMPLIANCE_HEADINGS = [
  'Enforcement',
  'Data access',
  'Proof of clean origin',
] as const
