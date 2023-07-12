import classNames from 'classnames'

import { getRowVerificationClassNames } from './getRowVerificationClassNames'

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
      getRowVerificationClassNames(entry),
      entry.type === 'layer2' && 'hidden',
    ),
    'data-layer2': entry.type === 'layer2' ? true : undefined,
    href,
  }
}
