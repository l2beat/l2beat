import { formatJson } from '@l2beat/shared-pure'
import { toJsonSchema, v } from '@l2beat/validate'
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

export interface Schema {
  filepath: string
  schema: string
}

export function generateAllSchemas(): Schema[] {
  const MergedField = v.object({
    ..._ContractPermissionField,
    ..._ColorContractField,
    ..._StructureContractField,
  })

  const MergedContract = v.object({
    ..._StructureContract,
    ..._ColorContract,
    ..._ContractPermission,
    fields: v.record(v.string(), MergedField).optional(),
  })

  const ChainConfig = v.object({
    ..._StructureConfig,
    ..._ColorConfig,
    ..._PermissionsConfig,
    overrides: v.record(v.string(), MergedContract).optional(),
    types: v.record(v.string(), DiscoveryCustomType).optional(),
  })

  // Create the main config schema with chains structure
  const MergedConfig = v.object({
    // Global properties
    name: v.string().check((x) => x.length > 0),
    import: v.array(v.string()).optional(),
    archived: v.boolean().optional(),
    modelCrossChainPermissions: v.boolean().optional(),
    // Chain-specific configurations
    chains: v.record(v.string(), ChainConfig),
  })

  return [
    {
      filepath: 'schemas/config.v2.schema.json',
      schema: formatJson(toJsonSchema(MergedConfig)),
    },
    {
      filepath: 'schemas/contract.v2.schema.json',
      schema: formatJson(toJsonSchema(MergedContract)),
    },
  ]
}
