import { AbstractStakeAnalyzer } from '../AbstractStakeAnalyzer'
import { AvailClient } from './AvailClient'

export class AvailStakeAnalyzer extends AbstractStakeAnalyzer {
  constructor(private readonly client: AvailClient) {
    super()
  }

  override async analyze() {
    await this.client.connect()

    try {
      const activeValidatorSet = await this.client.getActiveValidators()

      const validatorsData =
        await this.client.getValidatorData(activeValidatorSet)

      const total = validatorsData.reduce(
        (acc, v) => acc + v.totalStaked.total,
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
