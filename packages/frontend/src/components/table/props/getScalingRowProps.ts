import cx from 'classnames'

import { getRowVerificationClassNames } from './getRowVerificationClassNames'

interface ScalingTableEntry {
  slug: string
  isVerified?: boolean
}

export function getScalingRowProps(entry: ScalingTableEntry) {
  const href = `/scaling/projects/${entry.slug}`
  const isEthereum = entry.slug === 'ethereum'

  return {
    className: isEthereum
      ? cx(
          'bg-blue-400 hover:bg-blue-400 border-b-blue-600',
          'dark:bg-blue-900 dark:border-b-blue-500 dark:hover:bg-blue-900',
        )
      : getRowVerificationClassNames(entry),
    ['project-link']: isEthereum ? undefined : href,
  }
}
