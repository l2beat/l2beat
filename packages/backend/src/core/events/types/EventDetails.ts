import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

export interface EventDetails {
  emitter: EthereumAddress
  topic: string
  name: string
  projectId: ProjectId
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}
