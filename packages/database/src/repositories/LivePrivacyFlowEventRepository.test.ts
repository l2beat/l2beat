import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type LivePrivacyFlowEventRecord,
  LivePrivacyFlowEventRepository,
} from './LivePrivacyFlowEventRepository'

describeDatabase(LivePrivacyFlowEventRepository.name, (db) => {
  const repository = db.livePrivacyFlowEvent
  const START = UnixTime.toStartOf(UnixTime.now(), 'hour')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(LivePrivacyFlowEventRepository.prototype.upsertMany.name, () => {
    it('replaces a flow whose transaction moved to another block', async () => {
      await repository.upsertMany([flow('ethereum', 1), flow('ethereum', 2)])
      const moved = {
        ...flow('ethereum', 2),
        blockNumber: 3,
        blockHash: '0xother',
        timestamp: START + 3,
        // more than a double holds exactly
        amount: 123456789012345678901234567890n,
      }

      await repository.upsertMany([moved])

      expect(await repository.getAll()).toEqual([flow('ethereum', 1), moved])
    })
  })

  describe(
    LivePrivacyFlowEventRepository.prototype.getByChainInBlockRange.name,
    () => {
      it("returns the chain's flows in the range, both ends included", async () => {
        await repository.upsertMany([
          flow('ethereum', 1),
          flow('ethereum', 2),
          flow('ethereum', 3),
          flow('ethereum', 4),
          flow('base', 2),
        ])

        expect(
          await repository.getByChainInBlockRange('ethereum', 2, 3),
        ).toEqual([flow('ethereum', 2), flow('ethereum', 3)])
      })
    },
  )

  describe(
    LivePrivacyFlowEventRepository.prototype.deleteByChainAfter.name,
    () => {
      it("deletes the chain's flows above the block", async () => {
        await repository.upsertMany([
          flow('ethereum', 1),
          flow('ethereum', 2),
          flow('base', 2),
        ])

        expect(await repository.deleteByChainAfter('ethereum', 1)).toEqual(1)

        expect(await repository.getAll()).toEqual([
          flow('base', 2),
          flow('ethereum', 1),
        ])
      })
    },
  )

  describe(
    LivePrivacyFlowEventRepository.prototype.deleteByChainBefore.name,
    () => {
      it("deletes the chain's flows older than the timestamp", async () => {
        await repository.upsertMany([
          flow('ethereum', 1),
          flow('ethereum', 2),
          flow('base', 1),
        ])

        expect(
          await repository.deleteByChainBefore('ethereum', START + 2),
        ).toEqual(1)

        expect(await repository.getAll()).toEqual([
          flow('base', 1),
          flow('ethereum', 2),
        ])
      })
    },
  )

  describe(
    LivePrivacyFlowEventRepository.prototype.deleteOfOtherChains.name,
    () => {
      it('keeps the flows of the given chains only', async () => {
        await repository.upsertMany([
          flow('ethereum', 1),
          flow('base', 1),
          flow('arbitrum', 1),
        ])

        expect(await repository.deleteOfOtherChains(['ethereum'])).toEqual(2)

        expect(await repository.getAll()).toEqual([flow('ethereum', 1)])
      })

      it('deletes every flow when no chain is given', async () => {
        await repository.upsertMany([flow('ethereum', 1), flow('base', 1)])

        expect(await repository.deleteOfOtherChains([])).toEqual(2)

        expect(await repository.getAll()).toEqual([])
      })
    },
  )

  function flow(
    chain: string,
    blockNumber: number,
  ): LivePrivacyFlowEventRecord {
    return {
      configurationId: 'c'.repeat(12),
      projectId: 'project',
      bucketId: 'bucket',
      chain,
      direction: 'deposit',
      timestamp: START + blockNumber,
      blockNumber,
      blockHash: `0x${blockNumber}`,
      txHash: `0x${chain}${blockNumber}`,
      logIndex: 0,
      count: 1,
      amount: 100n,
    }
  }
})
