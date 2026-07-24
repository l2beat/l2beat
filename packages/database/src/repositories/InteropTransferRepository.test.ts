import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Selectable } from 'kysely'
import type { InteropTransfer } from '../kysely/generated/types'
import { describeDatabase } from '../test/database'
import {
  hasAnyInteropTransferFinancialsFilter,
  type InteropTransferRecord,
  InteropTransferRepository,
  type InteropTransferUpdate,
  toRecord,
  toRow,
} from './InteropTransferRepository'

describeDatabase(InteropTransferRepository.name, (db) => {
  const repository = db.interopTransfer

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(InteropTransferRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        transfer('plugin1', 'msg1', 'type1', UnixTime(100), 'a', 'b', 1),
        transfer('plugin2', 'msg2', 'type2', UnixTime(200), 'b', 'a', 2),
      ]

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      const inserted = await repository.insertMany([])
      expect(inserted).toEqual(0)
    })

    it('performs batch insert when more than 1000 records', async () => {
      const records = []
      for (let i = 0; i < 1500; i++) {
        records.push(transfer('plugin', `msg${i}`, 'deposit', UnixTime(i)))
      }

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(1500)
    })

    it('handles records with undefined optional fields', async () => {
      const record = {
        plugin: 'test-plugin',
        transferId: 'test-transfer',
        type: 'deposit',
        bridgeType: undefined,
        duration: 0,
        timestamp: UnixTime(100),
        srcTime: UnixTime(100),
        srcChain: 'ethereum',
        srcTxHash: '0x123',
        srcLogIndex: 1,
        srcEventId: 'event1',
        srcTokenAddress: undefined,
        srcRawAmount: undefined,
        srcWasBurned: undefined,
        srcSymbol: undefined,
        srcAbstractTokenId: undefined,
        srcAmount: undefined,
        srcPrice: undefined,
        srcValueUsd: undefined,
        dstTime: UnixTime(100),
        dstChain: 'arbitrum',
        dstTxHash: '0x456',
        dstLogIndex: 2,
        dstEventId: 'event2',
        dstTokenAddress: undefined,
        dstRawAmount: undefined,
        dstWasMinted: undefined,
        dstSymbol: undefined,
        dstAbstractTokenId: undefined,
        dstAmount: undefined,
        dstPrice: undefined,
        dstValueUsd: undefined,
        isProcessed: false,
      }

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result).toEqual([record])
    })

    it('handles records with ethereum token addresses', async () => {
      const record = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
        'ethereum',
        'arbitrum',
        5000,
      )
      record.srcTokenAddress = EthereumAddress.random()
      record.dstTokenAddress = EthereumAddress.random()

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result[0]?.srcTokenAddress).toEqual(record.srcTokenAddress)
      expect(result[0]?.dstTokenAddress).toEqual(record.dstTokenAddress)
    })

    it('handles records with custom symbol fields', async () => {
      const record = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
        'ethereum',
        'arbitrum',
        5000,
      )
      record.srcSymbol = 'USDC'
      record.dstSymbol = 'USDC.e'

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result[0]?.srcSymbol).toEqual('USDC')
      expect(result[0]?.dstSymbol).toEqual('USDC.e')
    })

    it('persists bridgeType field', async () => {
      const record = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
        'ethereum',
        'arbitrum',
        5000,
      )
      record.bridgeType = 'lockAndMint'

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result[0]?.bridgeType).toEqual('lockAndMint')
    })

    it('preserves symbol fields when they are undefined', async () => {
      const record = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
        'ethereum',
        'arbitrum',
        5000,
      )
      record.srcSymbol = undefined
      record.dstSymbol = undefined

      const inserted = await repository.insertMany([record])
      expect(inserted).toEqual(1)

      const result = await repository.getAll()
      expect(result[0]?.srcSymbol).toEqual(undefined)
      expect(result[0]?.dstSymbol).toEqual(undefined)
    })
  })

  describe(InteropTransferRepository.prototype.getTokenRoutes.name, () => {
    it('aggregates transfers into one row per token pair and bridge-type evidence', async () => {
      const srcToken = EthereumAddress.random()
      const dstToken = EthereumAddress.random()
      const otherDstToken = EthereumAddress.random()

      const first = transfer('plugin1', 'transfer1', 'type', UnixTime(100))
      const second = transfer('plugin1', 'transfer2', 'type', UnixTime(200))
      for (const record of [first, second]) {
        record.srcTokenAddress = srcToken
        record.dstTokenAddress = dstToken
        record.bridgeType = 'lockAndMint'
      }
      const third = transfer('plugin1', 'transfer3', 'type', UnixTime(300))
      third.srcTokenAddress = srcToken
      third.dstTokenAddress = otherDstToken
      third.bridgeType = undefined
      third.srcWasBurned = true
      third.dstWasMinted = true

      await repository.insertMany([first, second, third])

      const routes = await repository.getTokenRoutes()

      expect(routes).toEqualUnsorted([
        {
          srcChain: 'ethereum',
          srcTokenAddress: srcToken,
          dstChain: 'arbitrum',
          dstTokenAddress: dstToken,
          bridgeType: 'lockAndMint',
          srcWasBurned: false,
          dstWasMinted: false,
          transferCount: 2,
          sampleTransferId: 'transfer2',
        },
        {
          srcChain: 'ethereum',
          srcTokenAddress: srcToken,
          dstChain: 'arbitrum',
          dstTokenAddress: otherDstToken,
          bridgeType: undefined,
          srcWasBurned: true,
          dstWasMinted: true,
          transferCount: 1,
          sampleTransferId: 'transfer3',
        },
      ])
    })
  })

  describe(InteropTransferRepository.prototype.findByTransferId.name, () => {
    it('returns the full transfer by id and undefined for unknown ids', async () => {
      const record = transfer('plugin1', 'transfer1', 'type', UnixTime(100))
      await repository.insertMany([record])

      expect(await repository.findByTransferId('transfer1')).toEqual(record)
      expect(await repository.findByTransferId('missing')).toEqual(undefined)
    })
  })

  describe(InteropTransferRepository.prototype.getByType.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        transfer(
          'plugin1',
          'msg1',
          'deposit',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          5000,
        ),
        transfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(200),
          'ethereum',
          'optimism',
          6000,
        ),
        transfer(
          'plugin2',
          'msg3',
          'withdraw',
          UnixTime(150),
          'arbitrum',
          'ethereum',
          7000,
        ),
        transfer(
          'plugin2',
          'msg4',
          'deposit',
          UnixTime(300),
          'polygon',
          'ethereum',
          8000,
        ),
      ])
    })

    it('returns transfers for a specific type', async () => {
      const result = await repository.getByType('deposit')

      expect(result).toHaveLength(3)
      expect(result.map((r) => r.transferId)).toEqualUnsorted([
        'msg1',
        'msg2',
        'msg4',
      ])
    })

    it('returns transfers ordered by timestamp descending', async () => {
      const result = await repository.getByType('deposit')

      expect(result.map((r) => r.timestamp)).toEqual([300, 200, 100])
    })

    it('filters by source chain when provided', async () => {
      const result = await repository.getByType('deposit', {
        srcChain: 'ethereum',
      })

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.transferId)).toEqualUnsorted(['msg1', 'msg2'])
    })

    it('filters by destination chain when provided', async () => {
      const result = await repository.getByType('deposit', {
        dstChain: 'ethereum',
      })

      expect(result).toHaveLength(1)
      expect(result[0]?.transferId).toEqual('msg4')
    })

    it('filters by both source and destination chain when provided', async () => {
      const result = await repository.getByType('deposit', {
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
      })

      expect(result).toHaveLength(1)
      expect(result[0]?.transferId).toEqual('msg1')
    })

    it('filters by plugin when provided', async () => {
      const result = await repository.getByType('deposit', {
        plugin: 'plugin1',
      })

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.transferId)).toEqualUnsorted(['msg1', 'msg2'])
    })

    it('returns empty array when no transfers match type', async () => {
      const result = await repository.getByType('nonexistent')

      expect(result).toEqual([])
    })

    it('returns empty array when no transfers match chain filters', async () => {
      const result = await repository.getByType('deposit', {
        srcChain: 'nonexistent',
      })

      expect(result).toEqual([])
    })
  })

  describe(
    InteropTransferRepository.prototype.getValueMismatchTransfers.name,
    () => {
      it('returns transfers above mismatch threshold ordered by mismatch desc', async () => {
        const lowMismatch = transfer(
          'plugin1',
          'msg1',
          'deposit',
          UnixTime(100),
          'ethereum',
          'arbitrum',
          5000,
        )
        lowMismatch.srcValueUsd = 100
        lowMismatch.dstValueUsd = 94 // 6%

        const thresholdEdge = transfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(200),
          'ethereum',
          'optimism',
          5000,
        )
        thresholdEdge.srcValueUsd = 100
        thresholdEdge.dstValueUsd = 95 // 5%

        const mediumMismatch = transfer(
          'plugin2',
          'msg3',
          'withdraw',
          UnixTime(300),
          'arbitrum',
          'ethereum',
          5000,
        )
        mediumMismatch.srcValueUsd = 100
        mediumMismatch.dstValueUsd = 60 // 40%

        const highMismatch = transfer(
          'plugin2',
          'msg4',
          'withdraw',
          UnixTime(400),
          'base',
          'ethereum',
          5000,
        )
        highMismatch.srcValueUsd = 200
        highMismatch.dstValueUsd = 100 // 50%

        const belowValueThreshold = transfer(
          'plugin2',
          'msg7',
          'withdraw',
          UnixTime(450),
          'base',
          'ethereum',
          5000,
        )
        belowValueThreshold.srcValueUsd = 100
        belowValueThreshold.dstValueUsd = 40 // below value threshold

        const missingSrcValue = transfer(
          'plugin3',
          'msg5',
          'deposit',
          UnixTime(500),
          'polygon',
          'ethereum',
          5000,
        )
        missingSrcValue.srcValueUsd = undefined
        missingSrcValue.dstValueUsd = 10

        const zeroValues = transfer(
          'plugin3',
          'msg6',
          'deposit',
          UnixTime(600),
          'polygon',
          'ethereum',
          5000,
        )
        zeroValues.srcValueUsd = 0
        zeroValues.dstValueUsd = 0

        await repository.insertMany([
          lowMismatch,
          thresholdEdge,
          mediumMismatch,
          highMismatch,
          belowValueThreshold,
          missingSrcValue,
          zeroValues,
        ])

        const result = await repository.getValueMismatchTransfers(5, 50)

        expect(result.map((x) => x.transferId)).toEqual([
          'msg4',
          'msg3',
          'msg1',
        ])
        expect(result.map((x) => x.valueDifferencePercent)).toEqual([50, 40, 6])
      })

      it('throws for negative thresholds', async () => {
        await expect(repository.getValueMismatchTransfers(-1)).toBeRejected()
      })

      it('throws for negative value threshold', async () => {
        await expect(repository.getValueMismatchTransfers(5, -1)).toBeRejected()
      })
    },
  )

  describe(InteropTransferRepository.prototype.deleteBefore.name, () => {
    it('deletes transfers before specified timestamp', async () => {
      await repository.insertMany([
        transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        transfer('plugin1', 'msg2', 'deposit', UnixTime(200)),
        transfer('plugin1', 'msg3', 'withdraw', UnixTime(300)),
        transfer('plugin1', 'msg4', 'deposit', UnixTime(400)),
      ])

      const deleted = await repository.deleteBefore(UnixTime(250))

      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toHaveLength(2)
      expect(remaining.map((r) => r.transferId)).toEqualUnsorted([
        'msg3',
        'msg4',
      ])
    })
  })

  describe(InteropTransferRepository.prototype.deleteForPlugin.name, () => {
    it('deletes transfers for a specific plugin', async () => {
      await repository.insertMany([
        transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        transfer('plugin2', 'msg2', 'deposit', UnixTime(200)),
        transfer('plugin1', 'msg3', 'withdraw', UnixTime(300)),
      ])

      const deleted = await repository.deleteForPlugin('plugin1')

      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toHaveLength(1)
      expect(remaining[0]?.transferId).toEqual('msg2')
      expect(remaining[0]?.plugin).toEqual('plugin2')
    })
  })

  describe(InteropTransferRepository.prototype.getUnprocessed.name, () => {
    it('returns only unprocessed transfers', async () => {
      const unprocessedRecord1 = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
      )
      const unprocessedRecord2 = transfer(
        'plugin1',
        'msg2',
        'withdraw',
        UnixTime(200),
      )
      const processedRecord = transfer(
        'plugin2',
        'msg3',
        'deposit',
        UnixTime(300),
      )
      processedRecord.isProcessed = true

      await repository.insertMany([
        unprocessedRecord1,
        unprocessedRecord2,
        processedRecord,
      ])

      const result = await repository.getUnprocessed()

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.transferId)).toEqualUnsorted(['msg1', 'msg2'])
      expect(result.every((r) => r.isProcessed === false)).toEqual(true)
    })

    it('returns empty array when no unprocessed transfers exist', async () => {
      const processedRecord1 = transfer(
        'plugin1',
        'msg1',
        'deposit',
        UnixTime(100),
      )
      const processedRecord2 = transfer(
        'plugin1',
        'msg2',
        'withdraw',
        UnixTime(200),
      )
      processedRecord1.isProcessed = true
      processedRecord2.isProcessed = true

      await repository.insertMany([processedRecord1, processedRecord2])

      const result = await repository.getUnprocessed()

      expect(result).toEqual([])
    })

    it('returns empty array when no transfers exist', async () => {
      const result = await repository.getUnprocessed()

      expect(result).toEqual([])
    })

    it('limits the number of returned transfers', async () => {
      await repository.insertMany([
        transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        transfer('plugin1', 'msg2', 'deposit', UnixTime(200)),
        transfer('plugin1', 'msg3', 'deposit', UnixTime(300)),
      ])

      const result = await repository.getUnprocessed(2)

      expect(result).toHaveLength(2)
      expect(result.every((r) => r.isProcessed === false)).toEqual(true)
    })
  })

  describe(
    InteropTransferRepository.prototype.getTokenAddressesAfterSerialId.name,
    () => {
      it('returns unique token addresses from transfers after the cursor', async () => {
        const first = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
        first.srcChain = 'ethereum'
        first.srcTokenAddress = '0xaaa'
        first.dstChain = 'arbitrum'
        first.dstTokenAddress = '0xbbb'

        const second = transfer('plugin1', 'msg2', 'deposit', UnixTime(200))
        second.srcChain = 'ethereum'
        second.srcTokenAddress = '0xaaa'
        second.dstChain = 'base'
        second.dstTokenAddress = undefined

        await repository.insertMany([first, second])

        const batch = await repository.getTokenAddressesAfterSerialId('0')

        expect(batch.latestSerialId).not.toEqual(undefined)
        expect(batch.tokenAddresses).toEqualUnsorted([
          { chain: 'ethereum', address: '0xaaa' },
          { chain: 'arbitrum', address: '0xbbb' },
        ])
      })

      it('uses insertion order instead of transfer timestamp', async () => {
        const oldEvent = transfer('plugin1', 'msg1', 'deposit', UnixTime(300))
        oldEvent.srcTokenAddress = '0x111'
        oldEvent.dstTokenAddress = '0x222'
        await repository.insertMany([oldEvent])

        const cursor = (await repository.getTokenAddressesAfterSerialId('0'))
          .latestSerialId
        expect(cursor).not.toEqual(undefined)

        const lateArrival = transfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(100),
        )
        lateArrival.srcTokenAddress = '0x333'
        lateArrival.dstTokenAddress = '0x444'
        await repository.insertMany([lateArrival])

        const batch = await repository.getTokenAddressesAfterSerialId(cursor!)

        expect(batch.tokenAddresses).toEqualUnsorted([
          { chain: lateArrival.srcChain, address: '0x333' },
          { chain: lateArrival.dstChain, address: '0x444' },
        ])
      })
    },
  )

  describe(InteropTransferRepository.prototype.getAfterSerialId.name, () => {
    it('returns full transfers after the cursor, paged by the limit', async () => {
      const first = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      const second = transfer('plugin1', 'msg2', 'deposit', UnixTime(200))
      const third = transfer('plugin1', 'msg3', 'deposit', UnixTime(300))
      await repository.insertMany([first, second, third])

      const firstPage = await repository.getAfterSerialId('0', 2)
      expect(firstPage.transfers.map((t) => t.transferId)).toEqual([
        'msg1',
        'msg2',
      ])
      expect(firstPage.latestSerialId).not.toEqual(undefined)

      const secondPage = await repository.getAfterSerialId(
        firstPage.latestSerialId ?? '',
        2,
      )
      expect(secondPage.transfers.map((t) => t.transferId)).toEqual(['msg3'])

      const emptyPage = await repository.getAfterSerialId(
        secondPage.latestSerialId ?? '',
        2,
      )
      expect(emptyPage.transfers).toEqual([])
      expect(emptyPage.latestSerialId).toEqual(undefined)
    })
  })

  describe(
    InteropTransferRepository.prototype.updateManyFinancials.name,
    () => {
      function financialsUpdate(
        overrides: Partial<InteropTransferUpdate> = {},
      ): InteropTransferUpdate {
        return {
          srcAbstractTokenId: null,
          srcSymbol: null,
          srcPrice: null,
          srcAmount: null,
          srcValueUsd: null,
          dstAbstractTokenId: null,
          dstSymbol: null,
          dstPrice: null,
          dstAmount: null,
          dstValueUsd: null,
          ...overrides,
        }
      }

      it('updates financial data per transfer and marks them as processed', async () => {
        await repository.insertMany([
          transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
          transfer('plugin1', 'msg2', 'withdraw', UnixTime(200)),
        ])

        await repository.updateManyFinancials([
          {
            id: 'msg1',
            update: financialsUpdate({
              srcAbstractTokenId: 'ethereum',
              srcSymbol: 'ETH',
              srcPrice: 2000.0,
              srcAmount: 1.5,
              srcValueUsd: 3000.0,
              dstAbstractTokenId: 'arbitrum-one',
              dstSymbol: 'ETH',
              dstPrice: 1999.0,
              dstAmount: 1.4,
              dstValueUsd: 2798.6,
            }),
          },
          {
            id: 'msg2',
            update: financialsUpdate({
              srcAbstractTokenId: 'ethereum',
              srcSymbol: 'USD "quoted", {escaped}',
              srcPrice: 1.0,
              srcAmount: 100,
              srcValueUsd: 100,
            }),
          },
        ])

        const result = await repository.getAll()
        const msg1 = result.find((r) => r.transferId === 'msg1')
        const msg2 = result.find((r) => r.transferId === 'msg2')

        expect(msg1?.srcAbstractTokenId).toEqual('ethereum')
        expect(msg1?.srcSymbol).toEqual('ETH')
        expect(msg1?.srcPrice).toEqual(2000.0)
        expect(msg1?.srcAmount).toEqual(1.5)
        expect(msg1?.srcValueUsd).toEqual(3000.0)
        expect(msg1?.dstAbstractTokenId).toEqual('arbitrum-one')
        expect(msg1?.dstSymbol).toEqual('ETH')
        expect(msg1?.dstPrice).toEqual(1999.0)
        expect(msg1?.dstAmount).toEqual(1.4)
        expect(msg1?.dstValueUsd).toEqual(2798.6)
        expect(msg1?.isProcessed).toEqual(true)

        expect(msg2?.srcSymbol).toEqual('USD "quoted", {escaped}')
        expect(msg2?.srcPrice).toEqual(1.0)
        expect(msg2?.dstAbstractTokenId).toEqual(undefined)
        expect(msg2?.dstSymbol).toEqual(undefined)
        expect(msg2?.isProcessed).toEqual(true)
      })

      it('sets null fields to null', async () => {
        const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
        record.srcAbstractTokenId = 'original-src'
        record.srcSymbol = 'USDT'
        record.srcPrice = 1000
        record.srcAmount = 2
        record.srcValueUsd = 2000
        record.dstAbstractTokenId = 'original-dst'
        record.dstSymbol = 'USDT.e'
        record.dstPrice = 999
        record.dstAmount = 2.1
        record.dstValueUsd = 2097.9

        await repository.insertMany([record])

        await repository.updateManyFinancials([
          { id: 'msg1', update: financialsUpdate() },
        ])

        const result = await repository.getAll()
        const updatedRecord = result[0]

        expect(updatedRecord?.srcAbstractTokenId).toEqual(undefined)
        expect(updatedRecord?.srcSymbol).toEqual(undefined)
        expect(updatedRecord?.srcPrice).toEqual(undefined)
        expect(updatedRecord?.srcAmount).toEqual(undefined)
        expect(updatedRecord?.srcValueUsd).toEqual(undefined)
        expect(updatedRecord?.dstAbstractTokenId).toEqual(undefined)
        expect(updatedRecord?.dstSymbol).toEqual(undefined)
        expect(updatedRecord?.dstPrice).toEqual(undefined)
        expect(updatedRecord?.dstAmount).toEqual(undefined)
        expect(updatedRecord?.dstValueUsd).toEqual(undefined)
        expect(updatedRecord?.isProcessed).toEqual(true)
      })

      it('does not affect other transfers', async () => {
        await repository.insertMany([
          transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
          transfer('plugin1', 'msg2', 'withdraw', UnixTime(200)),
          transfer('plugin1', 'msg3', 'deposit', UnixTime(300)),
        ])

        await repository.updateManyFinancials([
          {
            id: 'msg2',
            update: financialsUpdate({ srcPrice: 3000.0, srcAmount: 2.0 }),
          },
        ])

        const result = await repository.getAll()
        const msg1Record = result.find((r) => r.transferId === 'msg1')
        const msg2Record = result.find((r) => r.transferId === 'msg2')
        const msg3Record = result.find((r) => r.transferId === 'msg3')

        expect(msg1Record?.isProcessed).toEqual(false)
        expect(msg1Record?.srcPrice).not.toEqual(3000.0)

        expect(msg2Record?.isProcessed).toEqual(true)
        expect(msg2Record?.srcPrice).toEqual(3000.0)
        expect(msg2Record?.srcAmount).toEqual(2.0)

        expect(msg3Record?.isProcessed).toEqual(false)
        expect(msg3Record?.srcPrice).not.toEqual(3000.0)
      })

      it('ignores non-existent transfer ids', async () => {
        await repository.insertMany([
          transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        ])

        await repository.updateManyFinancials([
          {
            id: 'nonexistent-msg',
            update: financialsUpdate({ srcPrice: 3000.0 }),
          },
          { id: 'msg1', update: financialsUpdate({ srcPrice: 4000.0 }) },
        ])

        const result = await repository.getAll()
        expect(result).toHaveLength(1)
        expect(result[0]?.isProcessed).toEqual(true)
        expect(result[0]?.srcPrice).toEqual(4000.0)
      })

      it('handles empty array', async () => {
        await repository.insertMany([
          transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        ])

        await repository.updateManyFinancials([])

        const result = await repository.getAll()
        expect(result[0]?.isProcessed).toEqual(false)
      })
    },
  )

  describe(
    InteropTransferRepository.prototype.markAllAsUnprocessed.name,
    () => {
      it('sets isProcessed to false for all processed transfers', async () => {
        const processed = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
        processed.isProcessed = true
        const alreadyUnprocessed = transfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(200),
        )
        alreadyUnprocessed.isProcessed = false

        await repository.insertMany([processed, alreadyUnprocessed])

        const updatedRows = await repository.markAllAsUnprocessed()

        expect(updatedRows).toEqual(1)

        const result = await repository.getAll()
        expect(result.every((r) => r.isProcessed === false)).toEqual(true)
      })
    },
  )

  describe(
    InteropTransferRepository.prototype.markAsUnprocessedByTokens.name,
    () => {
      it('matches source-side rows', async () => {
        const target = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
        target.isProcessed = true
        target.srcChain = 'ethereum'
        target.srcTokenAddress = '0xsrc-target'

        const other = transfer('plugin1', 'msg2', 'deposit', UnixTime(200))
        other.isProcessed = true
        other.srcChain = 'ethereum'
        other.srcTokenAddress = '0xother-token'

        await repository.insertMany([target, other])

        const updatedRows = await repository.markAsUnprocessedByTokens([
          { chain: 'ethereum', tokenAddress: '0xsrc-target' },
        ])

        expect(updatedRows).toEqual(1)

        const result = await repository.getAll()
        expect(
          result.find((r) => r.transferId === 'msg1')?.isProcessed,
        ).toEqual(false)
        expect(
          result.find((r) => r.transferId === 'msg2')?.isProcessed,
        ).toEqual(true)
      })

      it('matches destination-side rows', async () => {
        const target = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
        target.isProcessed = true
        target.dstChain = 'arbitrum'
        target.dstTokenAddress = '0xdst-target'

        const other = transfer('plugin1', 'msg2', 'deposit', UnixTime(200))
        other.isProcessed = true
        other.dstChain = 'arbitrum'
        other.dstTokenAddress = '0xother-token'

        await repository.insertMany([target, other])

        const updatedRows = await repository.markAsUnprocessedByTokens([
          { chain: 'arbitrum', tokenAddress: '0xdst-target' },
        ])

        expect(updatedRows).toEqual(1)

        const result = await repository.getAll()
        expect(
          result.find((r) => r.transferId === 'msg1')?.isProcessed,
        ).toEqual(false)
        expect(
          result.find((r) => r.transferId === 'msg2')?.isProcessed,
        ).toEqual(true)
      })

      it('does not affect unrelated rows', async () => {
        const target = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
        target.isProcessed = true
        target.srcChain = 'ethereum'
        target.srcTokenAddress = '0xsrc-target'

        const other = transfer('plugin1', 'msg2', 'deposit', UnixTime(200))
        other.isProcessed = true
        other.dstChain = 'base'
        other.dstTokenAddress = '0xdst-target'

        await repository.insertMany([target, other])

        const updatedRows = await repository.markAsUnprocessedByTokens([
          { chain: 'optimism', tokenAddress: '0xmissing-token' },
        ])

        expect(updatedRows).toEqual(0)

        const result = await repository.getAll()
        expect(
          result.find((r) => r.transferId === 'msg1')?.isProcessed,
        ).toEqual(true)
        expect(
          result.find((r) => r.transferId === 'msg2')?.isProcessed,
        ).toEqual(true)
      })

      it('only updates already-processed rows', async () => {
        const processed = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
        processed.isProcessed = true
        processed.srcChain = 'ethereum'
        processed.srcTokenAddress = '0xshared-token'

        const unprocessed = transfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(200),
        )
        unprocessed.isProcessed = false
        unprocessed.srcChain = 'ethereum'
        unprocessed.srcTokenAddress = '0xshared-token'

        await repository.insertMany([processed, unprocessed])

        const updatedRows = await repository.markAsUnprocessedByTokens([
          { chain: 'ethereum', tokenAddress: '0xshared-token' },
        ])

        expect(updatedRows).toEqual(1)

        const result = await repository.getAll()
        expect(
          result.find((r) => r.transferId === 'msg1')?.isProcessed,
        ).toEqual(false)
        expect(
          result.find((r) => r.transferId === 'msg2')?.isProcessed,
        ).toEqual(false)
      })

      it('handles duplicate token filters safely', async () => {
        const target = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
        target.isProcessed = true
        target.srcChain = 'ethereum'
        target.srcTokenAddress = '0xduplicate-token'

        await repository.insertMany([target])

        const updatedRows = await repository.markAsUnprocessedByTokens([
          { chain: 'ethereum', tokenAddress: '0xduplicate-token' },
          { chain: 'ethereum', tokenAddress: '0xduplicate-token' },
        ])

        expect(updatedRows).toEqual(1)

        const result = await repository.getAll()
        expect(result[0]?.isProcessed).toEqual(false)
      })
    },
  )

  describe(InteropTransferRepository.prototype.getByRange.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
        transfer('plugin1', 'msg2', 'deposit', UnixTime(200)),
        transfer('plugin2', 'msg3', 'withdraw', UnixTime(300)),
        transfer('plugin2', 'msg4', 'deposit', UnixTime(400)),
        transfer('plugin1', 'msg5', 'withdraw', UnixTime(500)),
      ])
    })

    it('returns transfers within the specified range', async () => {
      const result = await repository.getByRange(UnixTime(200), UnixTime(400))

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.transferId)).toEqualUnsorted(['msg3', 'msg4'])
    })

    it('includes upper boundary but excludes lower boundary', async () => {
      const result = await repository.getByRange(UnixTime(100), UnixTime(500))

      expect(result).toHaveLength(4)
      expect(result.map((r) => r.transferId)).toEqualUnsorted([
        'msg2',
        'msg3',
        'msg4',
        'msg5',
      ])
    })

    it('returns empty array when no transfers in range', async () => {
      const result = await repository.getByRange(UnixTime(600), UnixTime(700))

      expect(result).toEqual([])
    })

    it('does not return transfer when range matches exactly', async () => {
      const result = await repository.getByRange(UnixTime(300), UnixTime(300))

      expect(result).toEqual([])
    })
  })

  describe(InteropTransferRepository.prototype.getProjectTransfers.name, () => {
    const snapshotTimestamp = UnixTime(2_000_000)

    it('returns all matching transfers ordered by timestamp desc then transferId desc', async () => {
      await repository.insertMany([
        transfer(
          'plugin1',
          'msg1',
          'deposit',
          snapshotTimestamp - 10,
          'ethereum',
          'arbitrum',
          10,
        ),
        transfer(
          'plugin1',
          'msg2',
          'deposit',
          snapshotTimestamp - 10,
          'ethereum',
          'base',
          10,
        ),
        transfer(
          'plugin2',
          'msg3',
          'deposit',
          snapshotTimestamp - 9,
          'optimism',
          'base',
          10,
        ),
        transfer(
          'plugin3',
          'msg4',
          'deposit',
          snapshotTimestamp - 8,
          'optimism',
          'base',
          10,
        ),
      ])

      const result = await repository.getProjectTransfers({
        snapshotTimestamp,
        sourceChains: ['ethereum', 'optimism'],
        destinationChains: ['arbitrum', 'base'],
        plugins: ['plugin1', 'plugin2'],
      })

      expect(result.map((x) => x.transferId)).toEqual(['msg3', 'msg2', 'msg1'])
    })

    it('excludes same-chain transfers and returns empty when plugins or chains are empty', async () => {
      await repository.insertMany([
        transfer(
          'plugin1',
          'msg1',
          'deposit',
          snapshotTimestamp - 10,
          'ethereum',
          'ethereum',
          10,
        ),
        transfer(
          'plugin1',
          'msg2',
          'deposit',
          snapshotTimestamp - 9,
          'ethereum',
          'arbitrum',
          10,
        ),
      ])

      const valid = await repository.getProjectTransfers({
        snapshotTimestamp,
        sourceChains: ['ethereum'],
        destinationChains: ['arbitrum', 'ethereum'],
        plugins: ['plugin1'],
      })
      const emptyPlugins = await repository.getProjectTransfers({
        snapshotTimestamp,
        sourceChains: ['ethereum'],
        destinationChains: ['arbitrum'],
        plugins: [],
      })
      const emptyChains = await repository.getProjectTransfers({
        snapshotTimestamp,
        sourceChains: [],
        destinationChains: ['arbitrum'],
        plugins: ['plugin1'],
      })

      expect(valid.map((x) => x.transferId)).toEqual(['msg2'])
      expect(emptyPlugins).toEqual([])
      expect(emptyChains).toEqual([])
    })
  })

  describe(
    InteropTransferRepository.prototype.getProjectTransfersPage.name,
    () => {
      const snapshotTimestamp = UnixTime(2_000_000)

      it('returns a limited page ordered by timestamp desc then transferId desc', async () => {
        await repository.insertMany([
          transfer(
            'plugin1',
            'msg1',
            'deposit',
            snapshotTimestamp - 10,
            'ethereum',
            'arbitrum',
            10,
          ),
          transfer(
            'plugin1',
            'msg2',
            'deposit',
            snapshotTimestamp - 10,
            'ethereum',
            'arbitrum',
            10,
          ),
          transfer(
            'plugin1',
            'msg3',
            'deposit',
            snapshotTimestamp - 9,
            'ethereum',
            'arbitrum',
            10,
          ),
          transfer(
            'plugin2',
            'msg4',
            'deposit',
            snapshotTimestamp - 8,
            'optimism',
            'base',
            10,
          ),
        ])

        const result = await repository.getProjectTransfersPage({
          snapshotTimestamp,
          sourceChains: ['ethereum', 'optimism'],
          destinationChains: ['arbitrum', 'base'],
          plugins: ['plugin1', 'plugin2'],
          limit: 2,
        })

        expect(result.map((x) => x.transferId)).toEqual(['msg4', 'msg3'])
      })

      it('returns records after the timestamp and transferId cursor', async () => {
        await repository.insertMany([
          transfer(
            'plugin1',
            'msg1',
            'deposit',
            snapshotTimestamp - 10,
            'ethereum',
            'arbitrum',
            10,
          ),
          transfer(
            'plugin1',
            'msg2',
            'deposit',
            snapshotTimestamp - 10,
            'ethereum',
            'arbitrum',
            10,
          ),
          transfer(
            'plugin1',
            'msg3',
            'deposit',
            snapshotTimestamp - 9,
            'ethereum',
            'arbitrum',
            10,
          ),
          transfer(
            'plugin2',
            'msg4',
            'deposit',
            snapshotTimestamp - 8,
            'optimism',
            'base',
            10,
          ),
        ])

        const result = await repository.getProjectTransfersPage({
          snapshotTimestamp,
          sourceChains: ['ethereum', 'optimism'],
          destinationChains: ['arbitrum', 'base'],
          plugins: ['plugin1', 'plugin2'],
          cursor: {
            timestamp: snapshotTimestamp - 9,
            transferId: 'msg3',
          },
          limit: 10,
        })

        expect(result.map((x) => x.transferId)).toEqual(['msg2', 'msg1'])
      })

      it('returns records after the transferId cursor when timestamps match', async () => {
        await repository.insertMany([
          transfer(
            'plugin1',
            'msg1',
            'deposit',
            snapshotTimestamp - 10,
            'ethereum',
            'arbitrum',
            10,
          ),
          transfer(
            'plugin1',
            'msg2',
            'deposit',
            snapshotTimestamp - 10,
            'ethereum',
            'arbitrum',
            10,
          ),
        ])

        const result = await repository.getProjectTransfersPage({
          snapshotTimestamp,
          sourceChains: ['ethereum'],
          destinationChains: ['arbitrum'],
          plugins: ['plugin1'],
          cursor: {
            timestamp: snapshotTimestamp - 10,
            transferId: 'msg2',
          },
          limit: 10,
        })

        expect(result.map((x) => x.transferId)).toEqual(['msg1'])
      })

      it('filters by abstract token id on either side', async () => {
        await repository.insertMany([
          {
            ...transfer(
              'plugin1',
              'msg1',
              'deposit',
              snapshotTimestamp - 10,
              'ethereum',
              'arbitrum',
              10,
            ),
            srcAbstractTokenId: 'tokenA',
            dstAbstractTokenId: 'tokenB',
          },
          {
            ...transfer(
              'plugin1',
              'msg2',
              'deposit',
              snapshotTimestamp - 9,
              'ethereum',
              'arbitrum',
              10,
            ),
            srcAbstractTokenId: 'tokenB',
            dstAbstractTokenId: 'tokenA',
          },
          {
            ...transfer(
              'plugin1',
              'msg3',
              'deposit',
              snapshotTimestamp - 8,
              'ethereum',
              'arbitrum',
              10,
            ),
            srcAbstractTokenId: 'tokenB',
            dstAbstractTokenId: undefined,
          },
        ])

        const result = await repository.getProjectTransfersPage({
          snapshotTimestamp,
          sourceChains: ['ethereum'],
          destinationChains: ['arbitrum'],
          plugins: ['plugin1'],
          abstractTokenId: 'tokenA',
          limit: 10,
        })

        expect(result.map((x) => x.transferId)).toEqual(['msg2', 'msg1'])
      })

      it('excludes same-chain transfers and returns empty when plugins or chains are empty', async () => {
        await repository.insertMany([
          transfer(
            'plugin1',
            'msg1',
            'deposit',
            snapshotTimestamp - 10,
            'ethereum',
            'ethereum',
            10,
          ),
          transfer(
            'plugin1',
            'msg2',
            'deposit',
            snapshotTimestamp - 9,
            'ethereum',
            'arbitrum',
            10,
          ),
        ])

        const valid = await repository.getProjectTransfersPage({
          snapshotTimestamp,
          sourceChains: ['ethereum'],
          destinationChains: ['arbitrum', 'ethereum'],
          plugins: ['plugin1'],
          limit: 10,
        })
        const emptyPlugins = await repository.getProjectTransfersPage({
          snapshotTimestamp,
          sourceChains: ['ethereum'],
          destinationChains: ['arbitrum'],
          plugins: [],
          limit: 10,
        })
        const emptyChains = await repository.getProjectTransfersPage({
          snapshotTimestamp,
          sourceChains: [],
          destinationChains: ['arbitrum'],
          plugins: ['plugin1'],
          limit: 10,
        })
        const emptyLimit = await repository.getProjectTransfersPage({
          snapshotTimestamp,
          sourceChains: ['ethereum'],
          destinationChains: ['arbitrum'],
          plugins: ['plugin1'],
          limit: 0,
        })

        expect(valid.map((x) => x.transferId)).toEqual(['msg2'])
        expect(emptyPlugins).toEqual([])
        expect(emptyChains).toEqual([])
        expect(emptyLimit).toEqual([])
      })
    },
  )

  describe(
    InteropTransferRepository.prototype.getWithPartialAbstractTokenIds.name,
    () => {
      it('returns transfers where abstract token ID exists on only one side', async () => {
        const srcNullDstSet = transfer(
          'plugin1',
          'msg1',
          'deposit',
          UnixTime(100),
          'ethereum',
          'arbitrum',
        )
        srcNullDstSet.srcAbstractTokenId = undefined
        srcNullDstSet.dstAbstractTokenId = 'token-1'

        const srcSetDstNull = transfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(200),
          'ethereum',
          'optimism',
        )
        srcSetDstNull.srcAbstractTokenId = 'token-2'
        srcSetDstNull.dstAbstractTokenId = undefined

        const bothNull = transfer(
          'plugin1',
          'msg3',
          'deposit',
          UnixTime(300),
          'arbitrum',
          'ethereum',
        )
        bothNull.srcAbstractTokenId = undefined
        bothNull.dstAbstractTokenId = undefined

        const bothSet = transfer(
          'plugin1',
          'msg4',
          'deposit',
          UnixTime(400),
          'base',
          'ethereum',
        )
        bothSet.srcAbstractTokenId = 'token-4'
        bothSet.dstAbstractTokenId = 'token-4'

        await repository.insertMany([
          srcNullDstSet,
          srcSetDstNull,
          bothNull,
          bothSet,
        ])

        const result = await repository.getWithPartialAbstractTokenIds()

        expect(result).toHaveLength(2)
        expect(result.map((r) => r.transferId)).toEqualUnsorted([
          'msg1',
          'msg2',
        ])
        expect(
          result.find((r) => r.transferId === 'msg1')?.srcAbstractTokenId,
        ).toEqual(undefined)
        expect(
          result.find((r) => r.transferId === 'msg1')?.dstAbstractTokenId,
        ).toEqual('token-1')
        expect(
          result.find((r) => r.transferId === 'msg2')?.srcAbstractTokenId,
        ).toEqual('token-2')
        expect(
          result.find((r) => r.transferId === 'msg2')?.dstAbstractTokenId,
        ).toEqual(undefined)
      })

      it('returns results ordered by timestamp desc', async () => {
        const older = transfer(
          'plugin1',
          'msg1',
          'deposit',
          UnixTime(100),
          'ethereum',
          'arbitrum',
        )
        older.srcAbstractTokenId = undefined
        older.dstAbstractTokenId = 'token-1'

        const newer = transfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(200),
          'ethereum',
          'optimism',
        )
        newer.srcAbstractTokenId = 'token-2'
        newer.dstAbstractTokenId = undefined

        await repository.insertMany([older, newer])

        const result = await repository.getWithPartialAbstractTokenIds()

        expect(result.map((r) => r.transferId)).toEqual(['msg2', 'msg1'])
      })

      it('returns empty array when no transfers have partial abstract token IDs', async () => {
        await repository.insertMany([
          transfer('plugin1', 'msg1', 'deposit', UnixTime(100)),
          transfer('plugin1', 'msg2', 'deposit', UnixTime(200)),
        ])

        const result = await repository.getWithPartialAbstractTokenIds()

        expect(result).toEqual([])
      })

      it('returns empty array when no transfers exist', async () => {
        const result = await repository.getWithPartialAbstractTokenIds()

        expect(result).toEqual([])
      })
    },
  )

  describe(
    InteropTransferRepository.prototype.getWithPartialAbstractTokenIdsForToken
      .name,
    () => {
      it('filters partial transfers to a specific chain and token address', async () => {
        const target = transfer(
          'plugin1',
          'msg1',
          'deposit',
          UnixTime(100),
          'ethereum',
          'arbitrum',
        )
        target.srcAbstractTokenId = undefined
        target.dstAbstractTokenId = 'token-1'
        target.srcTokenAddress =
          '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

        const differentAddress = transfer(
          'plugin1',
          'msg2',
          'deposit',
          UnixTime(200),
          'ethereum',
          'optimism',
        )
        differentAddress.srcAbstractTokenId = undefined
        differentAddress.dstAbstractTokenId = 'token-2'
        differentAddress.srcTokenAddress = EthereumAddress.random()

        const differentChain = transfer(
          'plugin1',
          'msg3',
          'deposit',
          UnixTime(300),
          'base',
          'ethereum',
        )
        differentChain.srcAbstractTokenId = undefined
        differentChain.dstAbstractTokenId = 'token-3'
        differentChain.srcTokenAddress =
          '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

        await repository.insertMany([target, differentAddress, differentChain])

        const result = await repository.getWithPartialAbstractTokenIdsForToken({
          chain: 'ethereum',
          address: Address32.from('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
        })

        expect(result.map((r) => r.transferId)).toEqual(['msg1'])
      })
    },
  )

  describe(InteropTransferRepository.prototype.getExistingItems.name, () => {
    it('returns rows that match the requested src/dst pairs', async () => {
      const t1 = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      t1.srcTxHash = '0xa'
      t1.dstTxHash = '0xx'
      const t2 = transfer('plugin1', 'msg2', 'deposit', UnixTime(200))
      t2.srcTxHash = '0xb'
      t2.dstTxHash = '0xy'

      await repository.insertMany([t1, t2])

      const result = await repository.getExistingItems([
        { srcTxHash: '0xa', dstTxHash: '0xx' },
        { srcTxHash: '0xb', dstTxHash: '0xy' },
      ])

      expect(result.map((r) => r.transferId)).toEqualUnsorted(['msg1', 'msg2'])
    })

    it('does not return rows that only cross-match individual hashes', async () => {
      const requested1 = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      requested1.srcTxHash = '0xa'
      requested1.dstTxHash = '0xx'
      const requested2 = transfer('plugin1', 'msg2', 'deposit', UnixTime(200))
      requested2.srcTxHash = '0xb'
      requested2.dstTxHash = '0xy'
      // Trap row: src is in the requested src list, dst is in the requested
      // dst list, but the pair (A, Y) was never asked for.
      const trap = transfer('plugin1', 'msg3', 'deposit', UnixTime(300))
      trap.srcTxHash = '0xa'
      trap.dstTxHash = '0xy'

      await repository.insertMany([requested1, requested2, trap])

      const result = await repository.getExistingItems([
        { srcTxHash: '0xa', dstTxHash: '0xx' },
        { srcTxHash: '0xb', dstTxHash: '0xy' },
      ])

      expect(result.map((r) => r.transferId)).toEqualUnsorted(['msg1', 'msg2'])
    })

    it('lowercases input tx hashes when matching', async () => {
      const record = transfer('plugin1', 'msg1', 'deposit', UnixTime(100))
      record.srcTxHash = '0xabc'
      record.dstTxHash = '0xdef'

      await repository.insertMany([record])

      const result = await repository.getExistingItems([
        { srcTxHash: '0xABC', dstTxHash: '0xDEF' },
      ])

      expect(result.map((r) => r.transferId)).toEqual(['msg1'])
    })

    it('returns empty array for empty input', async () => {
      const result = await repository.getExistingItems([])
      expect(result).toEqual([])
    })
  })

  describe(
    InteropTransferRepository.prototype.getByFinancialsFilter.name,
    () => {
      it('filters by transferId', async () => {
        const records = [financialTransfer('msg1'), financialTransfer('msg2')]
        await repository.insertMany(records)

        const result = await repository.getByFinancialsFilter(
          { transferId: 'msg1' },
          10,
        )

        expect(result).toEqual([records[0] as InteropTransferRecord])
      })

      it('filters by src and dst chain', async () => {
        const records = [
          financialTransfer('msg1', {
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
          }),
          financialTransfer('msg2', { srcChain: 'base', dstChain: 'arbitrum' }),
          financialTransfer('msg3', {
            srcChain: 'ethereum',
            dstChain: 'optimism',
          }),
        ]
        await repository.insertMany(records)

        const bySrc = await repository.getByFinancialsFilter(
          { srcChain: 'ethereum' },
          10,
        )
        expect(bySrc.map((r) => r.transferId)).toEqualUnsorted(['msg1', 'msg3'])

        const byBoth = await repository.getByFinancialsFilter(
          { srcChain: 'ethereum', dstChain: 'arbitrum' },
          10,
        )
        expect(byBoth.map((r) => r.transferId)).toEqual(['msg1'])
      })

      it('filters token fields case-insensitively', async () => {
        const records = [
          financialTransfer('msg1', {
            srcTokenAddress: '0xAbCd',
            srcAbstractTokenId: 'Token-A',
            srcSymbol: 'WETH',
          }),
          financialTransfer('msg2', {
            dstTokenAddress: '0xDeF0',
            dstAbstractTokenId: 'Token-B',
            dstSymbol: 'USDC',
          }),
        ]
        await repository.insertMany(records)

        const cases = [
          { filter: { srcTokenAddress: '0xABCD' }, expected: 'msg1' },
          { filter: { srcAbstractTokenId: 'token-a' }, expected: 'msg1' },
          { filter: { srcSymbol: 'weth' }, expected: 'msg1' },
          { filter: { dstTokenAddress: '0xdef0' }, expected: 'msg2' },
          { filter: { dstAbstractTokenId: 'TOKEN-B' }, expected: 'msg2' },
          { filter: { dstSymbol: 'usdc' }, expected: 'msg2' },
        ]
        for (const { filter, expected } of cases) {
          const result = await repository.getByFinancialsFilter(filter, 10)
          expect(result.map((r) => r.transferId)).toEqual([expected])
        }
      })

      it('filters by inclusive time range', async () => {
        const records = [
          financialTransfer('msg1', { timestamp: UnixTime(100) }),
          financialTransfer('msg2', { timestamp: UnixTime(200) }),
          financialTransfer('msg3', { timestamp: UnixTime(300) }),
        ]
        await repository.insertMany(records)

        const result = await repository.getByFinancialsFilter(
          { from: UnixTime(100), to: UnixTime(200) },
          10,
        )

        expect(result.map((r) => r.transferId)).toEqualUnsorted([
          'msg1',
          'msg2',
        ])
      })

      it('orders by timestamp and transferId descending and applies limit', async () => {
        const records = [
          financialTransfer('msgA', { timestamp: UnixTime(100) }),
          financialTransfer('msgB', { timestamp: UnixTime(100) }),
          financialTransfer('msgC', { timestamp: UnixTime(300) }),
        ]
        await repository.insertMany(records)

        const result = await repository.getByFinancialsFilter(
          { from: UnixTime(0) },
          2,
        )

        expect(result.map((r) => r.transferId)).toEqual(['msgC', 'msgB'])
      })

      it('throws when no filter is provided', async () => {
        await expect(repository.getByFinancialsFilter({}, 10)).toBeRejectedWith(
          'At least one filter is required',
        )
      })
    },
  )

  describe(
    InteropTransferRepository.prototype.getFinancialsStatsByFilter.name,
    () => {
      it('aggregates financials of all matching transfers', async () => {
        const records = [
          financialTransfer('msg1', {
            srcChain: 'ethereum',
            isProcessed: true,
            srcValueUsd: 100,
            dstValueUsd: 90,
          }),
          financialTransfer('msg2', {
            srcChain: 'ethereum',
            isProcessed: false,
            srcValueUsd: undefined,
            dstValueUsd: 50,
          }),
          financialTransfer('msg3', {
            srcChain: 'ethereum',
            isProcessed: true,
            srcValueUsd: 25,
            dstValueUsd: undefined,
          }),
          financialTransfer('other', {
            srcChain: 'base',
            isProcessed: false,
            srcValueUsd: 1000,
            dstValueUsd: 1000,
          }),
        ]
        await repository.insertMany(records)

        const stats = await repository.getFinancialsStatsByFilter({
          srcChain: 'ethereum',
        })

        expect(stats).toEqual({
          totalCount: 3,
          unprocessedCount: 1,
          missingSrcValueCount: 1,
          missingDstValueCount: 1,
          srcValueUsdSum: 125,
          dstValueUsdSum: 140,
        })
      })

      it('returns zeroes when nothing matches', async () => {
        const stats = await repository.getFinancialsStatsByFilter({
          srcChain: 'ethereum',
        })

        expect(stats).toEqual({
          totalCount: 0,
          unprocessedCount: 0,
          missingSrcValueCount: 0,
          missingDstValueCount: 0,
          srcValueUsdSum: 0,
          dstValueUsdSum: 0,
        })
      })

      it('throws when no filter is provided', async () => {
        await expect(
          repository.getFinancialsStatsByFilter({}),
        ).toBeRejectedWith('At least one filter is required')
      })
    },
  )

  describe(
    InteropTransferRepository.prototype.markAsUnprocessedByFinancialsFilter
      .name,
    () => {
      it('marks only matching processed transfers as unprocessed', async () => {
        const records = [
          financialTransfer('msg1', {
            srcChain: 'ethereum',
            isProcessed: true,
          }),
          financialTransfer('msg2', {
            srcChain: 'ethereum',
            isProcessed: false,
          }),
          financialTransfer('msg3', { srcChain: 'base', isProcessed: true }),
        ]
        await repository.insertMany(records)

        const updated = await repository.markAsUnprocessedByFinancialsFilter({
          srcChain: 'ethereum',
        })

        expect(updated).toEqual(1)
        const all = await repository.getAll()
        const processedById = new Map(
          all.map((r) => [r.transferId, r.isProcessed]),
        )
        expect(processedById.get('msg1')).toEqual(false)
        expect(processedById.get('msg2')).toEqual(false)
        expect(processedById.get('msg3')).toEqual(true)
      })

      it('supports combined filters with a time range', async () => {
        const records = [
          financialTransfer('msg1', {
            srcAbstractTokenId: 'token-a',
            timestamp: UnixTime(100),
            isProcessed: true,
          }),
          financialTransfer('msg2', {
            srcAbstractTokenId: 'token-a',
            timestamp: UnixTime(300),
            isProcessed: true,
          }),
          financialTransfer('msg3', {
            srcAbstractTokenId: 'token-b',
            timestamp: UnixTime(100),
            isProcessed: true,
          }),
        ]
        await repository.insertMany(records)

        const updated = await repository.markAsUnprocessedByFinancialsFilter({
          srcAbstractTokenId: 'token-a',
          from: UnixTime(50),
          to: UnixTime(200),
        })

        expect(updated).toEqual(1)
        const unprocessed = await repository.getUnprocessed()
        expect(unprocessed.map((r) => r.transferId)).toEqual(['msg1'])
      })

      it('throws when no filter is provided', async () => {
        await expect(
          repository.markAsUnprocessedByFinancialsFilter({}),
        ).toBeRejectedWith('At least one filter is required')
      })
    },
  )

  afterEach(async () => {
    await repository.deleteAll()
  })
})

