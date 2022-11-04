import cx from 'classnames'

export function getRowVerificationClassNames(entry: {
  isVerified?: boolean
}): string {
  if (entry.isVerified === false) {
    return cx(
      'bg-red-100 hover:bg-red-100',
      'dark:bg-red-900 dark:hover:bg-red-900',
    )
  }
  return ''
}
