import type { ProjectService } from '@l2beat/config'
import type {
  AggregatedInteropTransferRecord,
  Database,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { getInteropChainsData, getInteropProtocolsData } from './getInteropData'

// Why: the interop numbers cover 24 hours of a snapshot that can be hours or
// days old. Without the snapshot's time on the answer, stale numbers read as
// current ones.
// How: the database holds one promoted snapshot with one transfer; read the
// timestamp on what each endpoint returns.
describe('interop data', () => {
  const SNAPSHOT = UnixTime(1_795_000_000)

  it('stamps every protocol and chain with the snapshot time', async () => {
    const db = mockDatabase(SNAPSHOT, [transfer()])

    const protocols = await getInteropProtocolsData(db, noProjects())
    const chains = await getInteropChainsData(db, noProjects())

    expect(protocols.map((p) => p.timestamp)).toEqual([SNAPSHOT])
    expect(chains.map((c) => c.timestamp)).toEqual([SNAPSHOT, SNAPSHOT])
  })

  it('returns nothing when no snapshot was promoted yet', async () => {
    const db = mockDatabase(undefined, [])

    expect(await getInteropProtocolsData(db, noProjects())).toEqual([])
    expect(await getInteropChainsData(db, noProjects())).toEqual([])
  })
})

function transfer() {
  return {
    id: 'bridge',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    srcValueUsd: 100,
    dstValueUsd: 100,
    transferCount: 1,
    transfersWithDurationCount: 1,
    totalDurationSum: 60,
    transferTypeStats: undefined,
  } as unknown as AggregatedInteropTransferRecord
}

function mockDatabase(
  timestamp: UnixTime | undefined,
  records: AggregatedInteropTransferRecord[],
) {
  return mockObject<Database>({
    interopAggregateStatus: mockObject<Database['interopAggregateStatus']>({
      getLatestPromotedTimestamp: mockFn().resolvesTo(timestamp),
    }),
    aggregatedInteropTransfer: mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getByChainsAndTimestamp: mockFn().resolvesTo(records),
    }),
  })
}

function noProjects() {
  return mockObject<ProjectService>({
    getProjects: (async () => []) as unknown as ProjectService['getProjects'],
  })
}
