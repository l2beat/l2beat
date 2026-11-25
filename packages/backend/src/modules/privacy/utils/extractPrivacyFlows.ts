import type { IRpcClient } from '@l2beat/shared'
import type { Log, UnixTime } from '@l2beat/shared-pure'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { PrivacyFlowIndexerConfig } from '../types'
import { extractPrivacyFlow } from './extractPrivacyFlow'
import { adjustPrivacyPoolsV2Flow } from './extractPrivacyPoolsV2Event'
import {
  extractPrivacyLogMatches,
  type PrivacyLogMatch,
} from './privacyLogIndexerUtils'
import type { ReceiptLogCache } from './ReceiptLogCache'

export interface ExtractedPrivacyFlow {
  configuration: Configuration<PrivacyFlowIndexerConfig>
  log: Log
  timestamp: UnixTime
  count: number
  amount: bigint
}

/**
 * The flows in the matched logs. Whole hours and the newest blocks both go
 * through here, so that a flow is the same whichever stored it
 */
export function extractPrivacyFlows(
  matches: PrivacyLogMatch<PrivacyFlowIndexerConfig>[],
  rpc: IRpcClient,
  receipts?: ReceiptLogCache,
): Promise<ExtractedPrivacyFlow[]> {
  return extractPrivacyLogMatches(
    matches,
    rpc,
    async ({ log, timestamp, configuration }, context) => {
      const extracted = extractPrivacyFlow(configuration.properties, log)
      if (!extracted || (extracted.count === 0 && extracted.amount === 0n)) {
        return undefined
      }
      const result = await adjustPrivacyPoolsV2Flow(log, extracted, context)
      if (!result) {
        return undefined
      }
      return { configuration, log, timestamp, ...result }
    },
    receipts,
  )
}
