import { assert } from '@l2beat/shared-pure'
import type {
  PrivacyFlowExtractResult,
  StarknetPrivacyEvent,
  StarknetPrivacyFlowIndexerConfig,
} from '../types'

export function extractStarknetPrivacyFlow(
  source: StarknetPrivacyFlowIndexerConfig,
  event: StarknetPrivacyEvent,
): PrivacyFlowExtractResult | undefined {
  if (
    event.keys[2]?.toLowerCase() !== source.params.tokenAddress.toLowerCase()
  ) {
    return undefined
  }

  switch (source.extractor) {
    case 'strk20Deposit':
      assert(event.data.length === 1, 'Invalid STRK-20 deposit event')
      return { count: 1, amount: BigInt(event.data[0]) }
    case 'strk20Withdrawal':
      assert(event.data.length === 4, 'Invalid STRK-20 withdrawal event')
      return { count: 1, amount: BigInt(event.data[3]) }
  }
}
