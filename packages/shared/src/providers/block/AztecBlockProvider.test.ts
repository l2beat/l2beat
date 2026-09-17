import { describe, expect, it, vi } from 'vitest'
import type { AztecBlockClient } from '../../clients'
import { AztecBlockProvider } from './AztecBlockProvider'

describe(AztecBlockProvider.name, () => {
  describe(AztecBlockProvider.prototype.getBlocks.name, () => {
    it('returns a complete consecutive block range', async () => {
      const client = {
        chain: 'aztecnetwork',
        getBlocks: vi.fn().mockResolvedValueOnce([
          { number: 10, timestamp: 1, txEffectsCount: 0 },
          { number: 11, timestamp: 2, txEffectsCount: 1 },
        ]),
      } as unknown as AztecBlockClient
      const provider = new AztecBlockProvider('aztecnetwork', [client])

      const result = await provider.getBlocks(10, 2)

      expect(result).toEqual([
        { number: 10, timestamp: 1, txEffectsCount: 0 },
        { number: 11, timestamp: 2, txEffectsCount: 1 },
      ])
    })

    it('rejects incomplete responses', async () => {
      const client = {
        chain: 'aztecnetwork',
        getBlocks: vi
          .fn()
          .mockResolvedValueOnce([
            { number: 10, timestamp: 1, txEffectsCount: 0 },
          ]),
      } as unknown as AztecBlockClient
      const provider = new AztecBlockProvider('aztecnetwork', [client])

      await expect(provider.getBlocks(10, 2)).rejects.toThrow(
        'Expected 2 blocks starting from 10, got 1',
      )
    })

    it('chunks requests above the Aztec RPC cap', async () => {
      const client = {
        chain: 'aztecnetwork',
        getBlocks: vi
          .fn()
          .mockResolvedValueOnce(blocks(10, 50))
          .mockResolvedValueOnce(blocks(60, 1)),
      } as unknown as AztecBlockClient
      const provider = new AztecBlockProvider('aztecnetwork', [client])

      const result = await provider.getBlocks(10, 51)

      expect(result).toEqual([...blocks(10, 50), ...blocks(60, 1)])
      expect(client.getBlocks).toHaveBeenCalledWith(10, 50)
      expect(client.getBlocks).toHaveBeenCalledWith(60, 1)
    })
  })

  describe(AztecBlockProvider.prototype.getBlockNumberAtOrBefore.name, () => {
    it('uses header-only requests and resets an out-of-range start', async () => {
      const client = {
        chain: 'aztecnetwork',
        getLatestBlockNumber: vi.fn().mockResolvedValueOnce(500),
        getBlockHeaders: vi.fn(async (number: number) => [
          { number, timestamp: number * 100 },
        ]),
      } as unknown as AztecBlockClient
      const provider = new AztecBlockProvider('aztecnetwork', [client])

      const result = await provider.getBlockNumberAtOrBefore(30_000, 800)

      expect(result).toBe(300)
      expect(client.getLatestBlockNumber).toHaveBeenCalledTimes(1)
      expect(client.getBlockHeaders).toHaveBeenCalled()
    })

    it('falls back when a header request fails', async () => {
      const failingClient = {
        chain: 'aztecnetwork',
        getLatestBlockNumber: vi.fn().mockResolvedValueOnce(500),
        getBlockHeaders: vi.fn().mockRejectedValue(new Error('error')),
      } as unknown as AztecBlockClient
      const workingClient = {
        chain: 'aztecnetwork',
        getLatestBlockNumber: vi.fn().mockResolvedValueOnce(500),
        getBlockHeaders: vi.fn(async (number: number) => [
          { number, timestamp: number * 100 },
        ]),
      } as unknown as AztecBlockClient
      const provider = new AztecBlockProvider('aztecnetwork', [
        failingClient,
        workingClient,
      ])

      const result = await provider.getBlockNumberAtOrBefore(30_000)

      expect(result).toBe(300)
      expect(failingClient.getLatestBlockNumber).toHaveBeenCalledTimes(1)
      expect(workingClient.getLatestBlockNumber).toHaveBeenCalledTimes(1)
    })
  })
})

function blocks(start: number, limit: number) {
  return Array.from({ length: limit }, (_, index) => ({
    number: start + index,
    timestamp: start + index,
    txEffectsCount: 0,
  }))
}
