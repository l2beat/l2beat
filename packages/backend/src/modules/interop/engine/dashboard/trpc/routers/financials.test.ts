import type { Database, InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createFinancialsRouter } from './financials'

const EXPECTED_FILTER = {
  transferId: 'msg1',
  srcChain: undefined,
  srcTokenAddress:
    '0x000000000000000000000000abc0000000000000000000000000000000000123',
  srcAbstractTokenId: undefined,
  srcSymbol: undefined,
  dstChain: undefined,
  dstTokenAddress: undefined,
  dstAbstractTokenId: undefined,
  dstSymbol: 'USDC',
  from: UnixTime(100),
  to: UnixTime(200),
}

const FILTER_INPUT = {
  transferId: ' msg1 ',
  srcTokenAddress: '0xAbC0000000000000000000000000000000000123',
  dstSymbol: 'USDC',
  from: 100,
  to: 200,
}

describe(createFinancialsRouter.name, () => {
  describe('transfers', () => {
    it('rejects a query without any filter', async () => {
      const caller = createCaller(mockObject<Database>({}))

      await expect(caller.transfers({ transferId: '  ' })).toBeRejectedWith(
        'At least one filter is required',
      )
    })

    it('rejects an inverted time range', async () => {
      const caller = createCaller(mockObject<Database>({}))

      await expect(caller.transfers({ from: 200, to: 100 })).toBeRejected()
    })

    it('queries transfers and stats with a normalized filter', async () => {
      const record = transfer('msg1')
      const stats = {
        totalCount: 1234,
        unprocessedCount: 12,
        missingSrcValueCount: 3,
        missingDstValueCount: 4,
        srcValueUsdSum: 1000,
        dstValueUsdSum: 900,
      }
      const getByFilter = mockFn().resolvesTo([record])
      const getStatsByFilter = mockFn().resolvesTo(stats)
      const db = mockObject<Database>({
        interopTransfer: mockObject<Database['interopTransfer']>({
          getByFinancialsFilter: getByFilter,
          getFinancialsStatsByFilter: getStatsByFilter,
        }),
      })

      const result = await createCaller(db).transfers(FILTER_INPUT)

      expect(getByFilter).toHaveBeenOnlyCalledWith(EXPECTED_FILTER, 1000)
      expect(getStatsByFilter).toHaveBeenOnlyCalledWith(EXPECTED_FILTER)
      expect(result.stats).toEqual(stats)
      expect(result.limit).toEqual(1000)
      expect(result.transfers).toEqual([
        {
          transferId: 'msg1',
          plugin: 'plugin',
          type: 'transfer',
          timestamp: UnixTime(100),
          isProcessed: false,
          srcChain: 'ethereum',
          srcTokenAddress: '0x1111',
          srcAbstractTokenId: 'ethereum',
          srcSymbol: 'ETH',
          srcAmount: 1,
          srcPrice: 2000,
          srcValueUsd: 2000,
          dstChain: 'arbitrum',
          dstTokenAddress: '0x2222',
          dstAbstractTokenId: 'ethereum',
          dstSymbol: 'ETH',
          dstAmount: 1,
          dstPrice: 2000,
          dstValueUsd: 2000,
        },
      ])
    })
  })

  describe('reprocess', () => {
    it('rejects a mutation without any filter', async () => {
      const caller = createCaller(mockObject<Database>({}))

      await expect(caller.reprocess({})).toBeRejectedWith(
        'At least one filter is required',
      )
    })

    it('marks transfers matching the normalized filter as unprocessed', async () => {
      const markAsUnprocessedByFilter = mockFn().resolvesTo(42)
      const db = mockObject<Database>({
        interopTransfer: mockObject<Database['interopTransfer']>({
          markAsUnprocessedByFinancialsFilter: markAsUnprocessedByFilter,
        }),
      })

      const result = await createCaller(db).reprocess(FILTER_INPUT)

      expect(markAsUnprocessedByFilter).toHaveBeenOnlyCalledWith(
        EXPECTED_FILTER,
      )
      expect(result).toEqual({ updatedTransfers: 42 })
    })
  })

  describe('refresh', () => {
    it('marks all transfers as unprocessed', async () => {
      const markAllAsUnprocessed = mockFn().resolvesTo(42)
      const interopTransfer = mockObject<Database['interopTransfer']>({
        markAllAsUnprocessed,
      })
      const db = mockObject<Database>({
        interopTransfer,
      })

      const result = await createCaller(db).refresh()

      expect(markAllAsUnprocessed).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ updatedTransfers: 42 })
    })
  })
})

function createCaller(db: Database) {
  const callerFactory = createCallerFactory(createFinancialsRouter())
  return callerFactory({
    headers: new Headers(),
    db,
    session: { email: 'dev@l2beat.com' },
  })
}

function transfer(
  transferId: string,
  overrides: Partial<InteropTransferRecord> = {},
): InteropTransferRecord {
  return {
    plugin: 'plugin',
    transferId,
    type: 'transfer',
    bridgeType: undefined,
    duration: 0,
    timestamp: UnixTime(100),
    srcTime: UnixTime(100),
    srcChain: 'ethereum',
    srcTxHash: `0x${transferId}src`,
    srcLogIndex: 1,
    srcEventId: `${transferId}-src-event`,
    srcTokenAddress: '0x1111',
    srcRawAmount: 1000000000000000000n,
    srcWasBurned: false,
    srcSymbol: 'ETH',
    srcAbstractTokenId: 'ethereum',
    srcAmount: 1.0,
    srcPrice: 2000.0,
    srcValueUsd: 2000.0,
    dstTime: UnixTime(100),
    dstChain: 'arbitrum',
    dstTxHash: `0x${transferId}dst`,
    dstLogIndex: 2,
    dstEventId: `${transferId}-dst-event`,
    dstTokenAddress: '0x2222',
    dstRawAmount: 1000000000000000000n,
    dstWasMinted: false,
    dstSymbol: 'ETH',
    dstAbstractTokenId: 'ethereum',
    dstAmount: 1.0,
    dstPrice: 2000.0,
    dstValueUsd: 2000.0,
    isProcessed: false,
    ...overrides,
  }
}
