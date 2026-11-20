import type { ChainHeadCursorRecord, Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { loadLivePrivacyFlows } from './getLivePrivacyFlows'

/**
 * Methodology: the database is mocked, so these tests pin which rows the
 * loader asks for and what it makes of them. The SQL behind each call is
 * tested with its repository.
 *
 * The hourly indexer of Ethereum has stored the hours up to 10:00, which end
 * at block 100. The head stored blocks 131 to 160, two seconds apart
 */
const HOUR = UnixTime.fromDate(new Date('2026-11-19T10:00:00Z'))

describe(loadLivePrivacyFlows.name, () => {
  it('reads everything in one snapshot of the database', async () => {
    const { db, snapshot } = database()

    await loadLivePrivacyFlows(db, PARAMS)

    expect(snapshot).toHaveBeenCalledTimes(1)
  })

  it("takes each configuration's seam from the block its own hours end at", async () => {
    const { db } = database({
      configurations: [
        configuration('deposits', 'ethereum', 'project', HOUR),
        // half way through an hour: read up to the block the hour ends at
        configuration('withdrawals', 'ethereum', 'project', HOUR - 1800),
        configuration('new', 'ethereum', 'project', null),
        configuration('other', 'ethereum', 'another project', HOUR),
      ],
    })

    const { state } = await loadLivePrivacyFlows(db, PARAMS)

    expect(state.configurations).toEqual([
      {
        id: 'deposits',
        chain: 'ethereum',
        bucketId: 'bucket',
        sealedUntil: HOUR,
        sealedBlock: 100,
      },
      {
        id: 'withdrawals',
        chain: 'ethereum',
        bucketId: 'bucket',
        sealedUntil: HOUR - 1800,
        sealedBlock: 100,
      },
      {
        id: 'new',
        chain: 'ethereum',
        bucketId: 'bucket',
        sealedUntil: undefined,
        sealedBlock: undefined,
      },
    ])
  })

  it('takes the cursor of the indexer of flows at the head, and checks it against the blocks the head has', async () => {
    const { db } = database({
      cursors: [
        cursor('live_privacy_flow::ethereum', 'ethereum', 160, '0x160'),
        cursor('live_privacy_flow::base', 'base', 160, '0xreplaced'),
        cursor('another_reader::ethereum', 'ethereum', 150, '0x150'),
        cursor('live_privacy_flow::arbitrum', 'arbitrum', 160, '0x160'),
      ],
    })

    const { state } = await loadLivePrivacyFlows(db, {
      ...PARAMS,
      chains: ['ethereum', 'base'],
    })

    expect([...state.cursors.keys()]).toEqual(['ethereum', 'base'])
    expect(state.cursors.get('ethereum')?.number).toEqual(160)
    expect([...state.onHead]).toEqual(['ethereum'])
    expect(state.blockGaps.get('ethereum')).toEqual(2)
  })

  it('returns the sealed flows from the time asked for, and the flows stored at the head', async () => {
    const { db, getSealed, getLive } = database()

    const { state, sealed } = await loadLivePrivacyFlows(db, PARAMS)

    expect(getSealed).toHaveBeenOnlyCalledWith(['project'], HOUR - 7200)
    expect(getLive).toHaveBeenOnlyCalledWith(['project'])
    expect(sealed).toEqual([])
    expect(state.flows).toEqual([])
    expect([...state.mismatched]).toEqual(['base'])
  })

  it('counts a chain as matched when its newest hours matched and hours with flows did since the live flows started', async () => {
    // the live flows of every chain were started over at HOUR
    const chains = ['ethereum', 'base', 'arbitrum', 'optimism']
    const { db } = database({
      cursors: chains.map((chain) =>
        cursor(`live_privacy_flow::${chain}`, chain, 160, '0x160'),
      ),
      newest: [
        { chain: 'ethereum', status: 'match', matchedRowsUntil: HOUR + 3600 },
        // only hours with no flows matched: they match whatever is stored
        { chain: 'base', status: 'match', matchedRowsUntil: undefined },
        // before the live flows were started over
        { chain: 'arbitrum', status: 'match', matchedRowsUntil: HOUR - 1 },
        {
          chain: 'optimism',
          status: 'uncovered',
          matchedRowsUntil: HOUR + 3600,
        },
      ],
    })

    const { state } = await loadLivePrivacyFlows(db, { ...PARAMS, chains })

    expect([...state.matched]).toEqual(['ethereum'])
  })
})

const PARAMS = {
  projectIds: ['project'],
  chains: ['ethereum'],
  since: HOUR - 7200,
}

function database(
  stored: {
    configurations?: ReturnType<typeof configuration>[]
    cursors?: ChainHeadCursorRecord[]
    newest?: Awaited<ReturnType<Database['liveCheck']['getNewestByChain']>>
  } = {},
) {
  const getSealed = mockFn(async (_: string[], __: UnixTime) => [])
  const getLive = mockFn(async (_: string[]) => [])
  const snapshot = mockFn((run: () => Promise<unknown>) => run())
  const blocks = Array.from({ length: 30 }, (_, i) => ({
    chain: 'ethereum',
    number: 131 + i,
    hash: `0x${131 + i}`,
    parentHash: `0x${130 + i}`,
    timestamp: HOUR + 2 * (131 + i),
    logsBloom: null,
  }))
  const db = mockObject<Database>({
    snapshot: snapshot as Database['snapshot'],
    indexerConfiguration: mockObject<Database['indexerConfiguration']>({
      getByIndexerIds: async (ids) =>
        (stored.configurations ?? []).filter((c) => ids.includes(c.indexerId)),
    }),
    chainHeadCursor: mockObject<Database['chainHeadCursor']>({
      getAll: async () => stored.cursors ?? [],
    }),
    chainHead: mockObject<Database['chainHead']>({ getAll: async () => [] }),
    chainBlock: mockObject<Database['chainBlock']>({
      getByNumberRange: async (_, from, to) =>
        blocks.filter((b) => b.number >= from && b.number <= to),
      getNewest: async (_, limit) => blocks.slice(-limit),
    }),
    liveCheck: mockObject<Database['liveCheck']>({
      getNewestByChain: async () => stored.newest ?? [],
      getChainsWith: async () => ['base'],
    }),
    livePrivacyFlowEvent: mockObject<Database['livePrivacyFlowEvent']>({
      getByProjectIds: getLive,
    }),
    privacyFlowEvent: mockObject<Database['privacyFlowEvent']>({
      getByProjectIdsSince: getSealed,
    }),
    privacyBlockTimestamp: mockObject<Database['privacyBlockTimestamp']>({
      findBlockNumberByChainAndTimestamp: async (_, timestamp) =>
        timestamp === HOUR ? 100 : undefined,
    }),
  })
  return { db, snapshot, getSealed, getLive }
}

function configuration(
  id: string,
  chain: string,
  projectId: string,
  currentHeight: number | null,
) {
  return {
    id,
    indexerId: `privacy_flow_indexer::${chain}`,
    properties: JSON.stringify({ projectId, bucketId: 'bucket' }),
    currentHeight,
    minHeight: 0,
    maxHeight: null,
  }
}

function cursor(
  indexerId: string,
  chain: string,
  number: number,
  hash: string,
): ChainHeadCursorRecord {
  return {
    indexerId,
    chain,
    sinceNumber: 90,
    // moved up since, as old rows were cleaned
    sinceTimestamp: HOUR + 7200,
    startedAt: HOUR,
    number,
    hash,
    timestamp: HOUR + 2 * number,
  }
}
