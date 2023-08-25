import { Layer2Category } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import cx from 'classnames'

import { getRowVerificationClassNames } from './getRowVerificationClassNames'

interface ScalingTableEntry {
  slug: string
  category?: Layer2Category
  isArchived?: boolean
  isVerified?: boolean
  isUpcoming?: boolean
  showProjectUnderReview?: boolean
}

type ScalingRowType = 'summary' | 'detailedTvl' | 'risks' | 'activity'

export function getScalingRowProps(
  entry: ScalingTableEntry,
  type: ScalingRowType,
) {
  const isRollup =
    entry.category === 'Optimistic Rollup' || entry.category === 'ZK Rollup'
  const href = getHref(entry.slug, type)

  const isEthereum = entry.slug === 'ethereum'
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
    className: getRowVerificationClassNames(entry),
    href,
    'data-role': 'row',
    'data-rollup': isRollup,
  }
}

function getHref(slug: ScalingTableEntry['slug'], type: ScalingRowType) {
  if (slug === 'ethereum') {
    return undefined
  }

  const base = `/scaling/projects/${slug}`
  switch (type) {
    case 'summary':
      return base
    case 'detailedTvl':
    case 'activity':
      return base + `?selectedChart=${type}`
    case 'risks':
      return base + '#risk-analysis'
    default:
      assertUnreachable(type)
  }
}
