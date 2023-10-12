import { FunctionCallQueryParams, TransferQueryParams } from '@l2beat/shared'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'

export interface LivenessFunctionCall extends FunctionCallQueryParams {
  type: LivenessType
  untilTimestamp?: UnixTime
}

export interface LivenessTransfer extends TransferQueryParams {
  type: LivenessType
  untilTimestamp?: UnixTime
}

export interface LivenessConfig {
  projectId: ProjectId
  transfers?: LivenessTransfer[]
  functionCalls?: LivenessFunctionCall[]
}
