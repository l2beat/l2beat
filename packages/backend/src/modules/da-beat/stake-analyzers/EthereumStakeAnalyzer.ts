import type { QuickNodeClient } from '../../../peripherals/quicknode/QuickNodeClient'
import { AbstractStakeAnalyzer } from './AbstractStakeAnalyzer'

export class EthereumStakeAnalyzer extends AbstractStakeAnalyzer {
  constructor(private readonly client: QuickNodeClient) {
    super()
  }

  async analyze() {
    return await this.client.getValidatorsStake({
      stateId: 'head',
      status: ['active'],
    })
  }
}
