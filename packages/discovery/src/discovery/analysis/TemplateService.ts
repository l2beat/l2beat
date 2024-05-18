import { existsSync, readFileSync, readdirSync } from 'fs'
import path, { join } from 'path'

import {
  HashedFileContent,
  buildSimilarityHashmap,
  estimateSimilarity,
  flattenFirstSource,
  removeComments,
} from '../../flatten/utils'
import {
  DiscoveryContract,
  RawDiscoveryConfig,
} from '../config/RawDiscoveryConfig'
import { ContractSources } from '../source/SourceCodeService'
import { readJsonc } from '../utils/readJsonc'

const TEMPLATES_PATH = path.join('discovery', '_templates')
const TEMPLATE_SHAPE_FOLDER = 'shape'
const TEMPLATE_SIMILARITY_THRESHOLD = 0.55

export class TemplateService {
  constructor(
    private readonly rootPath: string = '',
    private readonly similarityThreshold: number = TEMPLATE_SIMILARITY_THRESHOLD,
  ) {}

  findMatchingTemplates(sources: ContractSources): Record<string, number> {
    const result: Record<string, number> = {}
    if (!sources.isVerified) {
      return result
    }

    const flatSource = removeComments(flattenFirstSource(sources))
    const sourceHashed: HashedFileContent = {
      path: '',
      hashChunks: buildSimilarityHashmap(flatSource),
      content: flatSource,
    }

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
      }).filter((x) => x.isFile() && x.name.endsWith('.sol'))

      const similarities: number[] = []
      for (const file of solidityShapeFiles) {
        const shapeFilePath = join(shapePath, file.name)
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
        const templateId = path.substring(resolvedRootPath.length + 1)
        result[templateId] = maxSimilarity
      }
    }

    return result
  }

  readContractTemplate(template: string): DiscoveryContract {
    const templateJsonc = readJsonc(
      path.join(this.rootPath, TEMPLATES_PATH, template, 'template.jsonc'),
    )
    return DiscoveryContract.parse(templateJsonc)
  }

  inlineTemplates(rawConfig: RawDiscoveryConfig): void {
    if (rawConfig.overrides === undefined) {
      return
    }
    for (const [name, contract] of Object.entries(rawConfig.overrides)) {
      if (contract.extends !== undefined) {
        const templateJson = this.readContractTemplate(contract.extends)
        const updatedContract = DiscoveryContract.parse({
          ...templateJson,
          ...contract,
        })
        rawConfig.overrides[name] = updatedContract
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
