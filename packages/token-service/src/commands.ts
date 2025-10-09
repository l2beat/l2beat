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

export type AddAbstractTokenCommandSchema = v.infer<
  typeof AddAbstractTokenCommandSchema
>
export const AddAbstractTokenCommandSchema = v.object({
  type: v.literal('AddAbstractTokenCommand'),
  record: AbstractTokenRecordSchema,
})

export type UpdateAbstractTokenCommandSchema = v.infer<
  typeof UpdateAbstractTokenCommandSchema
>
export const UpdateAbstractTokenCommandSchema = v.object({
  type: v.literal('UpdateAbstractTokenCommand'),
  id: v.string(),
  existing: AbstractTokenRecordSchema,
  update: AbstractTokenUpdateableSchema,
})

export type DeleteAllAbstractTokensCommandSchema = v.infer<
  typeof DeleteAllAbstractTokensCommandSchema
>
export const DeleteAllAbstractTokensCommandSchema = v.object({
  type: v.literal('DeleteAllAbstractTokensCommand'),
})

export type AddDeployedTokenCommandSchema = v.infer<
  typeof AddDeployedTokenCommandSchema
>
export const AddDeployedTokenCommandSchema = v.object({
  type: v.literal('AddDeployedTokenCommand'),
  record: DeployedTokenRecordSchema,
})

export type UpdateDeployedTokenCommandSchema = v.infer<
  typeof UpdateDeployedTokenCommandSchema
>
export const UpdateDeployedTokenCommandSchema = v.object({
  type: v.literal('UpdateDeployedTokenCommand'),
  pk: DeployedTokenPrimaryKeySchema,
  existing: DeployedTokenRecordSchema,
  update: DeployedTokenUpdateableSchema,
})

export type DeleteAllDeployedTokensCommandSchema = v.infer<
  typeof DeleteAllDeployedTokensCommandSchema
>
export const DeleteAllDeployedTokensCommandSchema = v.object({
  type: v.literal('DeleteAllDeployedTokensCommand'),
})

export type CommandSchema = v.infer<typeof CommandSchema>
export const CommandSchema = v.union([
  AddAbstractTokenCommandSchema,
  UpdateAbstractTokenCommandSchema,
  DeleteAllAbstractTokensCommandSchema,
  AddDeployedTokenCommandSchema,
  UpdateDeployedTokenCommandSchema,
  DeleteAllDeployedTokensCommandSchema,
])
