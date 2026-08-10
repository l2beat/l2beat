import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
} from '@l2beat/token-backend'

export type AbstractToken = AbstractTokenRecord

export type AbstractTokenWithDeployedTokens = AbstractToken & {
  deployedTokens: DeployedToken[]
}

export type DeployedToken = DeployedTokenRecord
