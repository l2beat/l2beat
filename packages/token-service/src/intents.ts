import type {
  AbstractTokenInsertable,
  AbstractTokenUpdate,
  DeployedTokenInsertable,
  DeployedTokenUpdate,
} from '@l2beat/database'

export type Intent =
  | AddAbstractTokenIntent
  | UpdateAbstractTokenIntent
  | DeleteAllAbstractTokensIntent
  | AddDeployedTokenIntent
  | UpdateDeployedTokenIntent
  | DeleteAllDeployedTokensIntent

export interface AddAbstractTokenIntent {
  type: 'AddAbstractTokenIntent'
  record: AbstractTokenInsertable
}

export interface UpdateAbstractTokenIntent {
  type: 'UpdateAbstractTokenIntent'
  update: AbstractTokenUpdate
}

export interface DeleteAllAbstractTokensIntent {
  type: 'DeleteAllAbstractTokensIntent'
}

export interface AddDeployedTokenIntent {
  type: 'AddDeployedTokenIntent'
  record: DeployedTokenInsertable
}

export interface UpdateDeployedTokenIntent {
  type: 'UpdateDeployedTokenIntent'
  update: DeployedTokenUpdate
}

export interface DeleteAllDeployedTokensIntent {
  type: 'DeleteAllDeployedTokensIntent'
}
