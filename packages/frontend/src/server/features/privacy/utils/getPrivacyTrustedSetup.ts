import type { ProjectZkCatalogInfo, TrustedSetup } from '@l2beat/config'

// Mirrors config TRUSTED_SETUPS.TransparentSetup for privacy projects that
// do not provide zkCatalogInfo.
const TRANSPARENT_SETUP: TrustedSetup = {
  id: 'TransparentSetup',
  name: 'Transparent setup',
  risk: 'N/A',
  shortDescription:
    'No trusted setup and no additional setup-related trust assumptions.',
  longDescription:
    'Transparent proving systems require no trusted setups and have no additional setup-related trust assumptions.',
}

export function getPrivacyTrustedSetup(
  zkCatalogInfo?: ProjectZkCatalogInfo,
): TrustedSetup {
  const trustedSetup = zkCatalogInfo?.trustedSetups[0]
  if (!trustedSetup) {
    return TRANSPARENT_SETUP
  }

  const { proofSystem: _proofSystem, ...result } = trustedSetup
  return result
}
