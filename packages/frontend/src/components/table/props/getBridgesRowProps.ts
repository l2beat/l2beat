import { getRowVerificationClassNames } from './getRowVerificationClassNames'

interface BridgeTableEntry {
  type: 'layer2' | 'bridge'
  slug: string
  isArchived?: boolean
  isVerified?: boolean
}

export function getBridgesRowProps(entry: BridgeTableEntry) {
  const href =
    entry.type === 'layer2'
      ? `/scaling/projects/${entry.slug}`
      : `/bridges/projects/${entry.slug}`

  return {
    className: getRowVerificationClassNames(entry),
    href,
  }
}
