import type {
  PrivacyComplianceConsequence,
  PrivacyComplianceGatekeeper,
  PrivacyComplianceRules,
  PrivacyComplianceTiming,
  PrivacyVoluntaryDisclosure,
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
export const PRIVACY_VOLUNTARY_DISCLOSURES = {
  payment: 'one payment at a time',
  key: 'the whole history, by viewing key',
  public: 'not needed, the origin is public',
  none: 'none',
} as const satisfies Record<PrivacyVoluntaryDisclosure, string>

/** The section's two parts, in page order. */
export const PRIVACY_COMPLIANCE_HEADINGS = [
  'Enforcement',
  'Voluntary disclosure',
] as const

/** What the section opens with for a PrivacyNoCompliance. */
export const PRIVACY_NO_COMPLIANCE = 'no compliance tools'
