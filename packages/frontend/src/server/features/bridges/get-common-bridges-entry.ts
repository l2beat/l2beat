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

export interface CommonBridgesEntry extends CommonProjectEntry {
  filterable: {
    type: string
    validatedBy: string
  }
}

export function getCommonBridgesEntry({
  bridge,
  isVerified,
  hasImplementationChanged,
  hasHighSeverityFieldChanged,
}: Params): CommonBridgesEntry {
  return {
    id: bridge.id,
    slug: bridge.display.slug,
    name: bridge.display.name,
    shortName: bridge.display.shortName,
    href: `/bridges/projects/${bridge.display.slug}`,
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
