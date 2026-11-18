import { expect, mockObject } from 'earl'
import type { BeaconChainClient } from '../../clients'
import { DaBeatStatsProvider } from './DaBeatStatsProvider'

describe(DaBeatStatsProvider.name, () => {
  describe(DaBeatStatsProvider.prototype.getStats.name, () => {
    it('routes to getEthereumStats for ethereum project', async () => {
      const mockBeaconChainClient = mockObject<BeaconChainClient>({
        getValidatorsInfo: async () => ({
          totalStake: 1000n,
          numberOfValidators: 1,
        }),
      })

      const provider = new DaBeatStatsProvider(mockBeaconChainClient)

      const result = await provider.getStats('ethereum')

      expect(result).toEqual({
        totalStake: 1000n,
        thresholdStake: 666n, // (1000n * 200n) / 300n = 666n
        numberOfValidators: 1,
      })
    })

    it('throws error for a layer other than ethereum', async () => {
      const provider = new DaBeatStatsProvider(undefined)

      const error = await provider.getStats('celestia').catch((e: unknown) => e)

      expect((error as Error).message).toEqual('Stats provider not implemented')
      expect((error as Error).cause).toEqual({ projectId: 'celestia' })
    })

    it('throws error for unknown project ID', async () => {
      const provider = new DaBeatStatsProvider(undefined)

      const error = await provider.getStats('unknown').catch((e: unknown) => e)

      expect((error as Error).message).toEqual('Stats provider not implemented')
      expect((error as Error).cause).toEqual({ projectId: 'unknown' })
    })
  })

  describe(DaBeatStatsProvider.prototype.getEthereumStats.name, () => {
    it('returns correct stats from BeaconChain client', async () => {
      const mockBeaconChainClient = mockObject<BeaconChainClient>({
        getValidatorsInfo: async () => ({
          totalStake: 32000000000000000000000n,
          numberOfValidators: 2,
        }),
      })

      const provider = new DaBeatStatsProvider(mockBeaconChainClient)

      const result = await provider.getEthereumStats()

      expect(result).toEqual({
        totalStake: 32000000000000000000000n,
        thresholdStake: 21333333333333333333333n,
        numberOfValidators: 2,
      })
    })

    it('throws error when BeaconChain client is not provided', async () => {
      const provider = new DaBeatStatsProvider(undefined)

      await expect(provider.getEthereumStats()).toBeRejectedWith(
        'Beacon chain client not found',
      )
    })
  })
})
