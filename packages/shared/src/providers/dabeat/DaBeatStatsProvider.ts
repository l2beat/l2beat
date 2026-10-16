import { assert } from '@l2beat/shared-pure'
import type { BeaconChainClient } from '../../clients'

export interface DaBeatStats {
  totalStake: bigint
  thresholdStake: bigint
  numberOfValidators: number | null
}

export class DaBeatStatsProvider {
  constructor(
    private readonly beaconChainClient: BeaconChainClient | undefined,
  ) {}

  // every change should be reflected in getProjects.test.ts (daLayer)
  async getStats(projectId: string): Promise<DaBeatStats> {
    switch (projectId) {
      case 'ethereum':
        return await this.getEthereumStats()
      default:
        throw new Error(`Stats provider not implemented for: ${projectId}`)
    }
  }

  async getEthereumStats(): Promise<DaBeatStats> {
    assert(this.beaconChainClient, 'Beacon chain client not found')

    const { totalStake, numberOfValidators } =
      await this.beaconChainClient.getValidatorsInfo({
        stateId: 'head',
        status: ['active'],
      })

    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
      numberOfValidators,
    }
  }
}
