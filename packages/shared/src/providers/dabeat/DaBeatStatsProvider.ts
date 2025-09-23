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

  async getStats(projectId: string): Promise<DaBeatStats | undefined> {
    if (projectId === 'ethereum') {
      const stats = await this.beaconChainClient?.getValidatorsStake({
        stateId: 'head',
        status: ['active'],
      })
      assert(stats, 'No stats found')

      return {
        ...stats,
        numberOfValidators: null,
      }
    }
  }
}
