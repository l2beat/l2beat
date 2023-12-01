import {
  EthereumAddress,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

interface LivenessConfig {
  // DB
  livenessConfigurationId: number
  latestSyncedTimestamp?: UnixTime

  // Typescript config
  projectId: ProjectId
  type: LivenessType
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface LivenessFunctionCall extends LivenessConfig {
  address: EthereumAddress
  selector: string
  programHash?: string
}

export interface LivenessTransfer extends LivenessConfig {
  from: EthereumAddress
  to: EthereumAddress
}
