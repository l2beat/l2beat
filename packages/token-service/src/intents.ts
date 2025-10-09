import { v } from '@l2beat/validate'
import {
  AbstractTokenRecordSchema,
  AbstractTokenUpdateableSchema,
} from './schemas/AbstractToken'
import {
  DeployedTokenPrimaryKeySchema,
  DeployedTokenRecordSchema,
  DeployedTokenUpdateableSchema,
} from './schemas/DeployedToken'

export type AddAbstractTokenIntentSchema = v.infer<
  typeof AddAbstractTokenIntentSchema
>
export const AddAbstractTokenIntentSchema = v.object({
  type: v.literal('AddAbstractTokenIntent'),
  record: AbstractTokenRecordSchema,
})

export type UpdateAbstractTokenIntentSchema = v.infer<
  typeof UpdateAbstractTokenIntentSchema
>
export const UpdateAbstractTokenIntentSchema = v.object({
  type: v.literal('UpdateAbstractTokenIntent'),
  id: v.string(),
  update: AbstractTokenUpdateableSchema,
})

export type DeleteAllAbstractTokensIntentSchema = v.infer<
  typeof DeleteAllAbstractTokensIntentSchema
>
export const DeleteAllAbstractTokensIntentSchema = v.object({
  type: v.literal('DeleteAllAbstractTokensIntent'),
})

export type AddDeployedTokenIntentSchema = v.infer<
  typeof AddDeployedTokenIntentSchema
>
export const AddDeployedTokenIntentSchema = v.object({
  type: v.literal('AddDeployedTokenIntent'),
  record: DeployedTokenRecordSchema,
})

export type UpdateDeployedTokenIntentSchema = v.infer<
  typeof UpdateDeployedTokenIntentSchema
>
export const UpdateDeployedTokenIntentSchema = v.object({
  type: v.literal('UpdateDeployedTokenIntent'),
  pk: DeployedTokenPrimaryKeySchema,
  update: DeployedTokenUpdateableSchema,
})

export type DeleteAllDeployedTokensIntentSchema = v.infer<
  typeof DeleteAllDeployedTokensIntentSchema
>
export const DeleteAllDeployedTokensIntentSchema = v.object({
  type: v.literal('DeleteAllDeployedTokensIntent'),
})

export type IntentSchema = v.infer<typeof IntentSchema>
export const IntentSchema = v.union([
  AddAbstractTokenIntentSchema,
  UpdateAbstractTokenIntentSchema,
  DeleteAllAbstractTokensIntentSchema,
  AddDeployedTokenIntentSchema,
  UpdateDeployedTokenIntentSchema,
  DeleteAllDeployedTokensIntentSchema,
])