describe(hasAnyInteropTransferFinancialsFilter.name, () => {
  it('returns false for an empty filter', () => {
    expect(hasAnyInteropTransferFinancialsFilter({})).toEqual(false)
    expect(
      hasAnyInteropTransferFinancialsFilter({ transferId: undefined }),
    ).toEqual(false)
  })

  it('returns true when any filter is set', () => {
    expect(hasAnyInteropTransferFinancialsFilter({ srcSymbol: 'ETH' })).toEqual(
      true,
    )
    expect(
      hasAnyInteropTransferFinancialsFilter({ from: UnixTime(100) }),
    ).toEqual(true)
  })
})

describe('InteropTransferRepository toRecord', () => {
  it('throws on invalid bridgeType', () => {
    const record = transfer(
      'plugin1',
      'msg1',
      'deposit',
      UnixTime(100),
      'ethereum',
      'arbitrum',
      5000,
    )
    const row = {
      ...toRow(record),
      bridgeType: 'invalid-category',
    } as Selectable<InteropTransfer>

    expect(() => toRecord(row)).toThrow(
      'Invalid interop transfer bridge type: invalid-category',
    )
  })
})

function financialTransfer(
  transferId: string,
  overrides: Partial<InteropTransferRecord> = {},
): InteropTransferRecord {
  return {
    ...transfer('plugin', transferId, 'transfer', UnixTime(100)),
    srcTokenAddress: '0x1111',
    dstTokenAddress: '0x2222',
    ...overrides,
  }
}

