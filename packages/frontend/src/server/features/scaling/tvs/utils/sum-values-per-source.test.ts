import type { ValueRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { sumValuesPerSource } from './sum-values-per-source'

describe(sumValuesPerSource.name, () => {
  it('correctly sums project TVS', () => {
    const result = sumValuesPerSource(dataSet, {
      forTotal: false,
      excludeAssociatedTokens: false,
    })

    expect(result).toEqual({
      canonical: 300000n,
      external: 3000000n,
      native: 30000000n,
    })
  })

  it('correctly sums total TVS', () => {
    const result = sumValuesPerSource(dataSet, {
      forTotal: true,
      excludeAssociatedTokens: false,
    })

    expect(result).toEqual({
      canonical: 270000n,
      external: 2700000n,
      native: 27000000n,
    })
  })

  it('correctly sums project TVS excluding associated tokens', () => {
    const result = sumValuesPerSource(dataSet, {
      forTotal: false,
      excludeAssociatedTokens: true,
    })

    expect(result).toEqual({
      canonical: 240000n,
      external: 2400000n,
      native: 24000000n,
    })
  })

  it('correctly sums total TVS excluding associated tokens', () => {
    const result = sumValuesPerSource(dataSet, {
      forTotal: true,
      excludeAssociatedTokens: true,
    })

    expect(result).toEqual({
      canonical: 60000n,
      external: 600000n,
      native: 6000000n,
    })
  })
})

const projectId = ProjectId('irrelevant')
const dataSource = 'irrelevant'
const timestamp = new UnixTime(0)

const mockRecord = {
  projectId,
  timestamp,
  dataSource,
  canonical: 100000n,
  canonicalAssociated: 20000n,
  canonicalForTotal: 90000n,
  canonicalAssociatedForTotal: 70000n,
  external: 1000000n,
  externalAssociated: 200000n,
  externalForTotal: 900000n,
  externalAssociatedForTotal: 700000n,
  native: 10000000n,
  nativeAssociated: 2000000n,
  nativeForTotal: 9000000n,
  nativeAssociatedForTotal: 7000000n,
  ether: 10000n,
  stablecoin: 10000n,
} satisfies ValueRecord

const dataSet: ValueRecord[] = [mockRecord, mockRecord, mockRecord]
