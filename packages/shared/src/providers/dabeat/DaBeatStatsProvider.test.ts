import { expect, mockObject } from 'earl'
import type {
  AvailWsClient,
  BeaconChainClient,
  CelestiaRpcClient,
  NearClient,
} from '../../clients'
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

      const provider = new DaBeatStatsProvider(
        mockBeaconChainClient,
        undefined,
        undefined,
        undefined,
      )

      const result = await provider.getStats('ethereum')

      expect(result).toEqual({
        totalStake: 1000n,
        thresholdStake: 666n, // (1000n * 200n) / 300n = 666n
        numberOfValidators: 1,
      })
    })

    it('routes to getNearStats for near-da project', async () => {
      const mockNearClient = mockObject<NearClient>({
        getValidatorsInfo: async () => ({
          result: {
            current_validators: [{ stake: '500' }, { stake: '300' }],
          },
        }),
      })

      const provider = new DaBeatStatsProvider(
        undefined,
        mockNearClient,
        undefined,
        undefined,
      )

      const result = await provider.getStats('near-da')

      expect(result).toEqual({
        totalStake: 800n,
        thresholdStake: 533n, // (800n * 200n) / 300n = 533n
        numberOfValidators: 2,
      })
    })

    it('routes to getCelestiaStats for celestia project', async () => {
      const mockCelestiaClient = mockObject<CelestiaRpcClient>({
        getValidatorsInfo: async () => ({
          total: 2,
          count: 2,
          validators: [{ voting_power: 100 }, { voting_power: 200 }],
        }),
      })

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        mockCelestiaClient,
        undefined,
      )

      const result = await provider.getStats('celestia')

      expect(result).toEqual({
        totalStake: 300000000n, // (100 + 200) * 10^6
        thresholdStake: 200000000n, // (300000000n * 200n) / 300n
        numberOfValidators: 2,
      })
    })

    it('routes to getAvailStats for avail project', async () => {
      const mockAvailWsClient = mockObject<AvailWsClient>({
        connect: async () => {},
        disconnect: async () => {},
        getCurrentEra: async () => '1',
        getStakingEraOverview: async () => ({
          validator1: { own: 400n, total: 400n },
          validator2: { own: 600n, total: 600n },
        }),
      })

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        mockAvailWsClient,
      )

      const result = await provider.getStats('avail')

      expect(result).toEqual({
        totalStake: 1000n,
        thresholdStake: 666n, // (1000n * 200n) / 300n = 666n
        numberOfValidators: 2,
      })
    })

    it('throws error for unknown project ID', async () => {
      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
      )

      await expect(provider.getStats('unknown')).toBeRejectedWith(
        'Stats provider not implemented for: unknown',
      )
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

      const provider = new DaBeatStatsProvider(
        mockBeaconChainClient,
        undefined,
        undefined,
        undefined,
      )

      const result = await provider.getEthereumStats()

      expect(result).toEqual({
        totalStake: 32000000000000000000000n,
        thresholdStake: 21333333333333333333333n,
        numberOfValidators: 2,
      })
    })

    it('throws error when BeaconChain client is not provided', async () => {
      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
      )

      await expect(provider.getEthereumStats()).toBeRejectedWith(
        'Beacon chain client not found',
      )
    })
  })

  describe(DaBeatStatsProvider.prototype.getNearStats.name, () => {
    it('returns correct stats from Near client', async () => {
      const mockNearClient = mockObject<NearClient>({
        getValidatorsInfo: async () => ({
          result: {
            current_validators: [
              { stake: '1000000000000000000000000' },
              { stake: '500000000000000000000000' },
              { stake: '750000000000000000000000' },
            ],
          },
        }),
      })

      const provider = new DaBeatStatsProvider(
        undefined,
        mockNearClient,
        undefined,
        undefined,
      )

      const result = await provider.getNearStats()

      expect(result).toEqual({
        totalStake: 2250000000000000000000000n,
        thresholdStake: 1500000000000000000000000n,
        numberOfValidators: 3,
      })
    })

    it('handles empty validators list', async () => {
      const mockNearClient = mockObject<NearClient>({
        getValidatorsInfo: async () => ({
          result: {
            current_validators: [],
          },
        }),
      })

      const provider = new DaBeatStatsProvider(
        undefined,
        mockNearClient,
        undefined,
        undefined,
      )

      const result = await provider.getNearStats()

      expect(result).toEqual({
        totalStake: 0n,
        thresholdStake: 0n,
        numberOfValidators: 0,
      })
    })

    it('throws error when Near client is not provided', async () => {
      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
      )

      await expect(provider.getNearStats()).toBeRejectedWith(
        'Near client not found',
      )
    })
  })

  describe(DaBeatStatsProvider.prototype.getCelestiaStats.name, () => {
    it('returns correct stats from single page', async () => {
      const mockCelestiaClient = mockObject<CelestiaRpcClient>({
        getValidatorsInfo: async ({ page, perPage }: any) => ({
          total: 2,
          count: 2,
          validators: [{ voting_power: 1000 }, { voting_power: 2000 }],
        }),
      })

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        mockCelestiaClient,
        undefined,
      )

      const result = await provider.getCelestiaStats()

      expect(result).toEqual({
        totalStake: 3000000000n, // (1000 + 2000) * 10^6
        thresholdStake: 2000000000n,
        numberOfValidators: 2,
      })
    })

    it('handles multiple pages correctly', async () => {
      let callCount = 0
      const mockCelestiaClient = mockObject<CelestiaRpcClient>({
        getValidatorsInfo: async ({ page, perPage }: any) => {
          callCount++
          expect(perPage).toEqual(100)

          if (page === 1) {
            return {
              total: 150, // This will require 2 pages
              count: 100,
              validators: Array.from({ length: 100 }, (_, i) => ({
                voting_power: 100,
              })),
            }
          }
          if (page === 2) {
            return {
              total: 150,
              count: 50,
              validators: Array.from({ length: 50 }, (_, i) => ({
                voting_power: 200,
              })),
            }
          }
          throw new Error(`Unexpected page: ${page}`)
        },
      })

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        mockCelestiaClient,
        undefined,
      )

      const result = await provider.getCelestiaStats()

      expect(callCount).toEqual(2)
      expect(result).toEqual({
        totalStake: 20000000000n, // (100 * 100 + 50 * 200) * 10^6
        thresholdStake: 13333333333n,
        numberOfValidators: 150,
      })
    })

    it('throws error when Celestia client is not provided', async () => {
      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
      )

      await expect(provider.getCelestiaStats()).toBeRejectedWith(
        'Celestia client not found',
      )
    })
  })

  describe(DaBeatStatsProvider.prototype.getAvailStats.name, () => {
    it('returns correct stats and handles connection lifecycle', async () => {
      let connected = false
      let disconnected = false

      const mockAvailWsClient = mockObject<AvailWsClient>({
        connect: async () => {
          connected = true
        },
        disconnect: async () => {
          disconnected = true
        },
        getCurrentEra: async () => '42',
        getStakingEraOverview: async (era: string) => ({
          validator1: {
            own: 1000000000000000000n,
            total: 1000000000000000000n,
          },
          validator2: {
            own: 2000000000000000000n,
            total: 2000000000000000000n,
          },
          validator3: { own: 500000000000000000n, total: 500000000000000000n },
        }),
      })

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        mockAvailWsClient,
      )

      const result = await provider.getAvailStats()

      expect(connected).toEqual(true)
      expect(disconnected).toEqual(true)
      expect(result).toEqual({
        totalStake: 3500000000000000000n,
        thresholdStake: 2333333333333333333n,
        numberOfValidators: 3,
      })
    })

    it('ensures disconnect is called even when error occurs', async () => {
      let disconnected = false

      const mockAvailWsClient = mockObject<AvailWsClient>({
        connect: async () => {},
        disconnect: async () => {
          disconnected = true
        },
        getCurrentEra: async () => {
          throw new Error('Connection failed')
        },
        getStakingEraOverview: async () => ({}),
      })

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        mockAvailWsClient,
      )

      await expect(provider.getAvailStats()).toBeRejectedWith(
        'Connection failed',
      )
      expect(disconnected).toEqual(true)
    })

    it('throws error when Avail WS client is not provided', async () => {
      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
      )

      await expect(provider.getAvailStats()).toBeRejectedWith(
        'Avail WS client not found',
      )
    })
  })
})
