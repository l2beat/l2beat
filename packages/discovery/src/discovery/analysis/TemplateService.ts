import { existsSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'

import {
  HashedFileContent,
  buildSimilarityHashmap,
  estimateSimilarity,
  flattenFirstSource,
  removeComments,
} from '../../flatten/utils'
import { TEMPLATES_PATH } from '../config/ConfigReader'
import { ContractSources } from '../source/SourceCodeService'

const TEMPLATE_SHAPE_FOLDER = 'shape'
const TEMPLATE_SIMILARITY_THRESHOLD = 0.55

export class TemplateService {
  constructor(
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
    iterateFoldersRecursively(TEMPLATES_PATH, (path) => {
      if (!existsSync(join(path, 'template.jsonc'))) {
        return
      }
      const shapePath = join(path, TEMPLATE_SHAPE_FOLDER)
      if (!existsSync(shapePath)) {
        return
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
        const templateId = path.substring(TEMPLATES_PATH.length + 1)
        result[templateId] = maxSimilarity
      }
    })

    return result
  }
}

function iterateFoldersRecursively(
  path: string,
  callback: (path: string) => void,
): void {
  callback(path)
  const folders = readdirSync(path, { withFileTypes: true }).filter((x) =>
    x.isDirectory(),
  )
  for (const folder of folders) {
    iterateFoldersRecursively(join(path, folder.name), callback)
  }
}
