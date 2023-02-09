import cx from 'classnames'

import { getRowVerificationClassNames } from './getRowVerificationClassNames'

interface BridgeTableEntry {
  type: 'layer2' | 'bridge'
  slug: string
  isVerified?: boolean
}

export function getBridgesRowProps(entry: BridgeTableEntry) {
  const href =
    entry.type === 'layer2'
      ? `/scaling/projects/${entry.slug}`
      : `/bridges/projects/${entry.slug}`

  return {
    className: cx(
      getRowVerificationClassNames(entry),
      entry.type !== 'bridge' && 'hidden',
    ),
    'data-combined-only': entry.type !== 'bridge' ? true : undefined,
    href,
  }
}
