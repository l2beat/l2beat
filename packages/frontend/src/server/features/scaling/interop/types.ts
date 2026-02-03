import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import { InteropBridgeType } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type InteropDashboardParams = v.infer<typeof InteropDashboardParams>
export const InteropDashboardParams = v.object({
  from: v.array(v.string()),
  to: v.array(v.string()),
})

export type InteropSubpageParams = v.infer<typeof InteropSubpageParams>
export const InteropSubpageParams = v.object({
  type: InteropBridgeType,
  from: v.array(v.string()),
  to: v.array(v.string()),
})

export type AggregatedInteropTransferWithTokens =
  AggregatedInteropTransferRecord & {
    tokens: Omit<
      AggregatedInteropTokenRecord,
      'id' | 'timestamp' | 'srcChain' | 'dstChain' | 'bridgeType'
    >[]
  }

export type AverageDurationData = {
  transferCount: number
  totalDurationSum: number
  inTransferCount: number
  inDurationSum: number
  outTransferCount: number
  outDurationSum: number
}
