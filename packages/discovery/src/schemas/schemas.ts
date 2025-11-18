import { v } from '@l2beat/validate'
import {
  _ColorConfig,
  _ColorContract,
  _ColorContractField,
} from '../discovery/config/ColorConfig'
import {
  _ContractPermission,
  _ContractPermissionField,
  _PermissionsConfig,
} from '../discovery/config/PermissionConfig'
import {
  _StructureConfig,
  _StructureContract,
  _StructureContractField,
  DiscoveryCustomType,
} from '../discovery/config/StructureConfig'

export const FieldConfigSchema = v.object({
  ..._ContractPermissionField,
  ..._ColorContractField,
  ..._StructureContractField,
})
export type FieldConfigSchema = v.infer<typeof FieldConfigSchema>

export const ContractConfigSchema = v.object({
  ..._StructureContract,
  ..._ColorContract,
  ..._ContractPermission,
  fields: v.record(v.string(), FieldConfigSchema).optional(),
})
export type ContractConfigSchema = v.infer<typeof ContractConfigSchema>

export const DiscoveryConfigSchema = v.object({
  name: v.string().check((x) => x.length > 0),
  import: v.array(v.string()).optional(),
  archived: v.boolean().optional(),
  modelCrossChainPermissions: v.boolean().optional(),
  ..._StructureConfig,
  ..._ColorConfig,
  ..._PermissionsConfig,
  overrides: v.record(v.string(), ContractConfigSchema).optional(),
  types: v.record(v.string(), DiscoveryCustomType).optional(),
})
export type DiscoveryConfigSchema = v.infer<typeof DiscoveryConfigSchema>
