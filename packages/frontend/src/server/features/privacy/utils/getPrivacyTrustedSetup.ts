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
  /** Shown beside the dot, see getTrustedSetupLabel. */
  label: string | undefined
}

export type PrivacyTrustedSetupSummary = PrivacySummaryValue &
  Pick<PrivacyTrustedSetup, 'risk' | 'label'>

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

const NO_SETUP: Omit<PrivacyTrustedSetup, 'label'> = {
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
    return { ...NO_SETUP, label: getTrustedSetupLabel(NO_SETUP) }
  }

  const { proofSystem: _proofSystem, ...result } = trustedSetup
  return { ...result, label: getTrustedSetupLabel(result) }
}

/**
 * The participant count. The no-setup and transparent-setup dots are named
 * instead, and a ceremony without a published count is left unlabelled.
 */
function getTrustedSetupLabel(
  trustedSetup: Pick<PrivacyTrustedSetup, 'name' | 'risk' | 'participantCount'>,
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
  return {
    value: trustedSetup.label ?? trustedSetup.name,
    sentiment: TRUSTED_SETUP_RISK_TO_SENTIMENT[trustedSetup.risk],
    description: `${trustedSetup.name}: ${trustedSetup.shortDescription}`,
    risk: trustedSetup.risk,
    label: trustedSetup.label,
  }
}
