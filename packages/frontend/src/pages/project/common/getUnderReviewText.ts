export function getUnderReviewText(
  isUnderReview: boolean | undefined,
  hasImplementationChanged: boolean | undefined,
) {
  switch (true) {
    case isUnderReview && hasImplementationChanged:
      return 'There are implementation changes and part of the information might be outdated. The project is under review.'
    case isUnderReview:
      return 'This project is under review.'
    case hasImplementationChanged:
      return 'There are implementation changes and part of the information might be outdated.'
    default:
      return ''
  }
}
