import cx from 'classnames'

export function getRowVerificationClassNames(entry: {
  isVerified?: boolean
  isUpcoming?: boolean
  showProjectUnderReview?: boolean
}): string {
  if (entry.isVerified === false) {
    return cx(
      'bg-red-100 hover:bg-red-100',
      'dark:bg-red-900 dark:hover:bg-red-900',
    )
  }
  if (entry.showProjectUnderReview === true) {
    return '!bg-yellow-200/10 hover:!bg-yellow-200/20'
  }
  if (entry.isUpcoming === true) {
    return 'bg-purple-300/80 hover:bg-purple-300 dark:bg-purple-500/40 dark:hover:bg-purple-500/60'
  }
  return ''
}
