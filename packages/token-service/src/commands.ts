import type {
  AbstractTokenRecord,
  AbstractTokenUpdate,
  DeployedTokenRecord,
  DeployedTokenUpdate,
} from '@l2beat/database'

export type Command =
  | AddAbstractTokenCommand
  | UpdateAbstractTokenCommand
  | DeleteAllAbstractTokensCommand
  | AddDeployedTokenCommand
  | UpdateDeployedTokenCommand

export interface AddAbstractTokenCommand {
  type: 'AddAbstractTokenCommand'
  record: AbstractTokenRecord
}

export interface UpdateAbstractTokenCommand {
  type: 'UpdateAbstractTokenCommand'
  before: AbstractTokenRecord
  update: AbstractTokenUpdate
}

export interface DeleteAllAbstractTokensCommand {
  type: 'DeleteAllAbstractTokensCommand'
}

export interface AddDeployedTokenCommand {
  type: 'AddDeployedTokenCommand'
  record: DeployedTokenRecord
}

export interface UpdateDeployedTokenCommand {
  type: 'UpdateDeployedTokenCommand'
  before: DeployedTokenRecord
  update: DeployedTokenUpdate
}
