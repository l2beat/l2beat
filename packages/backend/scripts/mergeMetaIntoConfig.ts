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
}

function transformConfig(path: string) {
  const configFilePath = join(path, 'config.jsonc')
  const configJsonc = parse(
    readFileSync(configFilePath, 'utf8'),
  ) as unknown as RawDiscoveryConfig
  if (configJsonc === null) {
    return
  }
  if (
    configJsonc.configVersion !== undefined &&
    configJsonc.configVersion >= 2
  ) {
    console.log('Skipping', path, 'because it is already version 2')
    return
  }

  moveFieldParamsIntoHandlerObject(configJsonc)
  mergeMetaIntoConfig(path, configJsonc)

  configJsonc.configVersion = 2
  // I want .configVersion to come right after $schema, chain and name,
  // that's why I'm adding configVersion in such a weird way:
  const configJsoncWithVersion2 = {
    // @ts-ignore
    $schema: configJsonc['$schema'],
    // @ts-ignore
    chain: configJsonc.chain,
    // @ts-ignore
    name: configJsonc.name,
    // @ts-ignore
    configVersion: 2,
    ...configJsonc,
  }
  writeFileSync(configFilePath, stringify(configJsoncWithVersion2, null, 2))
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
  configPaths.forEach(transformConfig)
}

main()
