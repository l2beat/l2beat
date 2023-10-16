import { FunctionCallQueryParams, TransferQueryParams } from '@l2beat/shared'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'

export interface LivenessFunctionCall extends FunctionCallQueryParams {
  projectId: ProjectId
  type: LivenessType
  untilTimestamp?: UnixTime
}

export interface LivenessTransfer extends TransferQueryParams {
  projectId: ProjectId
  type: LivenessType
  untilTimestamp?: UnixTime
}

export interface LivenessConfig {
  transfers: LivenessTransfer[]
  functionCalls: LivenessFunctionCall[]
}
