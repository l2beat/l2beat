import type {
  AbstractTokenRecord,
  AbstractTokenUpdate,
  DeployedTokenRecord,
  DeployedTokenUpdate,
} from '@l2beat/database'

export type Intent =
  | AddAbstractTokenIntent
  | UpdateAbstractTokenIntent
  | DeleteAllAbstractTokensIntent
  | AddDeployedTokenIntent
  | UpdateDeployedTokenIntent

export interface AddAbstractTokenIntent {
  type: 'AddAbstractTokenIntent'
  record: AbstractTokenRecord
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
  record: DeployedTokenRecord
}

export interface UpdateDeployedTokenIntent {
  type: 'UpdateDeployedTokenIntent'
  update: DeployedTokenUpdate
}
