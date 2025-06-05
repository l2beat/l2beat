import { writeFileSync } from 'fs'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import {
  ColorConfig,
  ColorContract,
  ColorContractField,
  ContractValueType,
  DiscoveryCategory,
  ExternalReference,
} from '../src/discovery/config/ColorConfig'
import {
  ContractPermission,
  ContractPermissionField,
  Permission,
  PermissionsConfig,
  RawPermissionConfiguration,
} from '../src/discovery/config/PermissionConfig'
import {
  ContractFieldSeverity,
  DiscoveryCustomType,
  ManualProxyType,
  StructureConfig,
  StructureContract,
  StructureContractField,
} from '../src/discovery/config/StructureConfig'
import { UserHandlerDefinition } from '../src/discovery/handlers/user'
import { toPrettyJson } from '../src/discovery/output/toPrettyJson'

async function generateAndSaveSchema(
  // biome-ignore lint/suspicious/noExplicitAny: it's fine
  baseSchema: z.ZodObject<any>,
  filename: string,
) {
  const schemaWithMeta = z
    .object({ $schema: z.string().optional() })
    .merge(baseSchema)
  const schema = zodToJsonSchema(schemaWithMeta, {
    definitions: {
      UserHandlerDefinition,
      Permission,
      RawPermissionConfiguration,
      ContractValueType,
      ContractFieldSeverity,
      DiscoveryContractField: StructureContractField,
      ColorContractField,
      DiscoveryCustomType,
      ExternalReference,
      DiscoveryCategory,
      ManualProxyType,
      DiscoveryContract: StructureContract,
      ColorContract,
      MergedContract: z.union([StructureContract, ColorContract]),
    } as const,
  })
  writeFileSync(filename, await toPrettyJson(schema))
}

async function main() {
  const MergedField = ContractPermissionField.merge(ColorContractField).merge(
    // special handling due to the .refine() call in StructureContractField
    StructureContractField._def.schema,
  )
  const MergedContract = z.object({
    ...StructureContract.omit({ fields: true }).shape,
    ...ColorContract.omit({ fields: true }).shape,
    ...ContractPermission.omit({ fields: true }).shape,
    fields: z.record(MergedField).optional(),
  })
  const ChainConfig = z.object({
    ...StructureConfig.omit({ overrides: true, name: true, chain: true }).shape,
    ...ColorConfig.omit({ overrides: true }).shape,
    ...PermissionsConfig.omit({ overrides: true }).shape,
    overrides: z.record(MergedContract).optional(),
    types: z.optional(z.record(z.string(), DiscoveryCustomType)),
  })

  // Create the main config schema with chains structure
  const MergedConfig = z.object({
    // Global properties
    name: z.string().min(1),
    import: z.optional(z.array(z.string())),
    sharedModules: z.array(z.string()).default([]),
    // Chain-specific configurations
    chains: z.record(z.string(), ChainConfig),
  })

  await generateAndSaveSchema(MergedConfig, 'schemas/config.v2.schema.json')
  await generateAndSaveSchema(MergedContract, 'schemas/contract.v2.schema.json')
}

main().catch(console.error)
