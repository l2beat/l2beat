import type { TendermintClient } from '../../../peripherals/tendermint/TendermintClient'
import { AbstractStakeAnalyzer } from './AbstractStakeAnalyzer'

export class CelestiaStakeAnalyzer extends AbstractStakeAnalyzer {
  constructor(private readonly client: TendermintClient) {
    super()
  }

  override async analyze() {
    const perPage = 100
    let pageCount = 1
    let totalStake = 0n
    for (let page = 1; page <= pageCount; page++) {
      const res = await this.client.getValidators({ page: 1, perPage })
      pageCount = Math.ceil(res.total / perPage)
      totalStake += res.validators.reduce((acc, v) => {
        // We store the stake in the smallest denomination
        // but API returns it in the full TIA
        const units = BigInt(v.votingPower) * 10n ** 6n
        return acc + BigInt(units)
      }, 0n)
    }
    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
    }
  }
}
