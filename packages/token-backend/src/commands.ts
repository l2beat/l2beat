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
  existing: AbstractTokenRecord,
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
  existing: DeployedTokenRecord,
})

export type AddTokenRelationCommand = v.infer<typeof AddTokenRelationCommand>
export const AddTokenRelationCommand = v.object({
  type: v.literal('AddTokenRelationCommand'),
  record: TokenRelationRecord,
})

export type UpdateTokenRelationCommand = v.infer<
  typeof UpdateTokenRelationCommand
>
export const UpdateTokenRelationCommand = v.object({
  type: v.literal('UpdateTokenRelationCommand'),
  pk: TokenRelationPrimaryKey,
  existing: TokenRelationRecord,
  update: TokenRelationUpdateable,
})

export type DeleteTokenRelationCommand = v.infer<
  typeof DeleteTokenRelationCommand
>
export const DeleteTokenRelationCommand = v.object({
  type: v.literal('DeleteTokenRelationCommand'),
  pk: TokenRelationPrimaryKey,
  existing: TokenRelationRecord,
})

export type Command = v.infer<typeof Command>
export const Command = v.union([
  AddAbstractTokenCommand,
  UpdateAbstractTokenCommand,
  DeleteAbstractTokenCommand,
  AddDeployedTokenCommand,
  UpdateDeployedTokenCommand,
  DeleteDeployedTokenCommand,
  AddTokenRelationCommand,
  UpdateTokenRelationCommand,
  DeleteTokenRelationCommand,
])
