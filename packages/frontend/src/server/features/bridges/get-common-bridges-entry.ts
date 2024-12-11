import { type Bridge } from '@l2beat/config'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { isAnySectionUnderReview } from '../scaling/utils/is-any-section-under-review'

interface Params {
  bridge: Bridge
  isVerified: boolean
  hasImplementationChanged: boolean
  hasHighSeverityFieldChanged: boolean
}

export type BridgesCommonEntry = ReturnType<typeof getCommonBridgesEntry>

export function getCommonBridgesEntry({
  bridge,
  isVerified,
  hasImplementationChanged,
  hasHighSeverityFieldChanged,
}: Params) {
  return {
    id: bridge.id,
    slug: bridge.display.slug,
    name: bridge.display.name,
    shortName: bridge.display.shortName,
    href: `/bridges/projects/${bridge.display.slug}`,
    type: bridge.display.category,
    isVerified,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: isAnySectionUnderReview(bridge),
      hasImplementationChanged,
      hasHighSeverityFieldChanged,
    }),
    warning: bridge.display.warning,
    filterable: {
      type: bridge.display.category,
      validatedBy: bridge.riskView?.validatedBy.value,
    },
  }
}
