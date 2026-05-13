import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import { TokenIngestionQueueRepository } from './TokenIngestionQueueRepository'

describeTokenDatabase(TokenIngestionQueueRepository.name, (db) => {
  const repository = db.tokenIngestionQueue

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(TokenIngestionQueueRepository.prototype.enqueue.name, () => {
    it('inserts a pending entry and normalizes address casing', async () => {
      await repository.enqueue({ chain: 'ethereum', address: '0xABC' })

      const all = await repository.getAll()
      expect(all).toHaveLength(1)
      expect(all[0]!).toHaveSubset({
        chain: 'ethereum',
        address: '0xabc',
        state: 'pending',
        message: null,
      })
    })

    it('can insert a staged entry', async () => {
      await repository.enqueue(
        { chain: 'ethereum', address: '0xABC' },
        'staged',
      )

      const all = await repository.getAll()
      expect(all).toHaveLength(1)
      expect(all[0]!).toHaveSubset({
        chain: 'ethereum',
        address: '0xabc',
        state: 'staged',
        message: null,
      })
    })

    it('does not change an existing entry', async () => {
      const address = { chain: 'ethereum', address: '0xabc' }
      await repository.enqueue(address)
      await repository.markConflict(address, 'stored abstract token disagrees')

      await repository.enqueue(address)

      const all = await repository.getAll()
      expect(all).toHaveLength(1)
      expect(all[0]!).toHaveSubset({
        ...address,
        state: 'conflict',
        message: 'stored abstract token disagrees',
      })
    })
  })

  describe(TokenIngestionQueueRepository.prototype.findNextPending.name, () => {
    it('returns the oldest pending entry', async () => {
      const first = { chain: 'ethereum', address: '0x111' }
      const second = { chain: 'arbitrum', address: '0x222' }
      await repository.enqueue(first, 'staged')
      await repository.enqueue(second)
      await repository.markConflict(first, 'needs review')

      const next = await repository.findNextPending()

      expect(next!).toHaveSubset({
        ...second,
        state: 'pending',
        message: null,
      })
    })
  })

  describe(TokenIngestionQueueRepository.prototype.getByStates.name, () => {
    it('filters entries by state', async () => {
      const pending = { chain: 'ethereum', address: '0x111' }
      const conflict = { chain: 'arbitrum', address: '0x222' }
      const error = { chain: 'base', address: '0x333' }
      await repository.enqueue(pending)
      await repository.enqueue(conflict)
      await repository.enqueue(error)
      await repository.markConflict(conflict, 'abstract token mismatch')
      await repository.markError(error, 'RPC failed')

      const entries = await repository.getByStates(['conflict', 'error'])

      expect(entries).toHaveLength(2)
      expect(
        entries.map(({ chain, address, state, message }) => ({
          chain,
          address,
          state,
          message,
        })),
      ).toEqualUnsorted([
        {
          ...conflict,
          state: 'conflict',
          message: 'abstract token mismatch',
        },
        { ...error, state: 'error', message: 'RPC failed' },
      ])
    })
  })

  describe(TokenIngestionQueueRepository.prototype.retry.name, () => {
    it('moves conflict and error entries back to pending', async () => {
      const conflict = { chain: 'ethereum', address: '0x111' }
      const error = { chain: 'arbitrum', address: '0x222' }
      await repository.enqueue(conflict)
      await repository.enqueue(error)
      await repository.markConflict(conflict, 'abstract token mismatch')
      await repository.markError(error, 'RPC failed')

      expect(await repository.retry(conflict)).toEqual(1)
      expect(await repository.retry(error)).toEqual(1)

      const entries = await repository.getAll()
      expect(
        entries.map(({ chain, address, state, message }) => ({
          chain,
          address,
          state,
          message,
        })),
      ).toEqualUnsorted([
        { ...conflict, state: 'pending', message: null },
        { ...error, state: 'pending', message: null },
      ])
    })

    it('does not touch already pending entries', async () => {
      const address = { chain: 'ethereum', address: '0x111' }
      await repository.enqueue(address)

      expect(await repository.retry(address)).toEqual(0)
    })
  })

  describe(TokenIngestionQueueRepository.prototype.approve.name, () => {
    it('moves staged entries to pending', async () => {
      const address = { chain: 'ethereum', address: '0x111' }
      await repository.enqueue(address, 'staged')

      expect(await repository.approve(address)).toEqual(1)

      const entries = await repository.getAll()
      expect(entries).toHaveLength(1)
      expect(entries[0]!).toHaveSubset({
        ...address,
        state: 'pending',
        message: null,
      })
    })

    it('does not touch non-staged entries', async () => {
      const address = { chain: 'ethereum', address: '0x111' }
      await repository.enqueue(address)

      expect(await repository.approve(address)).toEqual(0)
    })
  })

  describe(TokenIngestionQueueRepository.prototype.remove.name, () => {
    it('deletes an entry', async () => {
      const address = { chain: 'ethereum', address: '0x111' }
      await repository.enqueue(address)

      expect(await repository.remove(address)).toEqual(1)
      expect(await repository.getAll()).toEqual([])
    })
  })
})
