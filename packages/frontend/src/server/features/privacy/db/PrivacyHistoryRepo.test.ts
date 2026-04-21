import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect } from 'earl'
import {
  applyPrivacyHistoryDelta,
  getAllPrivacyHistoryCursors,
  getAllPrivacyHistoryRows,
  type PrivacyHistoryCursor,
  type PrivacyHistoryDayRow,
} from './PrivacyHistoryRepo'

describe('PrivacyHistoryRepo', () => {
  const originalStoragePath = process.env.PRIVACY_HISTORY_STORAGE_PATH
  let tempDir: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'privacy-history-repo-'))
    process.env.PRIVACY_HISTORY_STORAGE_PATH = join(
      tempDir,
      'privacy-history.json',
    )
  })

  afterEach(() => {
    if (originalStoragePath === undefined) {
      Reflect.deleteProperty(process.env, 'PRIVACY_HISTORY_STORAGE_PATH')
    } else {
      process.env.PRIVACY_HISTORY_STORAGE_PATH = originalStoragePath
    }

    rmSync(tempDir, { recursive: true, force: true })
  })

  it('returns empty state when the file does not exist yet', () => {
    expect(getAllPrivacyHistoryRows()).toEqual([])
    expect(getAllPrivacyHistoryCursors()).toEqual([])
  })

  it('merges daily rows additively and upserts cursors', () => {
    applyPrivacyHistoryDelta(
      [
        row({
          timestamp: 100,
          depositCount: 2,
          withdrawalCount: 1,
          depositAmount: '15',
          withdrawalAmount: '4',
        }),
      ],
      [
        cursor({
          key: 'railgun::eth::bucket::deposit',
          lastSyncedBlock: 10,
          syncedAt: 1000,
        }),
      ],
    )

    applyPrivacyHistoryDelta(
      [
        row({
          timestamp: 100,
          depositCount: 3,
          withdrawalCount: 0,
          depositAmount: '20',
          withdrawalAmount: '0',
        }),
        row({
          timestamp: 200,
          depositCount: 1,
          withdrawalCount: 2,
          depositAmount: '5',
          withdrawalAmount: '8',
        }),
      ],
      [
        cursor({
          key: 'railgun::eth::bucket::deposit',
          lastSyncedBlock: 12,
          syncedAt: 1200,
        }),
        cursor({
          key: 'railgun::eth::bucket::withdrawal',
          lastSyncedBlock: 11,
          syncedAt: 1100,
        }),
      ],
    )

    expect(getAllPrivacyHistoryRows()).toEqual([
      row({
        timestamp: 100,
        depositCount: 5,
        withdrawalCount: 1,
        depositAmount: '35',
        withdrawalAmount: '4',
      }),
      row({
        timestamp: 200,
        depositCount: 1,
        withdrawalCount: 2,
        depositAmount: '5',
        withdrawalAmount: '8',
      }),
    ])
    expect(getAllPrivacyHistoryCursors()).toEqual([
      cursor({
        key: 'railgun::eth::bucket::deposit',
        lastSyncedBlock: 12,
        syncedAt: 1200,
      }),
      cursor({
        key: 'railgun::eth::bucket::withdrawal',
        lastSyncedBlock: 11,
        syncedAt: 1100,
      }),
    ])
  })
})

function row(overrides: Partial<PrivacyHistoryDayRow>): PrivacyHistoryDayRow {
  return {
    projectId: 'railgun',
    assetKey: 'eth',
    bucketId: 'bucket',
    timestamp: 1,
    depositCount: 0,
    withdrawalCount: 0,
    depositAmount: '0',
    withdrawalAmount: '0',
    ...overrides,
  }
}

function cursor(
  overrides: Partial<PrivacyHistoryCursor>,
): PrivacyHistoryCursor {
  return {
    key: 'railgun::eth::bucket::deposit',
    lastSyncedBlock: 0,
    syncedAt: 0,
    ...overrides,
  }
}
