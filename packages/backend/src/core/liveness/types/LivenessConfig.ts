import {
  EthereumAddress,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

export interface LivenessFunctionCall {
  projectId: ProjectId
  address: EthereumAddress
  selector: string
  type: LivenessType
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface LivenessTransfer {
  projectId: ProjectId
  from: EthereumAddress
  to: EthereumAddress
  type: LivenessType
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface LivenessConfig {
  transfers: LivenessTransfer[]
  functionCalls: LivenessFunctionCall[]
}
