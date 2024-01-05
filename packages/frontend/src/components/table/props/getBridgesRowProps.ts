import classNames from 'classnames'

import { getRowType, getRowTypeClassNames } from './getRowType'

interface BridgeTableEntry {
  type: 'layer2' | 'bridge'
  slug: string
  isArchived?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
}

export function getBridgesRowProps(entry: BridgeTableEntry) {
  const href =
    entry.type === 'layer2'
      ? `/scaling/projects/${entry.slug}`
      : `/bridges/projects/${entry.slug}`
  const rowType = getRowType(entry)
  return {
    className: classNames(
      getRowTypeClassNames(rowType),
      entry.type === 'layer2' && 'hidden',
    ),
    'data-row-type': rowType,
    'data-slug': entry.slug,
    href,
  }
}
