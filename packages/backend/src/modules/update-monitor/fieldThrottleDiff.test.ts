import type { UpdateNotifierRecord } from '@l2beat/database'
import type { DiscoveryDiff } from '@l2beat/discovery'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { fieldThrottleDiff } from './fieldThrottleDiff'

describe(fieldThrottleDiff.name, () => {
  const OCCURRENCE_LIMIT = 2

  const ADDRESS_A = ChainSpecificAddress.random()
  const ADDRESS_B = ChainSpecificAddress.random()
  const ADDRESS_C = ChainSpecificAddress.random()
  const FIELDS_A = [{ key: 'foo' }, { key: 'bar' }, { key: 'baz' }]
  const FIELDS_B = [{ key: 'qux' }, { key: 'quax' }, { key: 'quaz' }]
  const FIELDS_C = [{ key: 'duck' }, { key: 'quack' }]

  const DIFF: DiscoveryDiff[] = [
    {
      name: 'ContractA',
      address: ADDRESS_A,
      addressType: 'Contract',
      diff: FIELDS_A,
    },
    {
      name: 'ContractB',
      address: ADDRESS_B,
      addressType: 'Contract',
      diff: FIELDS_B,
    },
    {
      name: 'ContractC',
      address: ADDRESS_C,
      addressType: 'Contract',
      diff: FIELDS_C,
    },
  ]

  it('correctly throttles diffs', async () => {
    const previousRecords = [
      mockRecord([
        {
          name: 'ContractA',
          address: ADDRESS_A,
          addressType: 'Contract',
          diff: [FIELDS_A[0]],
        },
        {
          name: 'ContractB',
          address: ADDRESS_B,
          addressType: 'Contract',
          diff: [FIELDS_B[0]],
        },
        {
          name: 'ContractB',
          address: ADDRESS_B,
          addressType: 'Contract',
          diff: [FIELDS_B[1]],
        },
        DIFF[2],
      ]),
      mockRecord([
        {
          name: 'ContractB',
          address: ADDRESS_B,
          addressType: 'Contract',
          diff: [FIELDS_B[0]],
        },
        DIFF[2],
      ]),
      mockRecord([
        {
          name: 'ContractA',
          address: ADDRESS_A,
          addressType: 'Contract',
          diff: [FIELDS_A[0]],
        },
        {
          name: 'ContractB',
          address: ADDRESS_B,
          addressType: 'Contract',
          diff: [FIELDS_B[1]],
        },
        DIFF[2],
      ]),
    ]

    expect(fieldThrottleDiff(previousRecords, DIFF, OCCURRENCE_LIMIT)).toEqual([
      {
        ...DIFF[0],
        diff: DIFF[0].diff?.slice(1),
      },
      {
        ...DIFF[1],
        diff: DIFF[1].diff?.slice(2),
      },
    ])
  })

  it('does nothing if database returned correct amount of empty diffs', async () => {
    const previousRecords = [mockRecord([]), mockRecord([])]
    expect(fieldThrottleDiff(previousRecords, DIFF, OCCURRENCE_LIMIT)).toEqual(
      DIFF,
    )
  })

  it('does nothing if database returned less diffs than limit', async () => {
    const previousRecords = [mockRecord([])]
    expect(fieldThrottleDiff(previousRecords, DIFF, OCCURRENCE_LIMIT)).toEqual(
      DIFF,
    )
  })

  it('does nothing if database is empty', async () => {
    const previousRecords: ReturnType<typeof mockRecord>[] = []
    expect(fieldThrottleDiff(previousRecords, DIFF, OCCURRENCE_LIMIT)).toEqual(
      DIFF,
    )
  })
})

function mockRecord(diff: DiscoveryDiff[]): UpdateNotifierRecord {
  return {
    id: 1,
    createdAt: UnixTime.now() - 30 * UnixTime.MINUTE,
    updatedAt: UnixTime.now() - 30 * UnixTime.MINUTE,
    projectId: 'project',
    timestamp: 24392345,
    diff: diff,
  }
}
