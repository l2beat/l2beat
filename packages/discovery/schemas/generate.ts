import { writeFileSync } from 'fs'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import {
  CommonDiscoveryConfig,
  ContractFieldSeverity,
  ContractValueType,
  DiscoveryCategory,
  StructureContract,
  StructureContractField,
  DiscoveryCustomType,
  ExternalReference,
  ManualProxyType,
  Permission,
  StructureConfig,
  RawPermissionConfiguration,
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
      DiscoveryCustomType,
      ExternalReference,
      DiscoveryCategory,
      ManualProxyType,
      DiscoveryContract: StructureContract,
      CommonDiscoveryConfig,
    } as const,
  })
  writeFileSync(filename, await toPrettyJson(schema))
}

async function main() {
  await generateAndSaveSchema(StructureConfig, 'schemas/config.v2.schema.json')
  await generateAndSaveSchema(
    StructureContract,
    'schemas/contract.v2.schema.json',
  )
}

main().catch(console.error)
