import { getTokenBySymbol, Project, TokenInfo, tokenList } from '@l2beat/config'
import { ProjectEvent } from '@l2beat/config/build/src/projects/types/ProjectEvent'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

export interface ProjectInfo {
  name: string
  projectId: ProjectId
  escrows: EscrowInfo[]
  events: ProjectEvent[]
}

export interface EscrowInfo {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  tokens: TokenInfo[]
}

export function projectToInfo(project: Project): ProjectInfo {
  return {
    name: project.name,
    projectId: project.id,
    escrows: project.escrows.map((escrow) => ({
      address: EthereumAddress(escrow.address),
      sinceTimestamp: escrow.sinceTimestamp,
      tokens:
        escrow.tokens === '*' ? tokenList : escrow.tokens.map(getTokenBySymbol),
    })),
    events: project.events,
  }
}
