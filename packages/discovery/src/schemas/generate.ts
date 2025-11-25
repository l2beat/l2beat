import { formatJson } from '@l2beat/shared-pure'
import { toJsonSchema } from '@l2beat/validate'
import { ContractConfigSchema, DiscoveryConfigSchema } from './schemas.js'

export interface Schema {
  filepath: string
  schema: string
}

export function generateAllSchemas(): Schema[] {
  return [
    {
      filepath: 'schemas/config.v2.schema.json',
      schema: formatJson(toJsonSchema(DiscoveryConfigSchema)),
    },
    {
      filepath: 'schemas/contract.v2.schema.json',
      schema: formatJson(toJsonSchema(ContractConfigSchema)),
    },
  ]
}
