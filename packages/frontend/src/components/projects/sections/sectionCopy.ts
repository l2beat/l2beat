import { formatNumberWithCommas } from '@l2beat/shared-pure'
import type { PrivacyAnonymitySetCoverage } from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetCoverage'

/*
 * Text the project page sections show and their markdown versions repeat,
 * kept in one place so the two cannot drift apart.
 */

export const STAGES_DISCLAIMER =
  'Please keep in mind that these stages do not reflect project security, this is an opinionated assessment of project maturity based on subjective criteria, created with a goal of incentivizing projects to push toward better decentralization. Each team may have taken different paths to achieve this goal.'

/** The verdict is shown bold, then the explanation after a colon. */
export const WALKAWAY_TEST = {
  passed: {
    verdict: 'The project passes the walkaway test',
    explanation:
      'users can exit in the presence of malicious operators even if the Security Council disappears.',
  },
  'not-passed': {
    verdict: 'The project does not pass the walkaway test',
    explanation:
      'users are not able to exit in the presence of malicious operators if the Security Council disappears.',
  },
} as const

/** Split around the emphasized words, which the page shows bold. */
export const APPCHAIN_STAGE_RISK = {
  before: 'Rollup operators cannot compromise the system, but being',
  emphasized: 'application-specific',
  after: 'might bring additional risk.',
} as const

export const APPCHAIN_STAGES_NOTE =
  "We're still in the process of formalizing how to properly integrate appchains in the Stages framework."

export const LIVENESS_DESCRIPTION =
  'This section shows how "live" the project\'s operators are by displaying how frequently they submit transactions of the selected type. It also highlights anomalies - significant deviations from their typical schedule.'

export const DA_BRIDGE_LIVENESS_DESCRIPTION =
  'This section shows how frequently DA attestations are submitted. It also highlights anomalies - significant deviations from the typical schedule.'

export const LAST_30_DAY_ANOMALIES_DESCRIPTION =
  'All liveness anomalies detected for this project in the last 30 days, helping you review recent downtime and availability issues.'

export const TRACKED_CONTRACTS_CHANGED_WARNING =
  'There are implementation changes to tracked contracts, anomaly data might be inaccurate.'

export function trackedTxsOutageText(scope: 'page' | 'section') {
  return `Data ${scope === 'page' ? 'on this page' : 'in this section'} may be temporarily out of date due to third-party provider issues. We're working to resolve this.`
}

export const COSTS_DESCRIPTION =
  'The section shows the operating costs that L2s pay to Ethereum.'

/** The page continues the sentence with the DA layers the project posts to. */
export const DATA_POSTED_DESCRIPTION =
  'This section shows how much data the project publishes to its data-availability (DA) layer over time.'

export const THROUGHPUT_DESCRIPTION =
  'The chart shows the actual size of data posted to the DA Layer per day for the selected time period, as well as the maximum possible throughput per day.'

export const L3_RISKS_DESCRIPTION =
  'The L3 risks depend on the individual properties of L3 and those of the host chain combined.'

export const PAST_UPGRADES_DESCRIPTION =
  'The metrics include upgrades on the currently used proxy contracts. Historical proxy contracts and changes of such are not included.'

export const NO_EXTERNAL_DEPENDENCIES =
  'This project has no external dependencies: no oracle, bridge, or other third-party contract is required for its contracts to operate.'

export const WHY_LISTED_IN_OTHERS_HEADING =
  'Why is the project listed in others?'

/** Continued by the host chain link. */
export function hostChainRisksText(riskCount: number | undefined) {
  return riskCount
    ? `There are ${riskCount} additional risks coming from the host chain`
    : 'The section considers only the L3 properties. For more details please refer to'
}

/** One sentence per line on the page. */
export const UNDER_REVIEW_DESCRIPTION = [
  'The information in the section might be incomplete or outdated.',
  'The L2BEAT Team is working to research & validate the content before publishing.',
] as const

