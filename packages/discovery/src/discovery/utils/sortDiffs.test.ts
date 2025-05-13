import { expect } from 'earl'

import type { FieldDiff } from '../output/diffContracts'
import { sortBySeverity } from './sortDiffs'

const DIFFS: FieldDiff[] = [
  { key: 'values.key6' },
  { key: 'values.key5', severity: 'LOW' },
  { key: 'values.key4' },
  { key: 'values.key3', severity: 'LOW' },
  { key: 'values.key2', severity: 'LOW' },
  { key: 'values.key1', severity: 'HIGH' },
]

describe(sortBySeverity.name, () => {
  it('sorts diffs by severity', () => {
    expect(justTheKeys(sortBySeverity(DIFFS))).toEqual([
      { key: 'values.key1' },
      { key: 'values.key5' },
      { key: 'values.key3' },
      { key: 'values.key2' },
      { key: 'values.key6' },
      { key: 'values.key4' },
    ])
  })

  it('returns empty array if diffs is undefined', () => {
    expect(sortBySeverity(undefined)).toEqual([])
  })

  it('returns diffs without sorting when no severity defined', () => {
    const diffsWithoutSeverity = justTheKeys(DIFFS)
    expect(sortBySeverity(diffsWithoutSeverity)).toEqual(diffsWithoutSeverity)
  })
})

function justTheKeys(diff: FieldDiff[]): FieldDiff[] {
  return diff.map((d) => ({ key: d.key }))
}
