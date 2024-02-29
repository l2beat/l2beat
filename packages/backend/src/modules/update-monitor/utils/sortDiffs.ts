import { ContractMeta, FieldDiff, normalizeDiffPath } from '@l2beat/discovery'

const severityAsNumber = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  NONE: 0,
}

export function sortBySeverity(
  diffs: FieldDiff[] | undefined,
  contractMeta: ContractMeta | undefined,
): FieldDiff[] {
  if (diffs === undefined) {
    return []
  }

  if (contractMeta === undefined) {
    return diffs
  }

  const result = diffs.sort((a, b) => {
    if (a.key === undefined || b.key === undefined) {
      return 0
    }

    const aKey =
      contractMeta.values[normalizeDiffPath(a.key)]?.severity ?? 'NONE'
    const bKey =
      contractMeta.values[normalizeDiffPath(b.key)]?.severity ?? 'NONE'
    return severityAsNumber[bKey] - severityAsNumber[aKey]
  })

  return result
}
