import { type Bridge } from '@l2beat/config'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { isAnySectionUnderReview } from '../scaling/utils/is-any-section-under-review'
import { type CommonProjectEntry } from '../utils/get-common-project-entry'

interface Params {
  bridge: Bridge
  isVerified: boolean
  hasImplementationChanged: boolean
  hasHighSeverityFieldChanged: boolean
}

export interface BridgesCommonEntry extends CommonProjectEntry {
  type: 'Token Bridge' | 'Liquidity Network' | 'Hybrid'
  filterable: {
    type: 'Token Bridge' | 'Liquidity Network' | 'Hybrid'
    validatedBy: string
  }
}

export function getCommonBridgesEntry({
  bridge,
  isVerified,
  hasImplementationChanged,
  hasHighSeverityFieldChanged,
}: Params): BridgesCommonEntry {
  return {
    id: bridge.id,
    slug: bridge.display.slug,
    name: bridge.display.name,
    shortName: bridge.display.shortName,
    href: `/bridges/projects/${bridge.display.slug}`,
    type: bridge.display.category,
    filterable: {
      type: bridge.display.category,
      validatedBy: bridge.riskView?.validatedBy.value,
    },
    statuses: {
      // TODO: Check if this is correct
      yellowWarning: bridge.display.warning,
      verificationWarning: !isVerified,
      underReview: getUnderReviewStatus({
        isUnderReview: isAnySectionUnderReview(bridge),
        hasImplementationChanged,
        hasHighSeverityFieldChanged,
      }),
    },
  }
}
