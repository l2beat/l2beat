import { existsSync, readFileSync, readdirSync } from 'fs'
import path, { join } from 'path'

import { hashJson } from '@l2beat/shared'
import { Hash256, json } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import {
  flattenFirstSource,
  formatIntoHashable,
  sha2_256bit,
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

export class TemplateService {
  private readonly loadedTemplates: Record<string, DiscoveryContract> = {}
  private shapeHashes: Record<string, Hash256[]> | undefined

  constructor(private readonly rootPath: string = '') {}

  /**
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

      const solidityShapeFiles = !existsSync(shapePath)
        ? []
        : readdirSync(shapePath, {
            withFileTypes: true,
          })
            .filter((x) => x.isFile() && x.name.endsWith('.sol'))
            .map((x) => join(shapePath, x.name))

      const templateId = path.substring(resolvedRootPath.length + 1)
      result[templateId] = solidityShapeFiles
    }
    return result
  }

  findMatchingTemplates(sources: ContractSources): string[] {
    const result: string[] = []
    if (!sources.isVerified) {
      return result
    }

    const needleSource = flattenFirstSource(sources)
    if (needleSource === undefined) {
      return result
    }

    const needleHash = sha2_256bit(formatIntoHashable(needleSource))
    const allShapes = this.getAllShapeHashes()
    for (const [templateId, haystackHashes] of Object.entries(allShapes)) {
      if (haystackHashes.includes(needleHash)) {
        result.push(templateId)
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

  getAllShapeHashes(): Record<string, Hash256[]> {
    if (this.shapeHashes !== undefined) {
      return this.shapeHashes
    }

    const result: Record<string, Hash256[]> = {}
    const allTemplates = this.listAllTemplates()
    for (const [templateId, shapeFilePaths] of Object.entries(allTemplates)) {
      const haystackHashes = shapeFilePaths.map((p) =>
        sha2_256bit(formatIntoHashable(readFileSync(p, 'utf8'))),
      )
      result[templateId] = haystackHashes
    }

    this.shapeHashes = result
    return result
  }

  getAllTemplateHashes(): Record<string, Hash256> {
    const result: Record<string, Hash256> = {}
    const allTemplates = this.listAllTemplates()
    for (const templateId of Object.keys(allTemplates)) {
      result[templateId] = this.getTemplateHash(templateId)
    }
    return result
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
    return DiscoveryContract.parse(merge({}, templateJson, contract))
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
