import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import path from 'path'
import type {
  ContractParameters,
  DiscoveryOutput,
  EoaParameters,
} from '@l2beat/discovery-types'
import { interpolateModelFile } from './interpolate'

export function buildAndSaveModelFiles(
  discoveryOutput: DiscoveryOutput,
  templatesFolder: string,
  outputFolder: string,
) {
  const modelFiles: Record<string, string[]> = {}
  const addressToNameMap = buildAddressToNameMap(
    discoveryOutput.contracts,
    discoveryOutput.eoas,
  )

  for (const contract of discoveryOutput.contracts) {
    if (!contract.template) {
      continue
    }

    const templatePath = path.join(templatesFolder, contract.template)
    const lpFiles = findAllModelFiles(templatePath)

    for (const lpFile of lpFiles) {
      const content = readFileSync(lpFile, 'utf8')
      const interpolated = interpolateModelFile(
        content,
        contract,
        addressToNameMap,
      )
      const lpFileName = path.basename(lpFile)
      modelFiles[lpFileName] = modelFiles[lpFileName] ?? []
      modelFiles[lpFileName].push(interpolated)
    }
  }

  for (const [lpFileName, content] of Object.entries(modelFiles)) {
    const outputFile = path.join(outputFolder, lpFileName)
    writeFileSync(outputFile, content.join('\n'))
  }
}

export function findAllModelFiles(templatePath: string): string[] {
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
