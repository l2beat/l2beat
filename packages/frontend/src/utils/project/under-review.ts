import { assertUnreachable } from '@l2beat/shared-pure'

interface Params {
  isUnderReview: boolean
  hasImplementationChanged: boolean
  hasHighSeverityFieldChanged: boolean
}

export type UnderReviewStatus =
  | 'config'
  | 'implementation-change'
  | 'high-severity-field-change'
  | 'implementation-and-field-change'
  | undefined
export function getUnderReviewStatus({
  isUnderReview,
  hasHighSeverityFieldChanged,
  hasImplementationChanged,
}: Params): UnderReviewStatus {
  if (isUnderReview) {
    return 'config'
  }

  if (hasImplementationChanged && hasHighSeverityFieldChanged) {
    return 'implementation-and-field-change'
  }

  if (hasHighSeverityFieldChanged) {
    return 'high-severity-field-change'
  }
  if (hasImplementationChanged) {
    return 'implementation-change'
  }
}
export function getUnderReviewText(status: NonNullable<UnderReviewStatus>) {
  switch (status) {
    case 'config':
      return 'This project is under review.'
    case 'implementation-change':
      return 'There are implementation changes and part of the information might be outdated.'
    case 'high-severity-field-change':
      return 'There are important field changes and part of the information might be outdated.'
    case 'implementation-and-field-change':
      return 'There are implementation and important field changes, so part of the information might be outdated.'
    default:
      assertUnreachable(status)
  }
}