/** Shown after a bold "Note:". */
export const SECTION_INCOMPLETE_NOTE =
  'This section requires more research and might not present accurate information.'

/** Shown after a bold "Note:". */
export const CONTRACTS_UPDATED_NOTE =
  'Contracts presented in this section had their implementations updated since the last time our team looked at this project. The information presented may be inaccurate.'

export function impactfulChangesWarning(kind: 'contracts' | 'permissions') {
  return `There are impactful changes to the following ${kind}, and part of the information might be outdated.`
}

export const ESCROW_ALL_TOKENS_INCLUDED =
  'All supported tokens in this escrow are included in the value secured calculation.'

/** Continued by the tokens. */
export const ESCROW_TOKENS_INCLUDED =
  'The following tokens are included in the value secured calculation:'

/** Follows the percentage of TVS it applies to. */
export const ADDITIONAL_TRUST_ASSUMPTIONS_COMPARISON =
  "with additional trust assumptions compared to the tokens involved and the Stage assigned to the project's canonical messaging bridge"

export const PROJECT_UNVERIFIED_CONTRACTS_WARNING =
  'This project includes unverified contracts.'

export const BRIDGE_UNVERIFIED_CONTRACTS_WARNING =
  'This bridge includes unverified contracts.'

export const DEPLOYMENT_RISKS_INTRO =
  'The current deployment carries some associated risks:'

export function l3RisksShownText(isCombined: boolean) {
  return `The information below reflects ${isCombined ? 'combined L2 & L3' : 'individual L3'} risks.`
}

export const EIGENLAYER_DATA_SOURCE = 'API provided by EigenLayer'

export function anonymitySetHistoricDescription(windowDays: number) {
  return `How many unique addresses you could have blended in with if you withdrew on a particular day after depositing during the previous ${windowDays} days. This metric is a proxy for the historic anonymity set and shows how it developed over time.`
}

export const ANONYMITY_SET_LOOKS_BACKWARDS_NOTE =
  'The metric looks backwards: it counts deposits that already happened, including from addresses that have since withdrawn. Your real anonymity also depends on deposits made after yours, which cannot be known in advance.'

export function activeNoteAnonymitySetDescription(windowDays: number) {
  return `Number of eligible active notes deposited during the previous ${windowDays} complete UTC days, measured at each day's boundary. Closed notes and pending escape withdrawals are excluded. A successful challenge restores a note. Notes must cover the displayed request budget with their original deposit and have an expiry at least as late as the boundary. This is an upper bound for API authorization anonymity: remaining balances are private, larger request budgets and traffic correlation can narrow the set, and multiple notes can belong to one user. Withdrawals identify their original deposits.`
}

export function anonymitySetCoverageNote(
  coverage: PrivacyAnonymitySetCoverage | undefined,
  windowDays: number,
) {
  if (coverage === undefined || coverage.total === 0) return undefined

  const percentage = Math.round((100 * coverage.attributed) / coverage.total)
  return `Depositors were identified for ${formatNumberWithCommas(coverage.attributed)} of ${formatNumberWithCommas(coverage.total)} deposits (${percentage}%) during the last ${windowDays} complete UTC days. The remaining deposits are not counted.`
}

export function anonymitySetByHoldingDurationDescription(windowDays: number) {
  return `An estimate of how many unique addresses you blend in with, depending on how long you leave your deposit in the pool. It is based on historic data of past deposits: each point counts depositors from the preceding period, so holding for up to ${windowDays} days effectively means blending in with everyone who deposited during the last ${windowDays} days.`
}

export function gardenVerdictText(inGarden: boolean) {
  return inGarden ? 'Grows in the garden.' : 'Not in the garden yet.'
}

/** Split around the stage, which the page shows as a badge. */
export const STAGE_DOWNGRADE_PENDING = {
  title: 'New requirements coming soon',
  before: 'The project will be downgraded to',
  stage: 'Stage 0',
  after: 'because it does not satisfy upcoming Stage 1 requirements.',
  learnMore: 'Learn more about the new requirements',
} as const
