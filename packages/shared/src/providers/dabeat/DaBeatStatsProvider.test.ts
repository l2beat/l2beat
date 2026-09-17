import { describe, expect, it, vi } from 'vitest'
import type {
  BeaconChainClient,
  CelestiaRpcClient,
  EspressoClient,
  NearClient,
  PolkadotRpcClient,
} from '../../clients'
import { DaBeatStatsProvider } from './DaBeatStatsProvider'

describe(DaBeatStatsProvider.name, () => {
  describe(DaBeatStatsProvider.prototype.getStats.name, () => {
    it('routes to getEthereumStats for ethereum project', async () => {
      const mockBeaconChainClient = {
        getValidatorsInfo: vi.fn(async () => ({
          totalStake: 1000n,
          numberOfValidators: 1,
        })),
      } as unknown as BeaconChainClient

      const provider = new DaBeatStatsProvider(
        mockBeaconChainClient,
        undefined,
        undefined,
        undefined,
        undefined,
      )

      const result = await provider.getStats('ethereum')

      expect(result).toStrictEqual({
        totalStake: 1000n,
        thresholdStake: 666n, // (1000n * 200n) / 300n = 666n
        numberOfValidators: 1,
      })
    })

    it('routes to getNearStats for near-da project', async () => {
      const mockNearClient = {
        getValidatorsInfo: vi.fn(async () => ({
          result: {
            current_validators: [{ stake: '500' }, { stake: '300' }],
          },
        })),
      } as unknown as NearClient

      const provider = new DaBeatStatsProvider(
        undefined,
        mockNearClient,
        undefined,
        undefined,
        undefined,
      )

      const result = await provider.getStats('near-da')

      expect(result).toStrictEqual({
        totalStake: 800n,
        thresholdStake: 533n, // (800n * 200n) / 300n = 533n
        numberOfValidators: 2,
      })
    })

    it('routes to getCelestiaStats for celestia project', async () => {
      const mockCelestiaClient = {
        getValidatorsInfo: vi.fn(async () => ({
          total: 2,
          count: 2,
          validators: [{ voting_power: 100 }, { voting_power: 200 }],
        })),
      } as unknown as CelestiaRpcClient

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        mockCelestiaClient,
        undefined,
        undefined,
      )

      const result = await provider.getStats('celestia')

      expect(result).toStrictEqual({
        totalStake: 300000000n, // (100 + 200) * 10^6
        thresholdStake: 200000000n, // (300000000n * 200n) / 300n
        numberOfValidators: 2,
      })
    })

    it('routes to getAvailStats for avail project', async () => {
      const mockPolkadotRpcClient = {
        getStakingEraOverview: vi.fn(async () => ({
          validator1: { own: 400n, total: 400n },
          validator2: { own: 600n, total: 600n },
        })),
      } as unknown as PolkadotRpcClient

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        mockPolkadotRpcClient,
        undefined,
      )

      const result = await provider.getStats('avail')

      expect(result).toStrictEqual({
        totalStake: 1000n,
        thresholdStake: 666n, // (1000n * 200n) / 300n = 666n
        numberOfValidators: 2,
      })
    })

    it('routes to getEspressoStats for espresso project', async () => {
      const mockEspressoClient = {
        getStakeTable: vi.fn(async () => ({
          stake_table: [
            { stake_table_entry: { stake_amount: '1000' } },
            { stake_table_entry: { stake_amount: '2000' } },
          ],
        })),
      } as unknown as EspressoClient

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
        mockEspressoClient,
      )

      const result = await provider.getStats('espresso')

      expect(result).toStrictEqual({
        totalStake: 3000n,
        thresholdStake: 2000n, // (3000n * 200n) / 300n = 2000n
        numberOfValidators: 2,
      })
    })

    it('throws error for unknown project ID', async () => {
      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      )

      await expect(provider.getStats('unknown')).rejects.toThrow(
        'Stats provider not implemented for: unknown',
      )
    })
  })

  describe(DaBeatStatsProvider.prototype.getEthereumStats.name, () => {
    it('returns correct stats from BeaconChain client', async () => {
      const mockBeaconChainClient = {
        getValidatorsInfo: vi.fn(async () => ({
          totalStake: 32000000000000000000000n,
          numberOfValidators: 2,
        })),
      } as unknown as BeaconChainClient

      const provider = new DaBeatStatsProvider(
        mockBeaconChainClient,
        undefined,
        undefined,
        undefined,
        undefined,
      )

      const result = await provider.getEthereumStats()

      expect(result).toStrictEqual({
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
        undefined,
      )

      await expect(provider.getEthereumStats()).rejects.toThrow(
        'Beacon chain client not found',
      )
    })
  })

  describe(DaBeatStatsProvider.prototype.getNearStats.name, () => {
    it('returns correct stats from Near client', async () => {
      const mockNearClient = {
        getValidatorsInfo: vi.fn(async () => ({
          result: {
            current_validators: [
              { stake: '1000000000000000000000000' },
              { stake: '500000000000000000000000' },
              { stake: '750000000000000000000000' },
            ],
          },
        })),
      } as unknown as NearClient

      const provider = new DaBeatStatsProvider(
        undefined,
        mockNearClient,
        undefined,
        undefined,
        undefined,
      )

      const result = await provider.getNearStats()

      expect(result).toStrictEqual({
        totalStake: 2250000000000000000000000n,
        thresholdStake: 1500000000000000000000000n,
        numberOfValidators: 3,
      })
    })

    it('handles empty validators list', async () => {
      const mockNearClient = {
        getValidatorsInfo: vi.fn(async () => ({
          result: {
            current_validators: [],
          },
        })),
      } as unknown as NearClient

      const provider = new DaBeatStatsProvider(
        undefined,
        mockNearClient,
        undefined,
        undefined,
        undefined,
      )

      const result = await provider.getNearStats()

      expect(result).toStrictEqual({
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
        undefined,
      )

      await expect(provider.getNearStats()).rejects.toThrow(
        'Near client not found',
      )
    })
  })

  describe(DaBeatStatsProvider.prototype.getCelestiaStats.name, () => {
    it('returns correct stats from single page', async () => {
      const mockCelestiaClient = {
        getValidatorsInfo: vi.fn(async () => ({
          total: 2,
          count: 2,
          validators: [{ voting_power: 1000 }, { voting_power: 2000 }],
        })),
      } as unknown as CelestiaRpcClient

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        mockCelestiaClient,
        undefined,
        undefined,
      )

      const result = await provider.getCelestiaStats()

      expect(result).toStrictEqual({
        totalStake: 3000000000n, // (1000 + 2000) * 10^6
        thresholdStake: 2000000000n,
        numberOfValidators: 2,
      })
    })

    it('handles multiple pages correctly', async () => {
      let callCount = 0
      const mockCelestiaClient = {
        getValidatorsInfo: vi.fn(async ({ page, perPage }: any) => {
          callCount++
          expect(perPage).toStrictEqual(100)

          if (page === 1) {
            return {
              total: 150, // This will require 2 pages
              count: 100,
              validators: Array.from({ length: 100 }, () => ({
                voting_power: 100,
              })),
            }
          }
          if (page === 2) {
            return {
              total: 150,
              count: 50,
              validators: Array.from({ length: 50 }, () => ({
                voting_power: 200,
              })),
            }
          }
          throw new Error(`Unexpected page: ${page}`)
        }),
      } as unknown as CelestiaRpcClient

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        mockCelestiaClient,
        undefined,
        undefined,
      )

      const result = await provider.getCelestiaStats()

      expect(callCount).toStrictEqual(2)
      expect(result).toStrictEqual({
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
        undefined,
      )

      await expect(provider.getCelestiaStats()).rejects.toThrow(
        'Celestia client not found',
      )
    })
  })

  describe(DaBeatStatsProvider.prototype.getAvailStats.name, () => {
    it('returns correct stats', async () => {
      const mockPolkadotRpcClient = {
        getStakingEraOverview: vi.fn(async () => ({
          validator1: {
            own: 1000000000000000000n,
            total: 1000000000000000000n,
          },
          validator2: {
            own: 2000000000000000000n,
            total: 2000000000000000000n,
          },
          validator3: { own: 500000000000000000n, total: 500000000000000000n },
        })),
      } as unknown as PolkadotRpcClient

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        mockPolkadotRpcClient,
        undefined,
      )

      const result = await provider.getAvailStats()

      expect(result).toStrictEqual({
        totalStake: 3500000000000000000n,
        thresholdStake: 2333333333333333333n,
        numberOfValidators: 3,
      })
    })

    it('propagates client errors', async () => {
      const mockPolkadotRpcClient = {
        getStakingEraOverview: vi.fn(async () => {
          throw new Error('Connection failed')
        }),
      } as unknown as PolkadotRpcClient

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        mockPolkadotRpcClient,
        undefined,
      )

      await expect(provider.getAvailStats()).rejects.toThrow(
        'Connection failed',
      )
    })

    it('throws error when Avail client is not provided', async () => {
      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      )

      await expect(provider.getAvailStats()).rejects.toThrow(
        'Avail client not found',
      )
    })
  })

  describe(DaBeatStatsProvider.prototype.getEspressoStats.name, () => {
    it('returns correct stats from Espresso client', async () => {
      const mockEspressoClient = {
        getStakeTable: vi.fn(async () => ({
          stake_table: [
            { stake_table_entry: { stake_amount: '1000' } },
            { stake_table_entry: { stake_amount: '2000' } },
            { stake_table_entry: { stake_amount: '100' } },
            { stake_table_entry: { stake_amount: '3050' } },
          ],
        })),
      } as unknown as EspressoClient

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
        mockEspressoClient,
      )

      const result = await provider.getEspressoStats()

      expect(result).toStrictEqual({
        totalStake: 6150n,
        thresholdStake: (6150n * 2n) / 3n,
        numberOfValidators: 4,
      })
    })

    it('handles empty validators list', async () => {
      const mockEspressoClient = {
        getStakeTable: vi.fn(async () => ({
          stake_table: [],
        })),
      } as unknown as EspressoClient

      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
        mockEspressoClient,
      )

      const result = await provider.getEspressoStats()

      expect(result).toStrictEqual({
        totalStake: 0n,
        thresholdStake: 0n,
        numberOfValidators: 0,
      })
    })

    it('throws error when Espresso client is not provided', async () => {
      const provider = new DaBeatStatsProvider(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      )

      await expect(provider.getEspressoStats()).rejects.toThrow(
        'Espresso client not found',
      )
    })
  })
})
