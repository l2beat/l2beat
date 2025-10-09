import type {
  AbstractTokenRecord,
  AbstractTokenUpdateable,
  DeployedTokenPrimaryKey,
  DeployedTokenRecord,
  DeployedTokenUpdateable,
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
  record: AbstractTokenRecord
}

export interface UpdateAbstractTokenIntent {
  type: 'UpdateAbstractTokenIntent'
  id: AbstractTokenRecord['id']
  update: AbstractTokenUpdateable
}

export interface DeleteAllAbstractTokensIntent {
  type: 'DeleteAllAbstractTokensIntent'
}

export interface AddDeployedTokenIntent {
  type: 'AddDeployedTokenIntent'
  record: DeployedTokenRecord
}

export interface UpdateDeployedTokenIntent {
  type: 'UpdateDeployedTokenIntent'
  pk: DeployedTokenPrimaryKey
  update: DeployedTokenUpdateable
}

export interface DeleteAllDeployedTokensIntent {
  type: 'DeleteAllDeployedTokensIntent'
}
