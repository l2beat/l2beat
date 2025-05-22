import { writeFileSync } from 'fs'
import { z } from 'zod/v4'
import {
  ColorConfig,
  ColorContract,
  ColorContractField,
} from '../src/discovery/config/ColorConfig'
import {
  ContractPermission,
  ContractPermissionField,
  PermissionsConfig,
} from '../src/discovery/config/PermissionConfig'
import {
  StructureConfig,
  StructureContract,
  StructureContractField,
} from '../src/discovery/config/StructureConfig'
import { toPrettyJson } from '../src/discovery/output/toPrettyJson'

async function generateAndSaveSchema(
  // biome-ignore lint/suspicious/noExplicitAny: it's fine
  baseSchema: z.ZodObject<any>,
  filename: string,
) {
  const schemaWithMeta = z
    .object({ $schema: z.string().optional() })
    .merge(baseSchema)
  const schema = z.toJSONSchema(schemaWithMeta, {
    unrepresentable: 'any',
  })
  writeFileSync(filename, await toPrettyJson(schema))
}

async function main() {
  const MergedField = ContractPermissionField.merge(ColorContractField).merge(
    // special handling due to the .refine() call in StructureContractField
    StructureContractField,
  )

  const MergedContract = StructureContract.omit({ fields: true })
    .merge(ColorContract.omit({ fields: true }))
    .merge(ContractPermission.omit({ fields: true }))
    .merge(z.object({ fields: z.record(z.string(), MergedField).optional() }))

  const MergedConfig = StructureConfig.omit({ overrides: true })
    .merge(ColorConfig.omit({ overrides: true }))
    .merge(PermissionsConfig.omit({ overrides: true }))
    .merge(
      z.object({ overrides: z.record(z.string(), MergedContract).optional() }),
    )

  await generateAndSaveSchema(MergedConfig, 'schemas/config.v2.schema.json')
  await generateAndSaveSchema(MergedContract, 'schemas/contract.v2.schema.json')
}

main().catch(console.error)
