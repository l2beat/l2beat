import { assert } from '@l2beat/shared-pure'
import type {
  BeaconChainClient,
  CelestiaRpcClient,
  NearClient,
} from '../../clients'

export interface DaBeatStats {
  totalStake: bigint
  thresholdStake: bigint
  numberOfValidators: number | null
}

export class DaBeatStatsProvider {
  constructor(
    private readonly beaconChainClient: BeaconChainClient | undefined,
    private readonly nearClient: NearClient | undefined,
    private readonly celestiaClient: CelestiaRpcClient | undefined,
  ) {}

  async getStats(projectId: string): Promise<DaBeatStats | undefined> {
    switch (projectId) {
      case 'ethereum':
        return await this.getEthereumStats()
      case 'near-da':
        return await this.getNearStats()
      case 'celestia':
        return await this.getCelestiaStats()
      default:
        throw new Error(`Stats provider not implemented for: ${projectId}`)
    }
  }

  async getEthereumStats(): Promise<DaBeatStats | undefined> {
    assert(this.beaconChainClient, 'Beacon chain client not found')

    const { totalStake } = await this.beaconChainClient.getValidatorsInfo({
      stateId: 'head',
      status: ['active'],
    })

    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
      numberOfValidators: null,
    }
  }

  async getNearStats(): Promise<DaBeatStats | undefined> {
    assert(this.nearClient, 'Near client not found')

    const { result } = await this.nearClient.getValidatorsInfo()
    const totalStake = result.current_validators.reduce(
      (acc, v) => acc + BigInt(v.stake),
      0n,
    )

    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
      numberOfValidators: null,
    }
  }

  async getCelestiaStats(): Promise<DaBeatStats | undefined> {
    assert(this.celestiaClient, 'Celestia client not found')

    const perPage = 100
    let pageCount = 1
    let totalStake = 0n
    for (let page = 1; page <= pageCount; page++) {
      const res = await this.celestiaClient.getValidatorsInfo({ page, perPage })
      pageCount = Math.ceil(res.total / perPage)
      totalStake += res.validators.reduce((acc, v) => {
        // We store the stake in the smallest denomination
        // but API returns it in the full TIA
        const units = BigInt(v.voting_power) * 10n ** 6n
        return acc + BigInt(units)
      }, 0n)
    }

    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
      numberOfValidators: null,
    }
  }
}
