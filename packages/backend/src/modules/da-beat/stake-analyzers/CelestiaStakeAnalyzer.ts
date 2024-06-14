import { TendermintClient } from '../../../peripherals/tendermint/TendermintClient'
import { AbstractStakeAnalyzer } from './AbstractStakeAnalyzer'

export class CelestiaStakeAnalyzer extends AbstractStakeAnalyzer {
  constructor(private readonly client: TendermintClient) {
    super()
  }

  async analyze() {
    const perPage = 100
    let pageCount = 1
    let totalStake = 0n
    for (let page = 1; page <= pageCount; page++) {
      const res = await this.client.getValidators({ page: 1, perPage })
      pageCount = Math.ceil(res.total / perPage)
      totalStake += res.validators.reduce(
        (acc, v) => acc + BigInt(v.votingPower),
        0n,
      )
    }
    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
    }
  }
}
