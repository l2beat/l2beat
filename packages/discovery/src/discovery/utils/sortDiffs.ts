import type { FieldDiff } from '../output/diffContracts'

const severityAsNumber = {
  HIGH: 2,
  LOW: 1,
  NONE: 0,
}

export function sortBySeverity(diffs: FieldDiff[] | undefined): FieldDiff[] {
  if (diffs === undefined) {
    return []
  }

  const result = diffs.sort((a, b) => {
    if (a.key === undefined || b.key === undefined) {
      return 0
    }

    const aKey = a.severity ?? 'NONE'
    const bKey = b.severity ?? 'NONE'
    return severityAsNumber[bKey] - severityAsNumber[aKey]
  })

  return result
}
