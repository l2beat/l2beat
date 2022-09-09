import {
  getTokenBySymbol,
  Layer2,
  Layer2Event,
  TokenInfo,
  tokenList,
} from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

export interface ProjectInfo {
  projectId: ProjectId
  type: 'layer2' | 'bridge'
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
    projectId: layer2.id,
    type: 'layer2',
    escrows: layer2.escrows.map((escrow) => ({
      address: EthereumAddress(escrow.address),
      sinceTimestamp: escrow.sinceTimestamp,
      tokens:
        escrow.tokens === '*' ? tokenList : escrow.tokens.map(getTokenBySymbol),
    })),
    events: layer2.events,
  }
}
