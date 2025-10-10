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

export type AddAbstractTokenCommand = v.infer<typeof AddAbstractTokenCommand>
export const AddAbstractTokenCommand = v.object({
  type: v.literal('AddAbstractTokenCommand'),
  record: AbstractTokenRecord,
})

export type UpdateAbstractTokenCommand = v.infer<
  typeof UpdateAbstractTokenCommand
>
export const UpdateAbstractTokenCommand = v.object({
  type: v.literal('UpdateAbstractTokenCommand'),
  id: v.string(),
  existing: AbstractTokenRecord,
  update: AbstractTokenUpdateable,
})

export type DeleteAbstractTokenCommand = v.infer<
  typeof DeleteAbstractTokenCommand
>
export const DeleteAbstractTokenCommand = v.object({
  type: v.literal('DeleteAbstractTokenCommand'),
  id: v.string(),
})

export type DeleteAllAbstractTokensCommand = v.infer<
  typeof DeleteAllAbstractTokensCommand
>
export const DeleteAllAbstractTokensCommand = v.object({
  type: v.literal('DeleteAllAbstractTokensCommand'),
})

export type AddDeployedTokenCommand = v.infer<typeof AddDeployedTokenCommand>
export const AddDeployedTokenCommand = v.object({
  type: v.literal('AddDeployedTokenCommand'),
  record: DeployedTokenRecord,
})

export type UpdateDeployedTokenCommand = v.infer<
  typeof UpdateDeployedTokenCommand
>
export const UpdateDeployedTokenCommand = v.object({
  type: v.literal('UpdateDeployedTokenCommand'),
  pk: DeployedTokenPrimaryKey,
  existing: DeployedTokenRecord,
  update: DeployedTokenUpdateable,
})

export type DeleteDeployedTokenCommand = v.infer<
  typeof DeleteDeployedTokenCommand
>
export const DeleteDeployedTokenCommand = v.object({
  type: v.literal('DeleteDeployedTokenCommand'),
  pk: DeployedTokenPrimaryKey,
})

export type DeleteAllDeployedTokensCommand = v.infer<
  typeof DeleteAllDeployedTokensCommand
>
export const DeleteAllDeployedTokensCommand = v.object({
  type: v.literal('DeleteAllDeployedTokensCommand'),
})

export type Command = v.infer<typeof Command>
export const Command = v.union([
  AddAbstractTokenCommand,
  UpdateAbstractTokenCommand,
  DeleteAbstractTokenCommand,
  DeleteAllAbstractTokensCommand,
  AddDeployedTokenCommand,
  UpdateDeployedTokenCommand,
  DeleteDeployedTokenCommand,
  DeleteAllDeployedTokensCommand,
])
