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
import { mockDatabase } from '../../test/database'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import { LiquidStakingIndexer } from './LiquidStakingIndexer'
import type { LiquidStakingProjectConfig } from './types'

describe(LiquidStakingIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const start = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
  const rocketpool: LiquidStakingProjectConfig = {
    configurationId: 'aaaaaaaaaaaa',
    projectId: ProjectId('rocketpool'),
    contracts: {
      type: 'rocketpool',
      rETH: ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      ),
    },
  }
  const wbeth: LiquidStakingProjectConfig = {
    configurationId: 'bbbbbbbbbbbb',
    projectId: ProjectId('wbeth'),
    contracts: {
      type: 'wbeth',
      wBETH: ChainSpecificAddress(
        'eth:0x2222222222222222222222222222222222222222',
      ),
      unwrapToken: ChainSpecificAddress(
        'eth:0x3333333333333333333333333333333333333333',
      ),
    },
  }

  it('reads each hour in one multicall and saves only when asked', async () => {
    const { indexer, snapshots, rpc } = createIndexer(
      [rocketpool, wbeth],
      [ok(11n), ok(12n), ok(21n), ok(22n)],
    )

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
    expect(records?.length).toEqual(4)
    expect(records?.[0]).toEqual({
      configurationId: rocketpool.configurationId,
      projectId: rocketpool.projectId,
      timestamp: UnixTime(start + UnixTime.HOUR),
      blockNumber: Number(start + UnixTime.HOUR),
      exchangeRate: 11n,
      lastRequestId: null,
      lastFinalizedRequestId: null,
      instantExitEth: 12n,
      lockTime: null,
    })
    expect(records?.[1]?.lockTime).toEqual(22)
  })

  it('reads at most a day per update', async () => {
    const { indexer, rpc } = createIndexer([rocketpool], [ok(1n), ok(2n)])

    const save = await indexer.multiUpdate(
      start,
      start + 3 * UnixTime.DAY,
      indexer.options.configurations,
    )

    expect(rpc.multicall).toHaveBeenCalledTimes(24)
    expect(await save()).toEqual(start + 23 * UnixTime.HOUR)
  })

  for (const [name, failed] of [
    ['reverts', { success: false, data: Bytes.EMPTY }],
    // tryAggregate reports a call to an address without code as a success.
    ['hits an address without code', { success: true, data: Bytes.EMPTY }],
  ] as const) {
    it(`throws when a call ${name}`, async () => {
      const { indexer } = createIndexer([rocketpool], [ok(1n), failed])

      await expect(
        indexer.multiUpdate(
          start,
          start + UnixTime.HOUR,
          indexer.options.configurations,
        ),
      ).toBeRejectedWith('Liquid staking call reverted')
    })
  }
})

function ok(value: bigint): MulticallV3Response {
  return {
    success: true,
    data: Bytes.fromHex(utils.defaultAbiCoder.encode(['uint256'], [value])),
  }
}

function createIndexer(
  projects: LiquidStakingProjectConfig[],
  responses: MulticallV3Response[],
) {
  const snapshots = mockObject<Database['liquidStakingSnapshot']>({
    upsertMany: mockFn().resolvesTo(0),
  })
  const rpc = { multicall: mockFn().resolvesTo(responses) }
  const indexer = new LiquidStakingIndexer(
    {
      parents: [],
      indexerService: mockObject<IndexerService>(),
      configurations: projects.map((project) => ({
        id: project.configurationId,
        minHeight: UnixTime.fromDate(new Date('2024-01-01T00:00:00Z')),
        maxHeight: null,
        properties: project,
      })),
      db: mockDatabase({ liquidStakingSnapshot: snapshots }),
      rpc,
      // The block number stands in for the timestamp it was looked up for.
      blockTimestampProvider: {
        getBlockNumberAtOrBefore: mockFn(async (timestamp: UnixTime) =>
          Number(timestamp),
        ),
      },
    },
    Logger.SILENT,
  )
  return { indexer, snapshots, rpc }
}
