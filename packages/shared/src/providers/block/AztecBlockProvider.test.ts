import { expect, mockFn, mockObject } from 'earl'
import type { AztecBlockClient } from '../../clients'
import { AztecBlockProvider } from './AztecBlockProvider'

describe(AztecBlockProvider.name, () => {
  describe(AztecBlockProvider.prototype.getBlocks.name, () => {
    it('returns a complete consecutive block range', async () => {
      const client = mockObject<AztecBlockClient>({
        chain: 'aztecnetwork',
        getBlocks: mockFn().resolvesToOnce([
          { number: 10, timestamp: 1, txEffectsCount: 0 },
          { number: 11, timestamp: 2, txEffectsCount: 1 },
        ]),
      })
      const provider = new AztecBlockProvider('aztecnetwork', [client])

      const result = await provider.getBlocks(10, 2)

      expect(result).toEqual([
        { number: 10, timestamp: 1, txEffectsCount: 0 },
        { number: 11, timestamp: 2, txEffectsCount: 1 },
      ])
    })

    it('rejects incomplete responses', async () => {
      const client = mockObject<AztecBlockClient>({
        chain: 'aztecnetwork',
        getBlocks: mockFn().resolvesToOnce([
          { number: 10, timestamp: 1, txEffectsCount: 0 },
        ]),
      })
      const provider = new AztecBlockProvider('aztecnetwork', [client])

      await expect(provider.getBlocks(10, 2)).toBeRejectedWith(
        'Expected 2 blocks starting from 10, got 1',
      )
    })
  })
})
