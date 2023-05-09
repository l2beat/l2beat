import cx from 'classnames'

export function getRowVerificationClassNames(entry: {
  isVerified?: boolean
  isUpcoming?: boolean
}): string {
  if (entry.isVerified === false) {
    return cx(
      'bg-red-100 hover:bg-red-100',
      'dark:bg-red-900 dark:hover:bg-red-900',
    )
  }
  if (entry.isUpcoming === true) {
    return 'bg-purple-100/40 dark:hover:bg-purple-100/60'
  }
  return ''
}
