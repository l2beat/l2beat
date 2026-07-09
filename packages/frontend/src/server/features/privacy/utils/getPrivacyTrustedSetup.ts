import type { ProjectZkCatalogInfo, TrustedSetup } from '@l2beat/config'
import type { TrustedSetupSectionProps } from '~/components/projects/sections/TrustedSetupsSection'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { getTrustedSetupsSectionFromTrustedSetups } from '~/utils/project/getTrustedSetupsSection'

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
