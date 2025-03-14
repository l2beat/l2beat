import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import path, { basename } from 'path'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import {
  contractValuesForInterpolation,
  interpolateModelTemplate,
} from './interpolate'
import { buildRelationsModels } from './relations'

export function buildAndSaveModels(
  discoveryOutput: DiscoveryOutput,
  templatesFolder: string,
  outputFolder: string,
) {
  const addressToNameMap = buildAddressToNameMap(
    discoveryOutput.chain,
    discoveryOutput.entries,
  )

  const templateModels = buildTemplateModels(
    discoveryOutput,
    templatesFolder,
    addressToNameMap,
  )

  const relationsModels = buildRelationsModels(
    discoveryOutput,
    addressToNameMap,
  )

  const models = { ...templateModels, ...relationsModels }
  for (const [filename, content] of Object.entries(models)) {
    const outputFile = path.join(outputFolder, filename)
    writeFileSync(outputFile, content.join('\n'))
  }
}

export function buildTemplateModels(
  discoveryOutput: DiscoveryOutput,
  templatesFolder: string,
  addressToNameMap: Record<string, string>,
): Record<string, string[]> {
  const templateModels: Record<string, string[]> = {}
  for (const contract of discoveryOutput.entries) {
    if (!contract.template) {
      continue
    }

    const templatePath = path.join(templatesFolder, contract.template)
    const templateModelPaths = findTemplateModelFiles(templatePath)

    for (const path of templateModelPaths) {
      const content = readFileSync(path, 'utf8')
      const values = contractValuesForInterpolation(
        discoveryOutput.chain,
        contract,
      )
      const interpolated = interpolateModelTemplate(
        content,
        values,
        addressToNameMap,
      )
      const filename = basename(path)
      templateModels[filename] = templateModels[filename] ?? []
      templateModels[filename].push(interpolated)
    }
  }
  return templateModels
}

export function findTemplateModelFiles(templatePath: string): string[] {
  if (!existsSync(templatePath)) {
    throw new Error(`Templates folder ${templatePath} not found`)
  }
  return readdirSync(templatePath, {
    withFileTypes: true,
  })
    .filter((x) => x.isFile() && x.name.endsWith('.lp'))
    .map((x) => path.join(templatePath, x.name))
}

export function buildAddressToNameMap(
  chain: string,
  entries: EntryParameters[],
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const entity of entries) {
    const address = entity.address.toLowerCase()
    const suffix = `_${chain}_${address}`
    result[address] = (entity.name ?? 'eoa') + suffix
  }
  return result
}
