import { writeFileSync } from 'fs'
import { zodToJsonSchema } from 'zod-to-json-schema'
import {
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
  RawDiscoveryConfig,
} from '../src/discovery/config/RawDiscoveryConfig'
import { z } from 'zod'
import { UserHandlerDefinition } from '../src/discovery/handlers/user'
import { toPrettyJson } from '../src/discovery/output/toPrettyJson'

const definitions = {
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
} as const

async function saveConfigSchema() {
  const RawDiscoveryConfigWithSchema = z
    .object({
      $schema: z.string().optional(),
    })
    .merge(RawDiscoveryConfig)

  const schema = zodToJsonSchema(RawDiscoveryConfigWithSchema, { definitions })
  writeFileSync('schemas/config.v2.schema.json', await toPrettyJson(schema))
}

async function saveTemplateSchema() {
  const DiscoveryContractWithSchema = z
    .object({
      $schema: z.string().optional(),
    })
    .merge(DiscoveryContract)

  const schema = zodToJsonSchema(DiscoveryContractWithSchema, { definitions })
  writeFileSync('schemas/contract.v2.schema.json', await toPrettyJson(schema))
}

async function main() {
  await saveConfigSchema()
  await saveTemplateSchema()
}

main().catch(console.error)
