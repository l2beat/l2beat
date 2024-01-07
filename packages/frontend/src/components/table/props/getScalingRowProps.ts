import { ProjectCategory } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'

import { getRowType, getRowTypeClassNames } from './getRowType'

interface ScalingTableEntry {
  slug: string
  category?: ProjectCategory
  isArchived?: boolean
  isVerified?: boolean
  isUpcoming?: boolean
  showProjectUnderReview?: boolean
}

type ScalingRowType = 'summary' | 'tvl' | 'risks' | 'activity' | 'liveness'

export function getScalingRowProps(
  entry: ScalingTableEntry,
  type: ScalingRowType,
) {
  const href = getHref(entry.slug, type)
  const isEthereum = entry.slug === 'ethereum'
  const rowType = getRowType(entry)
  return {
    className: getRowTypeClassNames(rowType),
    href,
    'data-row-type': rowType,
    'data-slug': entry.slug,
    'data-non-filterable': isEthereum,
  }
}

function getHref(slug: ScalingTableEntry['slug'], type: ScalingRowType) {
  if (slug === 'ethereum') {
    return undefined
  }

  const base = `/scaling/projects/${slug}`
  switch (type) {
    case 'summary':
    case 'liveness':
      return base
    case 'tvl':
      return base + '/tvl-breakdown'
    case 'activity':
      return base + `?selectedChart=${type}`
    case 'risks':
      return base + '#risk-analysis'
    default:
      assertUnreachable(type)
  }
}
