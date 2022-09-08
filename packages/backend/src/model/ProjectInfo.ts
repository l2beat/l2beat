import {
  getTokenBySymbol,
  Layer2,
  Layer2Event,
  TokenInfo,
  tokenList,
} from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

export interface ProjectInfo {
  name: string
  projectId: ProjectId
  escrows: EscrowInfo[]
  events: Layer2Event[]
}

export interface EscrowInfo {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  tokens: TokenInfo[]
}

export function layer2ToProject(layer2: Layer2): ProjectInfo {
  return {
    name: layer2.name,
    projectId: layer2.id,
    escrows: layer2.escrows.map((escrow) => ({
      address: EthereumAddress(escrow.address),
      sinceTimestamp: escrow.sinceTimestamp,
      tokens:
        escrow.tokens === '*' ? tokenList : escrow.tokens.map(getTokenBySymbol),
    })),
    events: layer2.events,
  }
}
