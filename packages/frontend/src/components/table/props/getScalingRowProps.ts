import cx from 'classnames'

import { getRowVerificationClassNames } from './getRowVerificationClassNames'

interface ScalingTableEntry {
  slug: string
  isArchived?: boolean
  isVerified?: boolean
  isUpcoming?: boolean
}

export function getScalingRowProps(entry: ScalingTableEntry) {
  const isEthereum = entry.slug === 'ethereum'
  const href = isEthereum ? undefined : `/scaling/projects/${entry.slug}`

  if (isEthereum) {
    return {
      className: cx(
        'bg-blue-400 hover:bg-blue-400 border-b-blue-600',
        'dark:bg-blue-900 dark:border-b-blue-500 dark:hover:bg-blue-900',
      ),
      href,
      'data-role': 'row',
    }
  }

  return {
    className: cx(
      getRowVerificationClassNames(entry),
      entry.isArchived && 'hidden opacity-[65%]',
      entry.isUpcoming &&
        cx(
          'hidden',
          'border-b-white bg-purple-300/80 hover:bg-purple-300',
          'dark:bg-purple-500/40 dark:hover:bg-purple-100',
        ),
    ),
    href,
    'data-archived': entry.isArchived,
    'data-upcoming': entry.isUpcoming,
    'data-role': 'row',
  }
}
