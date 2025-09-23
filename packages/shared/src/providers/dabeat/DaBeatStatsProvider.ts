import { assert } from '@l2beat/shared-pure'
import type { BeaconChainClient, NearClient } from '../../clients'

export interface DaBeatStats {
  totalStake: bigint
  thresholdStake: bigint
  numberOfValidators: number | null
}

export class DaBeatStatsProvider {
  constructor(
    private readonly beaconChainClient: BeaconChainClient | undefined,
    private readonly nearClient: NearClient | undefined,
  ) {}

  async getStats(projectId: string): Promise<DaBeatStats | undefined> {
    switch (projectId) {
      case 'ethereum':
        return await this.getEthereumStats()
      case 'near-da':
        return await this.getNearStats()
      default:
        throw new Error(`Stats provider not implemented for: ${projectId}`)
    }
  }

  async getEthereumStats(): Promise<DaBeatStats | undefined> {
    assert(this.beaconChainClient, 'Beacon chain client not found')

    const stats = await this.beaconChainClient.getValidatorsStake({
      stateId: 'head',
      status: ['active'],
    })

    return {
      ...stats,
      numberOfValidators: null,
    }
  }

  async getNearStats(): Promise<DaBeatStats | undefined> {
    assert(this.nearClient, 'Near client not found')

    const { totalStake } = await this.nearClient.getValidatorsInfo()

    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
      numberOfValidators: null,
    }
  }
}
