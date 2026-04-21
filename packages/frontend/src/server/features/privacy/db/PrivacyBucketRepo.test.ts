import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect } from 'earl'

import {
  getAllPrivacyBucketRows,
  type PrivacyBucketRow,
  upsertManyPrivacyBucketRows,
} from './PrivacyBucketRepo'

describe('PrivacyBucketRepo', () => {
  const originalStoragePath = process.env.PRIVACY_STORAGE_PATH
  let tempDir: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'privacy-bucket-repo-'))
    process.env.PRIVACY_STORAGE_PATH = join(tempDir, 'privacy.json')
  })

  afterEach(() => {
    if (originalStoragePath === undefined) {
      Reflect.deleteProperty(process.env, 'PRIVACY_STORAGE_PATH')
    } else {
      process.env.PRIVACY_STORAGE_PATH = originalStoragePath
    }

    rmSync(tempDir, { recursive: true, force: true })
  })

  it('returns an empty array when the file does not exist yet', () => {
    expect(getAllPrivacyBucketRows()).toEqual([])
  })

  it('upserts rows and preserves previous rows not included in later writes', () => {
    const firstRow = row({
      assetKey: 'eth',
      bucketId: '0.1',
      depositsTotal: 10,
      deposits7d: 2,
      deposits30d: 5,
      timestamp: 100,
      totalValueAmount: '123000000000000000',
      totalValueUsd: 246,
    })
    const secondRow = row({
      assetKey: 'dai',
      bucketId: '100',
      depositsTotal: 8,
      deposits7d: 1,
      deposits30d: 3,
      timestamp: 100,
      totalValueAmount: '100000000000000000000',
      priceUsd: 1,
      totalValueUsd: 100,
    })

    upsertManyPrivacyBucketRows([firstRow, secondRow])

    upsertManyPrivacyBucketRows([
      row({
        assetKey: 'eth',
        bucketId: '0.1',
        depositsTotal: 11,
        deposits7d: 3,
        deposits30d: 6,
        timestamp: 200,
        totalValueAmount: '150000000000000000',
        totalValueUsd: 300,
      }),
    ])

    expect(getAllPrivacyBucketRows()).toEqual([
      row({
        assetKey: 'dai',
        bucketId: '100',
        depositsTotal: 8,
        deposits7d: 1,
        deposits30d: 3,
        timestamp: 100,
        totalValueAmount: '100000000000000000000',
        priceUsd: 1,
        totalValueUsd: 100,
      }),
      row({
        assetKey: 'eth',
        bucketId: '0.1',
        depositsTotal: 11,
        deposits7d: 3,
        deposits30d: 6,
        timestamp: 200,
        totalValueAmount: '150000000000000000',
        totalValueUsd: 300,
      }),
    ])
  })
})

function row(overrides: Partial<PrivacyBucketRow>): PrivacyBucketRow {
  return {
    projectId: 'railgun',
    assetKey: 'eth',
    bucketId: '0.1',
    timestamp: 1,
    totalValueAmount: null,
    priceUsd: 2000,
    totalValueUsd: null,
    depositsTotal: 0,
    deposits7d: 0,
    deposits30d: 0,
    ...overrides,
  }
}
