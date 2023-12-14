import { Logger } from '@l2beat/backend-tools'
import { DiscoveryDiff } from '@l2beat/discovery'
import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import {
  UpdateNotifierRecord,
  UpdateNotifierRepository,
} from '../../peripherals/database/discovery/UpdateNotifierRepository'
import { FieldThrottler } from './FieldThrottler'

describe(FieldThrottler.name, () => {
  const OCCURRENCE_LIMIT = 2
  const HOUR_RANGE = 1
  const PROJECT = 'project'

  const ADDRESS_A = EthereumAddress.random()
  const ADDRESS_B = EthereumAddress.random()
  const ADDRESS_C = EthereumAddress.random()
  const FIELDS_A = [{ key: 'foo' }, { key: 'bar' }, { key: 'baz' }]
  const FIELDS_B = [{ key: 'qux' }, { key: 'quax' }, { key: 'quaz' }]
  const FIELDS_C = [{ key: 'duck' }, { key: 'quack' }]

  const DIFF: DiscoveryDiff[] = [
    {
      name: 'ContractA',
      address: ADDRESS_A,
      diff: FIELDS_A,
    },
    {
      name: 'ContractB',
      address: ADDRESS_B,
      diff: FIELDS_B,
    },
    {
      name: 'ContractC',
      address: ADDRESS_C,
      diff: FIELDS_C,
    },
  ]

  it('correctly throttles diffs', async () => {
    const repository = mockObject<UpdateNotifierRepository>({
      getNewerThan: mockFn().returnsOnce([
        mockRecord([
          {
            name: 'ContractA',
            address: ADDRESS_A,
            diff: [FIELDS_A[0]],
          },
          {
            name: 'ContractB',
            address: ADDRESS_B,
            diff: [FIELDS_B[0]],
          },
          {
            name: 'ContractB',
            address: ADDRESS_B,
            diff: [FIELDS_B[1]],
          },
          DIFF[2],
        ]),
        mockRecord([
          {
            name: 'ContractB',
            address: ADDRESS_B,
            diff: [FIELDS_B[0]],
          },
          DIFF[2],
        ]),
        mockRecord([
          {
            name: 'ContractA',
            address: ADDRESS_A,
            diff: [FIELDS_A[0]],
          },
          {
            name: 'ContractB',
            address: ADDRESS_B,
            diff: [FIELDS_B[1]],
          },
          DIFF[2],
        ]),
      ]),
    })

    const fieldThrottler = new FieldThrottler(
      repository,
      Logger.SILENT,
      OCCURRENCE_LIMIT,
      HOUR_RANGE,
    )

    expect(
      await fieldThrottler.filterDiff(PROJECT, ChainId.ETHEREUM, DIFF),
    ).toEqual([
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
    const repository = mockObject<UpdateNotifierRepository>({
      getNewerThan: mockFn().returnsOnce([mockRecord([]), mockRecord([])]),
    })

    const fieldThrottler = new FieldThrottler(
      repository,
      Logger.SILENT,
      OCCURRENCE_LIMIT,
      HOUR_RANGE,
    )

    expect(
      await fieldThrottler.filterDiff(PROJECT, ChainId.ETHEREUM, DIFF),
    ).toEqual(DIFF)
  })

  it('does nothing if database returned less diffs than limit', async () => {
    const repository = mockObject<UpdateNotifierRepository>({
      getNewerThan: mockFn().returnsOnce([mockRecord([])]),
    })

    const fieldThrottler = new FieldThrottler(
      repository,
      Logger.SILENT,
      OCCURRENCE_LIMIT,
      HOUR_RANGE,
    )

    expect(
      await fieldThrottler.filterDiff(PROJECT, ChainId.ETHEREUM, DIFF),
    ).toEqual(DIFF)
  })

  it('does nothing if database is empty', async () => {
    const repository = mockObject<UpdateNotifierRepository>({
      getNewerThan: mockFn().returnsOnce([]),
    })

    const fieldThrottler = new FieldThrottler(
      repository,
      Logger.SILENT,
      OCCURRENCE_LIMIT,
      HOUR_RANGE,
    )

    expect(
      await fieldThrottler.filterDiff(PROJECT, ChainId.ETHEREUM, DIFF),
    ).toEqual(DIFF)
  })
})

function mockRecord(diff: DiscoveryDiff[]): UpdateNotifierRecord {
  return {
    id: 1,
    createdAt: UnixTime.now().add(-30, 'minutes'),
    updatedAt: UnixTime.now().add(-30, 'minutes'),
    projectName: 'project',
    blockNumber: 24392345,
    diff: diff,
    chainId: ChainId.ETHEREUM,
  }
}
