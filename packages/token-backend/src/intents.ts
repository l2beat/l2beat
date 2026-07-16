import { v } from '@l2beat/validate'
import {
  AbstractTokenRecord,
  AbstractTokenUpdateable,
} from './schemas/AbstractToken'
import {
  DeployedTokenPrimaryKey,
  DeployedTokenRecord,
  DeployedTokenUpdateable,
} from './schemas/DeployedToken'
import {
  TokenRelationPrimaryKey,
  TokenRelationRecord,
  TokenRelationUpdateable,
} from './schemas/TokenRelation'

export type AddAbstractTokenIntent = v.infer<typeof AddAbstractTokenIntent>
export const AddAbstractTokenIntent = v.object({
  type: v.literal('AddAbstractTokenIntent'),
  record: AbstractTokenRecord,
})

export type UpdateAbstractTokenIntent = v.infer<
  typeof UpdateAbstractTokenIntent
>
export const UpdateAbstractTokenIntent = v.object({
  type: v.literal('UpdateAbstractTokenIntent'),
  id: v.string(),
  update: AbstractTokenUpdateable,
})

export type DeleteAbstractTokenIntent = v.infer<
  typeof DeleteAbstractTokenIntent
>
export const DeleteAbstractTokenIntent = v.object({
  type: v.literal('DeleteAbstractTokenIntent'),
  id: v.string(),
})

export type MergeAbstractTokenIntent = v.infer<typeof MergeAbstractTokenIntent>
export const MergeAbstractTokenIntent = v.object({
  type: v.literal('MergeAbstractTokenIntent'),
  sourceId: v.string(),
  targetId: v.string(),
})

export type AddDeployedTokenIntent = v.infer<typeof AddDeployedTokenIntent>
export const AddDeployedTokenIntent = v.object({
  type: v.literal('AddDeployedTokenIntent'),
  record: DeployedTokenRecord,
})

export type UpdateDeployedTokenIntent = v.infer<
  typeof UpdateDeployedTokenIntent
>
export const UpdateDeployedTokenIntent = v.object({
  type: v.literal('UpdateDeployedTokenIntent'),
  pk: DeployedTokenPrimaryKey,
  update: DeployedTokenUpdateable,
})

export type DeleteDeployedTokenIntent = v.infer<
  typeof DeleteDeployedTokenIntent
>
export const DeleteDeployedTokenIntent = v.object({
  type: v.literal('DeleteDeployedTokenIntent'),
  pk: DeployedTokenPrimaryKey,
})

export type AddTokenRelationIntent = v.infer<typeof AddTokenRelationIntent>
export const AddTokenRelationIntent = v.object({
  type: v.literal('AddTokenRelationIntent'),
  record: TokenRelationRecord,
})

export type UpdateTokenRelationIntent = v.infer<
  typeof UpdateTokenRelationIntent
>
export const UpdateTokenRelationIntent = v.object({
  type: v.literal('UpdateTokenRelationIntent'),
  pk: TokenRelationPrimaryKey,
  update: TokenRelationUpdateable,
})

export type DeleteTokenRelationIntent = v.infer<
  typeof DeleteTokenRelationIntent
>
export const DeleteTokenRelationIntent = v.object({
  type: v.literal('DeleteTokenRelationIntent'),
  pk: TokenRelationPrimaryKey,
})

export type Intent = v.infer<typeof Intent>
export const Intent = v.union([
  AddAbstractTokenIntent,
  UpdateAbstractTokenIntent,
  DeleteAbstractTokenIntent,
  MergeAbstractTokenIntent,
  AddDeployedTokenIntent,
  UpdateDeployedTokenIntent,
  DeleteDeployedTokenIntent,
  AddTokenRelationIntent,
  UpdateTokenRelationIntent,
  DeleteTokenRelationIntent,
])
