import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
} from '@l2beat/token-backend'

export type AbstractToken = AbstractTokenRecord

export type AbstractTokenWithDeployedTokens = AbstractToken & {
  deployedTokens: DeployedToken[]
}

export type DeployedToken = DeployedTokenRecord

export type TokenConnection = {
  tokenFromId: string
  tokenToId: string
  type: string
  params?: Record<string, unknown>
  comment?: string
}
