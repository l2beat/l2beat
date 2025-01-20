import { existsSync, readFileSync, readdirSync } from 'fs'
import path, { join } from 'path'

import { hashJson } from '@l2beat/shared'
import { EthereumAddress, Hash256, json } from '@l2beat/shared-pure'
import {
  flattenFirstSource,
  formatIntoHashable,
  sha2_256bit,
} from '../../flatten/utils'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import { DiscoveryContract } from '../config/RawDiscoveryConfig'
import { ContractSources } from '../source/SourceCodeService'
import { readJsonc } from '../utils/readJsonc'

const TEMPLATES_PATH = path.join('discovery', '_templates')
const TEMPLATE_SHAPE_FOLDER = 'shape'

interface ShapeCriteria {
  validAddresses?: string[]
}

export interface Shape {
  criteria?: ShapeCriteria
  hashes: Hash256[]
}

export class TemplateService {
  private readonly loadedTemplates: Record<string, DiscoveryContract> = {}
  private shapeHashes: Record<string, Shape> | undefined
  private allTemplateHashes: Record<string, Hash256> | undefined

  constructor(private readonly rootPath: string = '') {}

  /**
   * @returns A record where the keys are template IDs (relative paths from the templates
   *          root directory) and the values are arrays of paths to the Solidity shape
   *          files for each template.
   */
  listAllTemplates() {
    const result: Record<
      string,
      { criteria?: ShapeCriteria; paths: string[] }
    > = {}
    const resolvedRootPath = path.join(this.rootPath, TEMPLATES_PATH)
    if (!fileExistsCaseSensitive(resolvedRootPath)) {
      return {}
    }
    const templatePaths = listAllPaths(resolvedRootPath)
    for (const path of templatePaths) {
      if (!existsSync(join(path, 'template.jsonc'))) {
        continue
      }
      const shapePath = join(path, TEMPLATE_SHAPE_FOLDER)

      const solidityShapeFiles = !existsSync(shapePath)
        ? []
        : readdirSync(shapePath, {
            withFileTypes: true,
          })
            .filter((x) => x.isFile() && x.name.endsWith('.sol'))
            .map((x) => join(shapePath, x.name))
      const criteriaPath = join(shapePath, 'criteria.json')
      const criteria = existsSync(criteriaPath)
        ? JSON.parse(readFileSync(criteriaPath, 'utf8'))
        : undefined
      criteria?.validAddresses?.map((a: string) => EthereumAddress(a))

      const templateId = path.substring(resolvedRootPath.length + 1)
      result[templateId] = { criteria, paths: solidityShapeFiles }
    }
    return result
  }

  findMatchingTemplates(
    sources: ContractSources,
    address: EthereumAddress,
  ): string[] {
    const sourceHash = hashFirstSource(sources)
    if (sourceHash === undefined) {
      return []
    }
    return this.findMatchingTemplatesByHash(sourceHash, address)
  }

  findMatchingTemplatesByHash(
    sourcesHash: Hash256,
    address: EthereumAddress,
  ): string[] {
    const result: [string, number][] = []

    const allShapes = this.getAllShapes()
    for (const [templateId, shape] of Object.entries(allShapes)) {
      const criteriaMatches: string[] = []
      if (shape.criteria && shape.criteria.validAddresses) {
        if (!shape.criteria.validAddresses.includes(address)) {
          continue
        } else {
          criteriaMatches.push('validAddress')
        }
      }
      if (shape.hashes.includes(sourcesHash)) {
        criteriaMatches.push('implementation')
        result.push([templateId, criteriaMatches.length])
      }
    }

    const maxMatches = Math.max(...result.map(([, matches]) => matches))

    // remove results that have less than maxMatches
    // so that more specific match trumps more general ones
    const filteredResult = result
      .filter(([, matches]) => matches === maxMatches)
      .map(([templateId]) => templateId)
    filteredResult.sort()

    return filteredResult
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

  getAllShapes(): Record<string, Shape> {
    if (this.shapeHashes !== undefined) {
      return this.shapeHashes
    }

    const result: Record<string, Shape> = {}
    const allTemplates = this.listAllTemplates()
    for (const [templateId, shapeFilePaths] of Object.entries(allTemplates)) {
      const haystackHashes = shapeFilePaths.paths.map((p) =>
        sha2_256bit(formatIntoHashable(readFileSync(p, 'utf8'))),
      )
      result[templateId] = {
        criteria: shapeFilePaths.criteria,
        hashes: haystackHashes,
      }
    }

    this.shapeHashes = result
    return result
  }

  getAllTemplateHashes(): Record<string, Hash256> {
    if (this.allTemplateHashes !== undefined) {
      return this.allTemplateHashes
    }
    const result: Record<string, Hash256> = {}
    const allTemplates = this.listAllTemplates()
    for (const templateId of Object.keys(allTemplates)) {
      result[templateId] = this.getTemplateHash(templateId)
    }
    this.allTemplateHashes = result
    return result
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

export function hashFirstSource(sources: ContractSources): Hash256 | undefined {
  if (!sources.isVerified || sources.sources.length < 1) {
    return
  }

  const flattenedSource = flattenFirstSource(sources)
  if (flattenedSource === undefined) {
    return
  }
  return sha2_256bit(formatIntoHashable(flattenedSource))
}
