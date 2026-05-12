import { Logger } from '@l2beat/backend-tools'
import type { Database, TokenDatabase } from '@l2beat/database'
import type { InteropTransferRepository } from '@l2beat/database/dist/repositories/InteropTransferRepository'
import type { TokenDbSettingRepository } from '@l2beat/database/dist/repositories/TokenDbSettingRepository'
import type { TokenIngestionQueueRepository } from '@l2beat/database/dist/repositories/TokenIngestionQueueRepository'
import { expect, mockFn, mockObject } from 'earl'
import { TokenIngestionQueueFeederLoop } from './TokenIngestionQueueFeederLoop'

describe(TokenIngestionQueueFeederLoop.name, () => {
  describe(TokenIngestionQueueFeederLoop.prototype.runOnce.name, () => {
    it('enqueues addresses after the stored cursor and advances it', async () => {
      const get = mockFn().resolvesTo({
        key: 'interop-transfers:lastSerialId',
        value: '10',
      })
      const set = mockFn().resolvesTo(undefined)
      const enqueue = mockFn().resolvesTo(undefined)
      const getTokenAddressesAfterSerialId = mockFn().resolvesTo({
        latestSerialId: '15',
        transferCount: 3,
        tokenAddresses: [
          { chain: 'ethereum', address: '0xaaa' },
          { chain: 'base', address: '0xbbb' },
        ],
      })

      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get,
            set,
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            enqueue,
          }),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<InteropTransferRepository>({
            getTokenAddressesAfterSerialId,
          }),
        }),
      })

      await loop.runOnce()

      expect(get).toHaveBeenCalledWith('interop-transfers:lastSerialId')
      expect(getTokenAddressesAfterSerialId).toHaveBeenCalledWith('10')
      expect(enqueue.calls.map((call) => call.args[0])).toEqual([
        { chain: 'ethereum', address: '0xaaa' },
        { chain: 'base', address: '0xbbb' },
      ])
      expect(set).toHaveBeenCalledWith({
        key: 'interop-transfers:lastSerialId',
        value: '15',
      })
    })

    it('starts from zero when no cursor exists', async () => {
      const getTokenAddressesAfterSerialId = mockFn().resolvesTo({
        latestSerialId: undefined,
        transferCount: 0,
        tokenAddresses: [],
      })
      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo(undefined),
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({}),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<InteropTransferRepository>({
            getTokenAddressesAfterSerialId,
          }),
        }),
      })

      await loop.runOnce()

      expect(getTokenAddressesAfterSerialId).toHaveBeenCalledWith('0')
    })

    it('does not advance the cursor when there are no new transfers', async () => {
      const set = mockFn().resolvesTo(undefined)
      const enqueue = mockFn().resolvesTo(undefined)
      const loop = createLoop({
        tokenDb: mockObject<TokenDatabase>({
          tokenDbSetting: mockObject<TokenDbSettingRepository>({
            get: mockFn().resolvesTo({
              key: 'interop-transfers:lastSerialId',
              value: '10',
            }),
            set,
          }),
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            enqueue,
          }),
        }),
        db: mockObject<Database>({
          interopTransfer: mockObject<InteropTransferRepository>({
            getTokenAddressesAfterSerialId: mockFn().resolvesTo({
              latestSerialId: undefined,
              transferCount: 0,
              tokenAddresses: [],
            }),
          }),
        }),
      })

      await loop.runOnce()

      expect(enqueue).toHaveBeenCalledTimes(0)
      expect(set).toHaveBeenCalledTimes(0)
    })
  })
})

function createLoop(deps: { db: Database; tokenDb: TokenDatabase }) {
  return new TokenIngestionQueueFeederLoop(
    deps.db,
    deps.tokenDb,
    Logger.SILENT,
    { intervalMs: 60_000 },
  )
}
