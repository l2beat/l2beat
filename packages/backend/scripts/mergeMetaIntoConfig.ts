/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { DiscoveryMeta, isEmptyValueMeta } from '@l2beat/discovery'
import { RawDiscoveryConfig } from '@l2beat/discovery'
import { parse, stringify } from 'comment-json'

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
      // @ts-expect-error we're adding new handler field
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

function mergeMetaIntoConfig(path: string) {
  const metaFilePath = join(path, 'meta.json')
  if (!existsSync(metaFilePath)) {
    return
  }
  const configFilePath = join(path, 'config.jsonc')
  const configJsonc = parse(
    readFileSync(configFilePath, 'utf8'),
  ) as unknown as RawDiscoveryConfig
  if (configJsonc === null) {
    return
  }

  moveFieldParamsIntoHandlerObject(configJsonc)

  const metaJson = JSON.parse(readFileSync(metaFilePath, 'utf8'))
  const meta: DiscoveryMeta = JSON.parse(metaJson) as DiscoveryMeta
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

  writeFileSync(configFilePath, stringify(configJsonc, null, 2))
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

function main() {
  console.log('Mergeing meta.json files into config.jsonc files...')
  const discoveryFolder = './discovery'
  const configPaths = listAllPaths(discoveryFolder).filter((path) =>
    existsSync(join(path, 'config.jsonc')),
  )
  configPaths.forEach(mergeMetaIntoConfig)
}

main()
