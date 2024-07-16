import { createHash } from 'crypto'
import { existsSync, readFileSync, readdirSync } from 'fs'
import path, { join } from 'path'

import { hashJson, } from '@l2beat/shared'
import { Hash256, json } from '@l2beat/shared-pure'
import {
  HashedFileContent,
  buildSimilarityHashmap,
  estimateSimilarity,
  flattenFirstSource,
  removeComments,
} from '../../flatten/utils'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import {
  DiscoveryContract,
  RawDiscoveryConfig,
} from '../config/RawDiscoveryConfig'
import { ContractSources } from '../source/SourceCodeService'
import { readJsonc } from '../utils/readJsonc'

const TEMPLATES_PATH = path.join('discovery', '_templates')
const TEMPLATE_SHAPE_FOLDER = 'shape'
const TEMPLATE_SIMILARITY_THRESHOLD = 0.999 // TODO: why two identical files are not 1.0?

export class TemplateService {
  private readonly loadedTemplates: Record<string, DiscoveryContract> = {}

  constructor(
    private readonly rootPath: string = '',
    private readonly similarityThreshold: number = TEMPLATE_SIMILARITY_THRESHOLD,
  ) {}

  /**
   * Lists all available templates and their associated shape files.
   * 
   * This method scans the templates directory and its subdirectories for valid templates.
   * A valid template must have a 'template.jsonc' file and a 'shape' folder containing
   * Solidity files (.sol).
   * 
   * @returns A record where the keys are template IDs (relative paths from the templates
   *          root directory) and the values are arrays of paths to the Solidity shape
   *          files for each template.
   */
  listAllTemplates(): Record<string, string[]> {
    const result: Record<string, string[]> = {}
    const resolvedRootPath = path.join(this.rootPath, TEMPLATES_PATH)
    const templatePaths = listAllPaths(resolvedRootPath)
    for (const path of templatePaths) {
      if (!existsSync(join(path, 'template.jsonc'))) {
        continue
      }
      const shapePath = join(path, TEMPLATE_SHAPE_FOLDER)
      if (!existsSync(shapePath)) {
        continue
      }

      const solidityShapeFiles = readdirSync(shapePath, {
        withFileTypes: true,
      })
        .filter((x) => x.isFile() && x.name.endsWith('.sol'))
        .map((x) => join(shapePath, x.name))

      const templateId = path.substring(resolvedRootPath.length + 1)
      result[templateId] = solidityShapeFiles
    }
    return result
  }

  findMatchingTemplates(sources: ContractSources): Record<string, number> {
    const result: Record<string, number> = {}
    if (!sources.isVerified) {
      return result
    }

    const flatSource = flattenFirstSource(sources)
    if (flatSource === undefined) {
      return result
    }

    const processedSource = removeComments(flatSource)
    const sourceHashed: HashedFileContent = {
      path: '',
      hashChunks: buildSimilarityHashmap(processedSource),
      content: processedSource,
    }

    const allTemplates = this.listAllTemplates()
    for (const [templateId, shapeFilePaths] of Object.entries(allTemplates)) {
      const similarities: number[] = []
      for (const shapeFilePath of shapeFilePaths) {
        const shapeFileContent = removeComments(
          readFileSync(shapeFilePath, 'utf8'),
        )
        const shapeFileHashed: HashedFileContent = {
          path: shapeFilePath,
          hashChunks: buildSimilarityHashmap(shapeFileContent),
          content: shapeFileContent,
        }
        const similarity = estimateSimilarity(sourceHashed, shapeFileHashed)
        similarities.push(similarity)
      }
      const maxSimilarity = Math.max(...similarities)
      if (maxSimilarity >= this.similarityThreshold) {
        result[templateId] = maxSimilarity
      }
    }
    return result
  }

  loadContractTemplate(template: string): DiscoveryContract {
    const loadedTemplate = this.loadedTemplates[template]
    if (loadedTemplate !== undefined) {
      return loadedTemplate
    }
    const templateJsonc = readJsonc(
      path.join(this.rootPath, TEMPLATES_PATH, template, 'template.jsonc'),
    )
    const parsed = DiscoveryContract.parse(templateJsonc)
    this.loadedTemplates[template] = parsed
    return parsed
  }

  getTemplateHash(template: string): Hash256 {
    const templateJson = this.loadContractTemplate(template)
    return hashJson(templateJson as json)
  }

  getShapeFilesHash(): Hash256 {
    const hash = createHash('sha256')
    const allTemplates = this.listAllTemplates()

    const sortedTemplateIds = Object.keys(allTemplates)
    sortedTemplateIds.sort()

    for (const templateId of sortedTemplateIds) {
      const sortedShapeFilePaths = allTemplates[templateId] ?? []
      sortedShapeFilePaths.sort()
      for (const shapeFilePath of sortedShapeFilePaths) {
        const shapeFileContent = readFileSync(shapeFilePath, 'utf8')
        hash.update(templateId)
        hash.update('\0') // null byte separator
        hash.update(shapeFileContent)
        hash.update('\0') // null byte separator
      }
    }
    return Hash256('0x' + hash.digest('hex'))
  }

  applyTemplateOnContractOverrides(
    contractOverrides: ContractOverrides,
    template: string,
  ): ContractOverrides {
    return {
      name: contractOverrides.name,
      address: contractOverrides.address,
      ...this.applyTemplate(contractOverrides, template),
    }
  }

  applyTemplate(
    contract: DiscoveryContract,
    template: string,
  ): DiscoveryContract {
    const templateJson = this.loadContractTemplate(template)
    return DiscoveryContract.parse({
      ...templateJson,
      ...contract,
    })
  }

  inlineTemplates(rawConfig: RawDiscoveryConfig): void {
    if (rawConfig.overrides === undefined) {
      return
    }
    for (const [name, contract] of Object.entries(rawConfig.overrides)) {
      if (contract.extends !== undefined) {
        rawConfig.overrides[name] = this.applyTemplate(
          contract,
          contract.extends,
        )
      }
    }
  }
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
