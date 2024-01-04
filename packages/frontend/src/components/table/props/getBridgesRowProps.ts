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

  return {
    className: classNames(
      getRowTypeClassNames(),
      entry.type === 'layer2' && 'hidden',
    ),
    'data-row-type': getRowType(entry),
    'data-slug': entry.slug,
    href,
  }
}
