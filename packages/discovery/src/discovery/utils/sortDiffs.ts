import { DiscoveryContract } from '../config/RawDiscoveryConfig'
import { FieldDiff } from '../output/diffContracts'
import { normalizeDiffPath } from './normalizeDiffPath'

const severityAsNumber = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  NONE: 0,
}

export function sortBySeverity(
  diffs: FieldDiff[] | undefined,
  contract: DiscoveryContract | undefined,
): FieldDiff[] {
  if (diffs === undefined) {
    return []
  }

  if (contract === undefined) {
    return diffs
  }

  const result = diffs.sort((a, b) => {
    if (a.key === undefined || b.key === undefined) {
      return 0
    }

    const fields = contract.fields ?? {}
    const aKey = fields[normalizeDiffPath(a.key)]?.severity ?? 'NONE'
    const bKey = fields[normalizeDiffPath(b.key)]?.severity ?? 'NONE'
    return severityAsNumber[bKey] - severityAsNumber[aKey]
  })

  return result
}
