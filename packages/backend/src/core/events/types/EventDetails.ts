import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/common'

export interface EventDetails {
  emitter: EthereumAddress
  topic: string
  name: string
  projectId: ProjectId
  sinceTimestamp: UnixTime
  dbStatus: { earliest: UnixTime; latest: UnixTime } | undefined
}
