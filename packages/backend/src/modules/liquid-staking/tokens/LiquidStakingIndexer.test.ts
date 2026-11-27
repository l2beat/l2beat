import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { MulticallV3Response } from '@l2beat/shared'
import {
  Bytes,
  ChainSpecificAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { LiquidStakingProjectConfig } from '../types'
import { LiquidStakingIndexer } from './LiquidStakingIndexer'

describe(LiquidStakingIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const start = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
  const wbeth: LiquidStakingProjectConfig = {
    configurationId: 'bbbbbbbbbbbb',
    projectId: ProjectId('wbeth'),
    sinceTimestamp: start,
    contracts: {
      type: 'wbeth',
      wBETH: ChainSpecificAddress(
        'eth:0x2222222222222222222222222222222222222222',
      ),
      unwrapToken: ChainSpecificAddress(
        'eth:0x3333333333333333333333333333333333333333',
      ),
    },
    marketQuotes: [],
  }

  const lseth = ChainSpecificAddress(
    'eth:0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549',
  )
  const liquidCollective: LiquidStakingProjectConfig = {
    configurationId: 'cccccccccccc',
    projectId: ProjectId('liquidcollective'),
    sinceTimestamp: start,
    contracts: {
      type: 'rate',
      token: lseth,
      symbol: 'LsETH',
      rate: {
        address: lseth,
        method:
          'function underlyingBalanceFromShares(uint256) view returns (uint256)',
      },
    },
    marketQuotes: [{ type: 'uniswapV3', fee: 500 }],
  }

  it('reads each hour in one multicall and saves only when asked', async () => {
    const { indexer, snapshots, rpc } = createIndexer(wbeth, [
      ok(11n),
      ok(22n),
      ok(24n),
      ok(23n),
    ])

    const save = await indexer.multiUpdate(
      start + 1,
      start + 2 * UnixTime.HOUR,
      indexer.options.configurations,
    )
    expect(rpc.multicall).toHaveBeenCalledTimes(2)
    expect(rpc.multicall).toHaveBeenNthCalledWith(
      1,
      expect.a(Array),
      Number(start + UnixTime.HOUR),
    )
    expect(snapshots.upsertMany).not.toHaveBeenCalled()

    expect(await save()).toEqual(start + 2 * UnixTime.HOUR)
    const [records] = snapshots.upsertMany.calls[0]?.args ?? []
    expect(records?.length).toEqual(2)
    expect(records?.[0]).toEqual({
      configurationId: wbeth.configurationId,
      projectId: wbeth.projectId,
      timestamp: UnixTime(start + UnixTime.HOUR),
      blockNumber: Number(start + UnixTime.HOUR),
      exchangeRate: 11n,
      lastRequestId: 23,
      lastFinalizedRequestId: 22,
      retiredLastRequestId: null,
      retiredLastFinalizedRequestId: null,
      instantExitEth: null,
      instantExitFeeBps: null,
      lockTime: 22,
      marketExitEth: null,
      marketExitValueEth: null,
    })
  })

  it('reads at most a day per update', async () => {
    const { indexer, rpc } = createIndexer(wbeth, [
      ok(1n),
      ok(2n),
      ok(3n),
      ok(4n),
    ])

    const save = await indexer.multiUpdate(
      start,
      start + 3 * UnixTime.DAY,
      indexer.options.configurations,
    )

    expect(rpc.multicall).toHaveBeenCalledTimes(24)
    expect(await save()).toEqual(start + 23 * UnixTime.HOUR)
  })

  it('retries a paused rate read directly and keeps the multicall quote', async () => {
    const { indexer, snapshots, rpc } = createIndexer(liquidCollective, [
      { success: false, data: Bytes.fromHex('0x2514f7d4') },
      ok(20n),
    ])
    rpc.call.resolvesTo(ok(11n).data)

    const save = await indexer.multiUpdate(
      start,
      start,
      indexer.options.configurations,
    )
    expect(rpc.call).toHaveBeenOnlyCalledWith(
      {
        to: ChainSpecificAddress.address(lseth),
        input: Bytes.fromHex(
          '0xf79c3f020000000000000000000000000000000000000000000000000de0b6b3a7640000',
        ),
      },
      Number(start),
    )
    expect(await save()).toEqual(start)
    const [records] = snapshots.upsertMany.calls[0]?.args ?? []
    expect(records?.[0]?.exchangeRate).toEqual(11n)
    expect(records?.[0]?.marketExitEth).toEqual(20n)
  })

  it('keeps other rate failures eligible for the normal update retry', async () => {
    const { indexer, rpc } = createIndexer(liquidCollective, [
      { success: false, data: Bytes.fromHex('0xdeadbeef') },
      ok(20n),
    ])

    await expect(
      indexer.multiUpdate(start, start, indexer.options.configurations),
    ).toBeRejectedWith('Liquid staking call reverted')
    expect(rpc.call).not.toHaveBeenCalled()
  })
})

function ok(value: bigint): MulticallV3Response {
  return {
    success: true,
    data: Bytes.fromHex(utils.defaultAbiCoder.encode(['uint256'], [value])),
  }
}

function createIndexer(
  project: LiquidStakingProjectConfig,
  responses: MulticallV3Response[],
) {
  const snapshots = mockObject<Database['liquidStakingSnapshot']>({
    upsertMany: mockFn().resolvesTo(0),
  })
  const rpc = { call: mockFn(), multicall: mockFn().resolvesTo(responses) }
  const indexer = new LiquidStakingIndexer(
    {
      parents: [],
      indexerService: mockObject<IndexerService>(),
      configurations: [
        {
          id: project.configurationId,
          minHeight: UnixTime.fromDate(new Date('2024-01-01T00:00:00Z')),
          maxHeight: null,
          properties: project,
        },
      ],
      db: mockDatabase({ liquidStakingSnapshot: snapshots }),
      rpc,
      // The block number stands in for the timestamp it was looked up for.
      blockFinder: {
        getBlockNumberAtOrBefore: mockFn(async (timestamp: UnixTime) =>
          Number(timestamp),
        ),
      },
    },
    Logger.SILENT,
  )
  return { indexer, snapshots, rpc }
}
