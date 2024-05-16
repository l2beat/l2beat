/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { ConfigReader } from '@l2beat/discovery'
import { RawDiscoveryConfig } from '@l2beat/discovery'
import { parse, stringify } from 'comment-json'
import { isEmpty } from 'lodash'
import { rimraf } from 'rimraf'
import { z } from 'zod'
import { updateDiffHistoryHash } from '../src/modules/update-monitor/utils/hashing'

function moveFieldParamsIntoHandlerObject(configJsonc: RawDiscoveryConfig) {
  if (configJsonc.overrides === undefined) {
    return
  }
  for (const contractOverrides of Object.values(configJsonc.overrides)) {
    if (contractOverrides.fields === undefined) {
      continue
    }

    for (const [field, fieldValues] of Object.entries(
      contractOverrides.fields,
    )) {
      if (fieldValues.handler !== undefined) {
        // We have already moved the fields into the handler object
        continue
      }
      contractOverrides.fields[field] = {
        // @ts-expect-error we're adding new handler field
        handler: fieldValues,
      }
    }
  }
}

function mergeMetaIntoConfig(path: string, configJsonc: RawDiscoveryConfig) {
  const metaFilePath = join(path, 'meta.json')
  if (!existsSync(metaFilePath)) {
    return
  }

  const metaJson = JSON.parse(readFileSync(metaFilePath, 'utf8'))
  const meta = DiscoveryMeta.parse(metaJson)
  for (const contract of meta.contracts) {
    for (const [key, metaValue] of Object.entries(contract.values ?? {})) {
      if (isEmptyValueMeta(metaValue)) {
        continue
      }
      const metaValuesWithoutNulls = Object.fromEntries(
        Object.entries(metaValue).filter(([_, v]) => v !== null),
      )

      if (!configJsonc.overrides === undefined) {
        configJsonc.overrides = {}
      }
      // biome-ignore lint/style/noNonNullAssertion: checked above
      const overrides = configJsonc.overrides!
      if (overrides[contract.name] === undefined) {
        overrides[contract.name] = {}
      }
      // biome-ignore lint/style/noNonNullAssertion: checked above
      const contractOverrides = overrides[contract.name]!
      if (contractOverrides.fields === undefined) {
        contractOverrides.fields = {}
      }

      if (contract.description !== undefined) {
        overrides[contract.name] = {
          description: contract.description,
          ...overrides[contract.name],
        }
      }

      // biome-ignore lint/style/noNonNullAssertion: checked above
      const fields = contractOverrides.fields!

      if (fields[key] === undefined) {
        // @ts-ignore
        fields[key] = {}
      }
      fields[key] = { ...metaValuesWithoutNulls, ...fields[key] }
    }
  }

  rimraf(metaFilePath)
}

async function updateConfigHashInDiscovery(
  path: string,
  name: string,
  chain: string,
) {
  const configReader = new ConfigReader()
  const discoveryConfig = await configReader.readConfig(name, chain)
  const configHash = discoveryConfig.hash
  const discoveryFilePath = join(path, 'discovered.json')
  const discoveryFileContent = readFileSync(discoveryFilePath, 'utf8')
  const discoveryFileContentWithUpdatedHash = discoveryFileContent.replace(
    /"configHash": ".+?"/,
    `"configHash": "${configHash}"`,
  )
  writeFileSync(discoveryFilePath, discoveryFileContentWithUpdatedHash)
  const diffHistoryPath = join(path, 'diffHistory.md')
  await updateDiffHistoryHash(diffHistoryPath, name, chain)
}

async function transformConfig(path: string) {
  const configFilePath = join(path, 'config.jsonc')
  const configJsonc = parse(
    readFileSync(configFilePath, 'utf8'),
  ) as unknown as RawDiscoveryConfig & { ['$schema']: string }
  if (configJsonc === null) {
    return
  }

  if (configJsonc['$schema'].includes('config.v2.schema.json')) {
    console.log('Skipping', path, 'because it is already version 2')
    return
  }

  moveFieldParamsIntoHandlerObject(configJsonc)
  mergeMetaIntoConfig(path, configJsonc)

  configJsonc['$schema'] = '../../../../discovery/schemas/config.v2.schema.json'
  writeFileSync(configFilePath, stringify(configJsonc, null, 2))

  await updateConfigHashInDiscovery(path, configJsonc.name, configJsonc.chain)
}

function listAllPaths(path: string): string[] {
  let result = [path]
  const subPaths = readdirSync(path, { withFileTypes: true })
    .filter((x) => x.isDirectory())
    .map((x) => join(path, x.name))
  for (const subPath of subPaths) {
    result = result.concat(listAllPaths(subPath))
  }
  return result
}

async function main() {
  console.log('Mergeing meta.json files into config.jsonc files...')
  const discoveryFolder = './discovery'
  const configPaths = listAllPaths(discoveryFolder).filter((path) =>
    existsSync(join(path, 'config.jsonc')),
  )
  for (const configPath of configPaths) {
    await transformConfig(configPath)
  }
}

export const ValueType = z.enum([
  'CODE_CHANGE',
  'L2',
  'EXTERNAL',
  'RISK_PARAMETER',
  'PERMISSION',
])

export type ValueMeta = z.infer<typeof ValueMeta>
export const ValueMeta = z.object({
  description: z.string().nullable().optional(),
  severity: z.enum(['HIGH', 'MEDIUM', 'LOW']).nullable().optional(),
  type: z
    .union([ValueType, z.array(ValueType)])
    .nullable()
    .optional(),
})

export function isEmptyValueMeta(value: ValueMeta): boolean {
  return (
    isEmpty(value) ||
    (value.description === null &&
      value.severity === null &&
      value.type === null)
  )
}

export type ContractMeta = z.infer<typeof ContractMeta>
export const ContractMeta = z.object({
  ['$schema']: z.string().optional(),
  name: z.string(),
  extends: z.string().optional(),
  description: z.string().optional(),
  values: z.record(z.string(), ValueMeta).optional(),
})

export type DiscoveryMeta = z.infer<typeof DiscoveryMeta>
export const DiscoveryMeta = z.object({
  ['$schema']: z.string().optional(),
  contracts: z.array(ContractMeta),
  _templatesWereInlined: z.boolean().optional(),
})

main()
