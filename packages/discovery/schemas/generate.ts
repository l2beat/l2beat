import { writeFileSync } from 'fs'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import {
  CommonDiscoveryConfig,
  ContractFieldSeverity,
  ContractValueType,
  DiscoveryCategory,
  DiscoveryContract,
  DiscoveryContractField,
  DiscoveryCustomType,
  ExternalReference,
  ManualProxyType,
  Permission,
  RawDiscoveryConfig,
  RawPermissionConfiguration,
} from '../src/discovery/config/RawDiscoveryConfig'
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
      DiscoveryContractField,
      DiscoveryCustomType,
      ExternalReference,
      DiscoveryCategory,
      ManualProxyType,
      DiscoveryContract,
      CommonDiscoveryConfig,
    } as const,
  })
  writeFileSync(filename, await toPrettyJson(schema))
}

async function main() {
  await generateAndSaveSchema(
    RawDiscoveryConfig,
    'schemas/config.v2.schema.json',
  )
  await generateAndSaveSchema(
    DiscoveryContract,
    'schemas/contract.v2.schema.json',
  )
}

main().catch(console.error)
