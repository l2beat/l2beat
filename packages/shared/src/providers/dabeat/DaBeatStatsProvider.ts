import { assert } from '@l2beat/shared-pure'
import type {
  AvailWsClient,
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
    private readonly availWsClient: AvailWsClient | undefined,
  ) {}

  // every change should be reflected in getProjects.test.ts (daLayer)
  async getStats(projectId: string): Promise<DaBeatStats> {
    switch (projectId) {
      case 'ethereum':
        return await this.getEthereumStats()
      case 'near-da':
        return await this.getNearStats()
      case 'celestia':
        return await this.getCelestiaStats()
      case 'avail':
        return await this.getAvailStats()
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

  async getNearStats(): Promise<DaBeatStats> {
    assert(this.nearClient, 'Near client not found')

    const { result } = await this.nearClient.getValidatorsInfo()
    const totalStake = result.current_validators.reduce(
      (acc, v) => acc + BigInt(v.stake),
      0n,
    )

    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
      numberOfValidators: result.current_validators.length,
    }
  }

  async getCelestiaStats(): Promise<DaBeatStats> {
    assert(this.celestiaClient, 'Celestia client not found')

    const perPage = 100
    let pageCount = 1
    let totalStake = 0n
    let numberOfValidators = 0
    for (let page = 1; page <= pageCount; page++) {
      const res = await this.celestiaClient.getValidatorsInfo({ page, perPage })
      pageCount = Math.ceil(res.total / perPage)
      totalStake += res.validators.reduce((acc, v) => {
        // We store the stake in the smallest denomination
        // but API returns it in the full TIA
        const units = BigInt(v.voting_power) * 10n ** 6n
        return acc + units
      }, 0n)
      numberOfValidators += res.validators.length
    }

    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
      numberOfValidators,
    }
  }

  async getAvailStats(): Promise<DaBeatStats> {
    assert(this.availWsClient, 'Avail WS client not found')
    await this.availWsClient.connect()

    try {
      const currentEra = await this.availWsClient.getCurrentEra()
      const validatorsOverview =
        await this.availWsClient.getStakingEraOverview(currentEra)
      const total = Object.values(validatorsOverview).reduce(
        (acc, { total }) => acc + total,
        0n,
      )

      return {
        totalStake: total,
        thresholdStake: (total * 200n) / 300n,
        numberOfValidators: Object.keys(validatorsOverview).length,
      }
    } finally {
      await this.availWsClient.disconnect()
    }
  }
}
