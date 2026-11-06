import type { ProjectPrivacyInfo } from '@l2beat/config'
import type { SyncMetadataRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getPrivacyFlowBuckets, getPrivacyFlowSync } from './getPrivacyFlowSync'

describe(getPrivacyFlowBuckets.name, () => {
  it('lists every bucket of every token with its start', () => {
    const result = getPrivacyFlowBuckets([
      { privacyInfo: privacyInfo([bucket('a', 100)]) },
      { privacyInfo: privacyInfo([bucket('b', 200), bucket('c', 300)]) },
    ])

    expect(result).toEqual([
      { id: 'a', sinceTimestamp: UnixTime(100) },
      { id: 'b', sinceTimestamp: UnixTime(200) },
      { id: 'c', sinceTimestamp: UnixTime(300) },
    ])
  })
})

describe(getPrivacyFlowSync.name, () => {
  it('reads the furthest and slowest heights of the buckets', () => {
    const result = getPrivacyFlowSync(
      [flowBucket('a', 0), flowBucket('b', 0)],
      [
        record('a', UnixTime(7_200)),
        record('b', UnixTime(1_800)),
        record('other', UnixTime(100)),
      ],
    )

    expect(result).toEqual({
      reached: UnixTime(7_200),
      slowest: UnixTime(1_800),
    })
  })

  it('counts a bucket without a synced height as just before its start', () => {
    const result = getPrivacyFlowSync(
      [flowBucket('a', 0), flowBucket('b', 2_000), flowBucket('c', 3_000)],
      [record('a', UnixTime(3_600)), record('b', null)],
    )

    expect(result).toEqual({
      reached: UnixTime(3_600),
      slowest: UnixTime(1_999),
    })
  })

  it('is undefined before any bucket has a synced height', () => {
    expect(
      getPrivacyFlowSync([flowBucket('a', 0)], [record('a', null)]),
    ).toEqual(undefined)
    expect(getPrivacyFlowSync([flowBucket('a', 0)], [])).toEqual(undefined)
  })
})

function record(id: string, syncedUntil: UnixTime | null): SyncMetadataRecord {
  return {
    feature: 'privacy',
    id,
    target: UnixTime(10_000),
    syncedUntil,
    blockTarget: null,
    blockSyncedUntil: null,
  }
}

function flowBucket(id: string, sinceTimestamp: number) {
  return { id, sinceTimestamp: UnixTime(sinceTimestamp) }
}

function privacyInfo(
  buckets: ProjectPrivacyInfo['tokens'][number]['buckets'],
): Pick<ProjectPrivacyInfo, 'tokens'> {
  return {
    tokens: [{ buckets } as ProjectPrivacyInfo['tokens'][number]],
  }
}

function bucket(
  id: string,
  sinceTimestamp: number,
): ProjectPrivacyInfo['tokens'][number]['buckets'][number] {
  return {
    id,
    sinceTimestamp: UnixTime(sinceTimestamp),
  } as ProjectPrivacyInfo['tokens'][number]['buckets'][number]
}
