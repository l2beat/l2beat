import { AbstractStakeAnalyzer } from '../AbstractStakeAnalyzer'
import type { AvailClient } from './AvailClient'

export class AvailStakeAnalyzer extends AbstractStakeAnalyzer {
  constructor(private readonly client: AvailClient) {
    super()
  }

  override async analyze() {
    await this.client.connect()

    try {
      const currentEra = await this.client.getCurrentEra()

      const validatorsOverview =
        await this.client.getStakingEraOverview(currentEra)

      const total = Object.values(validatorsOverview).reduce(
        (acc, { total }) => acc + total,
        0n,
      )

      return {
        totalStake: total,
        thresholdStake: (total * 200n) / 300n,
      }
    } finally {
      await this.client.disconnect()
    }
  }
}
