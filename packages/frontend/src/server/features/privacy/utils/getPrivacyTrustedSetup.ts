import type {
  PrivacySummaryValue,
  ProjectZkCatalogInfo,
  TrustedSetup,
} from '@l2beat/config'
import type { TrustedSetupSectionProps } from '~/components/projects/sections/TrustedSetupsSection'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { getTrustedSetupsSectionFromTrustedSetups } from '~/utils/project/getTrustedSetupsSection'

const TRUSTED_SETUP_RISK_TO_SENTIMENT = {
  green: 'good',
  yellow: 'warning',
  red: 'bad',
  'N/A': 'neutral',
} as const satisfies Record<
  TrustedSetup['risk'],
  NonNullable<PrivacySummaryValue['sentiment']>
>

export function getPrivacyTrustedSetup(
  zkCatalogInfo?: ProjectZkCatalogInfo,
): TrustedSetup {
  const trustedSetup = zkCatalogInfo?.trustedSetups[0]
  if (!trustedSetup) {
    return {
      id: 'TransparentSetup',
      name: 'Transparent setup',
      risk: 'N/A',
      shortDescription:
        'No trusted setup and no additional setup-related trust assumptions.',
      longDescription:
        'Transparent proving systems require no trusted setups and have no additional setup-related trust assumptions.',
    }
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
  zkCatalogInfo?: ProjectZkCatalogInfo,
): Omit<TrustedSetupSectionProps, keyof ProjectSectionProps> {
  if (zkCatalogInfo && zkCatalogInfo.trustedSetups.length > 0) {
    return getTrustedSetupsSectionFromTrustedSetups(zkCatalogInfo.trustedSetups)
  }

  const trustedSetup = getPrivacyTrustedSetup(zkCatalogInfo)
  return {
    trustedSetups: [
      {
        name: trustedSetup.name,
        risk: trustedSetup.risk,
        description: trustedSetup.longDescription,
        proofSystems: [],
      },
    ],
  }
}
