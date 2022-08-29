import {
  getTokenBySymbol,
  Project,
  ProjectUptime,
  TokenInfo,
  tokenList,
} from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

export interface ProjectInfo {
  name: string
  projectId: ProjectId
  bridges: BridgeInfo[]
  urls?: ProjectUptime[]
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
    urls: project.urls,
  }
}
