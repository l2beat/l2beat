import type {
  AbstractTokenRecord,
  AbstractTokenUpdateable,
  DeployedTokenPrimaryKey,
  DeployedTokenRecord,
  DeployedTokenUpdateable,
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
  record: AbstractTokenRecord
}

export interface UpdateAbstractTokenCommand {
  type: 'UpdateAbstractTokenCommand'
  id: AbstractTokenRecord['id']
  existing: AbstractTokenRecord
  update: AbstractTokenUpdateable
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
  pk: DeployedTokenPrimaryKey
  existing: DeployedTokenRecord
  update: DeployedTokenUpdateable
}

export interface DeleteAllDeployedTokensCommand {
  type: 'DeleteAllDeployedTokensCommand'
}
