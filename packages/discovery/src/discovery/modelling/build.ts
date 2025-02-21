import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import path, { basename } from 'path'
import type {
  ContractParameters,
  DiscoveryOutput,
  EoaParameters,
} from '@l2beat/discovery-types'
import { interpolateModelFile } from './interpolate'

export function buildAndSaveModels(
  discoveryOutput: DiscoveryOutput,
  templatesFolder: string,
  outputFolder: string,
) {
  const templateModels: Record<string, string[]> = {}
  const addressToNameMap = buildAddressToNameMap(
    discoveryOutput.contracts,
    discoveryOutput.eoas,
  )

  for (const contract of discoveryOutput.contracts) {
    if (!contract.template) {
      continue
    }

    const templatePath = path.join(templatesFolder, contract.template)
    const templateModelPaths = findTemplateModelFiles(templatePath)

    for (const path of templateModelPaths) {
      const content = readFileSync(path, 'utf8')
      const interpolated = interpolateModelFile(
        content,
        contract,
        addressToNameMap,
      )
      const filename = basename(path)
      templateModels[filename] = templateModels[filename] ?? []
      templateModels[filename].push(interpolated)
    }
  }

  for (const [filename, content] of Object.entries(templateModels)) {
    const outputFile = path.join(outputFolder, filename)
    writeFileSync(outputFile, content.join('\n'))
  }
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
  contracts: ContractParameters[],
  eoas: EoaParameters[],
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const entity of [...contracts, ...eoas]) {
    const address = entity.address.toLowerCase()
    const suffix = '_' + address.substring(0, 6)
    result[address] = (entity.name ?? 'eoa') + suffix
  }
  return result
}
