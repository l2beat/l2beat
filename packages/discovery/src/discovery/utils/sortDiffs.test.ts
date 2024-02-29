import { expect } from 'earl'

import { ContractMeta, ValueMeta } from '../config/DiscoveryMeta'
import { FieldDiff } from '../output/diffContracts'
import { sortBySeverity } from './sortDiffs'

const CONTRACT_META: ContractMeta = {
  name: 'Contract',
  values: {
    key1: valueMetaWithSeverity('HIGH'),
    key2: valueMetaWithSeverity('MEDIUM'),
    key3: valueMetaWithSeverity('LOW'),
    key5: valueMetaWithSeverity('LOW'),
  },
}

const DIFFS: FieldDiff[] = [
  { key: 'values.key6' },
  { key: 'values.key5' },
  { key: 'values.key4' },
  { key: 'values.key3' },
  { key: 'values.key2' },
  { key: 'values.key1' },
]

describe(sortBySeverity.name, () => {
  it('sorts diffs by severity', () => {
    expect(sortBySeverity(DIFFS, CONTRACT_META)).toEqual([
      { key: 'values.key1' },
      { key: 'values.key2' },
      { key: 'values.key5' },
      { key: 'values.key3' },
      { key: 'values.key6' },
      { key: 'values.key4' },
    ])
  })

  it('returns empty array if diffs is undefined', () => {
    expect(sortBySeverity(undefined, CONTRACT_META)).toEqual([])
    expect(sortBySeverity(undefined, undefined)).toEqual([])
  })

  it('returns diffs without sorting when contractMeta is undefined', () => {
    expect(sortBySeverity(DIFFS, undefined)).toEqual(DIFFS)
  })
})

function valueMetaWithSeverity(severity: ValueMeta['severity']) {
  return {
    description: null,
    type: null,
    severity,
  }
}
