import type {
  PrivacySummaryValue,
  ProjectZkCatalogInfo,
  TrustedSetup,
} from '@l2beat/config'
import { formatInteger } from '@l2beat/shared-pure'
import type { TrustedSetupSectionProps } from '~/components/projects/sections/TrustedSetupsSection'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { getTrustedSetupsSectionFromTrustedSetups } from '~/utils/project/getTrustedSetupsSection'

const TRUSTED_SETUP_RISK_TO_SENTIMENT = {
  green: 'good',
  yellow: 'warning',
  red: 'bad',
  'N/A': 'neutral',
  None: 'neutral',
} as const satisfies Record<
  TrustedSetup['risk'],
  NonNullable<PrivacySummaryValue['sentiment']>
>

const NO_SETUP: TrustedSetup = {
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
): TrustedSetup {
  const trustedSetup = trustedSetups[0]
  if (!trustedSetup) {
    return NO_SETUP
  }

  const { proofSystem: _proofSystem, ...result } = trustedSetup
  return result
}

export function toTrustedSetupSummaryValue(
  trustedSetup: TrustedSetup,
): PrivacySummaryValue {
  return {
    value:
      trustedSetup.participantCount !== undefined
        ? `${formatInteger(trustedSetup.participantCount)} participants`
        : trustedSetup.name,
    sentiment: TRUSTED_SETUP_RISK_TO_SENTIMENT[trustedSetup.risk],
    description: `${trustedSetup.name}: ${trustedSetup.shortDescription}`,
  }
}

export function getPrivacyTrustedSetupsSection(
  trustedSetups: ProjectZkCatalogInfo['trustedSetups'],
): Omit<TrustedSetupSectionProps, keyof ProjectSectionProps> {
  if (trustedSetups.length > 0) {
    return getTrustedSetupsSectionFromTrustedSetups(trustedSetups)
  }

  return {
    trustedSetups: [
      {
        name: NO_SETUP.name,
        risk: NO_SETUP.risk,
        description: NO_SETUP.longDescription,
        proofSystems: [],
      },
    ],
  }
}
