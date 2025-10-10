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

export type Intent = v.infer<typeof Intent>
export const Intent = v.union([
  AddAbstractTokenIntent,
  UpdateAbstractTokenIntent,
  DeleteAbstractTokenIntent,
  AddDeployedTokenIntent,
  UpdateDeployedTokenIntent,
  DeleteDeployedTokenIntent,
])
