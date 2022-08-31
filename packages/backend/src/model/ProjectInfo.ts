import {
  getTokenBySymbol,
  Project,
  TokenInfo,
  tokenList,
  UptimeAction,
} from '@l2beat/config'
import { ProjectEvent } from '@l2beat/config/build/src/projects/types/ProjectEvent'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

export interface ProjectInfo {
  name: string
  projectId: ProjectId
  bridges: BridgeInfo[]
  events: ProjectEvent[]
  uptimeActions?: UptimeAction[]
}

export interface BridgeInfo {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  tokens: TokenInfo[]
}

export function projectToInfo(project: Project): ProjectInfo {
  return {
    name: project.name,
    projectId: project.id,
    bridges: project.bridges.map((bridge) => ({
      address: EthereumAddress(bridge.address),
      sinceTimestamp: bridge.sinceTimestamp,
      tokens:
        bridge.tokens === '*' ? tokenList : bridge.tokens.map(getTokenBySymbol),
    })),
    events: project.events,
    uptimeActions: project.uptimeActions,
  }
}