function transfer(
  plugin: string,
  transferId: string,
  type: string,
  timestamp: UnixTime,
  srcChain?: string,
  dstChain?: string,
  duration?: number,
): InteropTransferRecord {
  return {
    plugin,
    transferId,
    type,
    bridgeType: undefined,
    duration: duration ?? 0,
    timestamp,
    srcTime: timestamp,
    srcChain: srcChain ?? 'ethereum',
    srcTxHash: `0x${transferId}src`,
    srcLogIndex: 1,
    srcEventId: `${transferId}-src-event`,
    srcTokenAddress: EthereumAddress.random(),
    srcRawAmount: 1000000000000000000n,
    srcWasBurned: false,
    srcSymbol: 'ETH',
    srcAbstractTokenId: 'ethereum',
    srcAmount: 1.0,
    srcPrice: 2000.0,
    srcValueUsd: 2000.0,
    dstTime: timestamp + (duration ?? 0),
    dstChain: dstChain ?? 'arbitrum',
    dstTxHash: `0x${transferId}dst`,
    dstLogIndex: 2,
    dstEventId: `${transferId}-dst-event`,
    dstTokenAddress: EthereumAddress.random(),
    dstRawAmount: 1000000000000000000n,
    dstWasMinted: false,
    dstSymbol: 'ETH',
    dstAbstractTokenId: 'ethereum',
    dstAmount: 1.0,
    dstPrice: 2000.0,
    dstValueUsd: 2000.0,
    isProcessed: false,
  }
}
