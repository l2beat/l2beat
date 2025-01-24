import type { HttpClient } from '@l2beat/shared'
import { z } from 'zod'
import { AbstractStakeAnalyzer } from './AbstractStakeAnalyzer'

export class NearStakeAnalyzer extends AbstractStakeAnalyzer {
  constructor(
    private readonly url: string,
    private readonly client: HttpClient,
  ) {
    super()
  }

  override async analyze() {
    const body = {
      jsonrpc: '2.0',
      id: 'dontcare',
      method: 'validators',
      params: [null],
    }

    const response = await this.client.fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const validators = ValidatorsList.parse(response)

    const totalStake = validators.result.current_validators.reduce(
      (acc, v) => acc + BigInt(v.stake),
      0n,
    )

    return {
      totalStake,
      thresholdStake: (totalStake * 200n) / 300n,
    }
  }
}

const ValidatorsList = z.object({
  result: z.object({
    current_validators: z.array(
      z.object({
        stake: z.string(),
      }),
    ),
  }),
})
