import type {
  PrivacySummaryValue,
  ProjectZkCatalogInfo,
  TrustedSetup,
} from '@l2beat/config'
import { formatInteger } from '@l2beat/shared-pure'
import type { TrustedSetupRisk } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'

/** A trusted setup, or the 'None' placeholder for projects without a ZK system. */
export type PrivacyTrustedSetup = Omit<TrustedSetup, 'risk'> & {
  risk: TrustedSetupRisk
}

export type PrivacyTrustedSetupSummary = PrivacySummaryValue & {
  risk: TrustedSetupRisk
  /** Beside the dot; see getTrustedSetupLabel. */
  label: string | undefined
}

const TRUSTED_SETUP_RISK_TO_SENTIMENT = {
  green: 'good',
  yellow: 'warning',
  red: 'bad',
  'N/A': 'neutral',
  None: 'neutral',
} as const satisfies Record<
  TrustedSetupRisk,
  NonNullable<PrivacySummaryValue['sentiment']>
>

const NO_SETUP: PrivacyTrustedSetup = {
  id: 'NoSetup',
  name: 'No setup',
  risk: 'None',
  shortDescription:
    'This project does not have a ZK system and thus no setup-related trust assumptions.',
  longDescription:
    'This project does not have a ZK system and thus no setup-related trust assumptions.',
}

export function getPrivacyTrustedSetup(
  trustedSetups: ProjectZkCatalogInfo['trustedSetups'],
): PrivacyTrustedSetup {
  const trustedSetup = trustedSetups[0]
  if (!trustedSetup) {
    return NO_SETUP
  }

  const { proofSystem: _proofSystem, ...result } = trustedSetup
  return result
}

/**
 * What is written beside a trusted setup's dot: its participant count. The
 * no-setup and transparent-setup icons are labelled with their name, which is
 * what they mean. A setup whose participants are not yet published gets no
 * label rather than its name.
 */
export function getTrustedSetupLabel(
  trustedSetup: PrivacyTrustedSetup,
): string | undefined {
  if (trustedSetup.participantCount !== undefined) {
    return `${formatInteger(trustedSetup.participantCount)} participants`
  }
  return trustedSetup.risk === 'None' || trustedSetup.risk === 'N/A'
    ? trustedSetup.name
    : undefined
}

export function toTrustedSetupSummaryValue(
  trustedSetup: PrivacyTrustedSetup,
): PrivacyTrustedSetupSummary {
  const label = getTrustedSetupLabel(trustedSetup)
  return {
    // Also the tooltip heading, so it falls back to the name.
    value: label ?? trustedSetup.name,
    sentiment: TRUSTED_SETUP_RISK_TO_SENTIMENT[trustedSetup.risk],
    description: `${trustedSetup.name}: ${trustedSetup.shortDescription}`,
    risk: trustedSetup.risk,
    label,
  }
}
