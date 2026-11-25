import type { UnderReviewStatus } from '@l2beat/config/build/utils/scalingAssessment'
import { assertUnreachable } from '@l2beat/shared-pure'

export type { UnderReviewStatus }

export function getUnderReviewText(status: NonNullable<UnderReviewStatus>) {
  switch (status) {
    case 'config':
      return 'This project is under review.'
    case 'impactful-change':
      return 'There are impactful changes and part of the information might be outdated.'
    default:
      assertUnreachable(status)
  }
}
