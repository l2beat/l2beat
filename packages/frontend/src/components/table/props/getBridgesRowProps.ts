import cx from 'classnames'

import { getRowVerificationClassNames } from './getRowVerificationClassNames'

interface BridgeTableEntry {
  type: 'layer2' | 'bridge'
  isVerified?: boolean
}

export function getBridgesRowProps(entry: BridgeTableEntry) {
  return {
    className: cx(
      getRowVerificationClassNames(entry),
      entry.type !== 'bridge' && 'hidden',
    ),
    'data-combined-only': entry.type !== 'bridge' ? true : undefined,
  }
}
