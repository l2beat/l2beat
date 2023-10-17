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
  untilTimestamp?: UnixTime
}

export interface LivenessTransfer {
  projectId: ProjectId
  type: LivenessType
  from: EthereumAddress
  to: EthereumAddress
  untilTimestamp?: UnixTime
}

export interface LivenessConfig {
  transfers: LivenessTransfer[]
  functionCalls: LivenessFunctionCall[]
}
