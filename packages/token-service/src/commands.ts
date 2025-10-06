import type {
  AbstractTokenInsertable,
  AbstractTokenUpdate,
  DeployedTokenInsertable,
  DeployedTokenUpdate,
} from '@l2beat/database'

export type Command =
  | AddAbstractTokenCommand
  | UpdateAbstractTokenCommand
  | DeleteAllAbstractTokensCommand
  | AddDeployedTokenCommand
  | UpdateDeployedTokenCommand
  | DeleteAllDeployedTokensCommand

export interface AddAbstractTokenCommand {
  type: 'AddAbstractTokenCommand'
  record: AbstractTokenInsertable
}

export interface UpdateAbstractTokenCommand {
  type: 'UpdateAbstractTokenCommand'
  before: AbstractTokenInsertable
  update: AbstractTokenUpdate
}

export interface DeleteAllAbstractTokensCommand {
  type: 'DeleteAllAbstractTokensCommand'
}

export interface AddDeployedTokenCommand {
  type: 'AddDeployedTokenCommand'
  record: DeployedTokenInsertable
}

export interface UpdateDeployedTokenCommand {
  type: 'UpdateDeployedTokenCommand'
  before: DeployedTokenInsertable
  update: DeployedTokenUpdate
}

export interface DeleteAllDeployedTokensCommand {
  type: 'DeleteAllDeployedTokensCommand'
}
