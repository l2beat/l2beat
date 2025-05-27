import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs'
import path, { join } from 'path'
import { assert, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import type { z } from 'zod'
import {
  combineImplementationHashes,
  contractFlatteningHash,
  getHashForMatchingFromSources,
} from '../../flatten/utils'
import type { ContractSource } from '../../utils/IEtherscanClient'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import { ColorContract } from '../config/ColorConfig'
import type { ConfigRegistry } from '../config/ConfigRegistry'
import { ContractPermission } from '../config/PermissionConfig'
import type { ShapeSchema } from '../config/ShapeSchema'
import { StructureContract } from '../config/StructureConfig'
import { hashJsonStable } from '../config/hashJsonStable'
import { makeEntryStructureConfig } from '../config/structureUtils'
import { toPrettyJson } from '../output/toPrettyJson'
import type { DiscoveryOutput } from '../output/types'
import type { ContractSources } from '../source/SourceCodeService'
import { readJsonc } from '../utils/readJsonc'

export const TEMPLATES_PATH = path.join('_templates')

export interface ShapeCriteria {
  validAddresses?: string[]
}

export interface Shape {
  criteria?: ShapeCriteria
  hashes: Hash256[]
}

export class TemplateService {
  private loadedTemplates: Record<string, StructureContract> = {}
  private shapeHashes: Record<string, Shape> | undefined
  private allTemplateHashes: Record<string, Hash256> | undefined

  constructor(private readonly rootPath: string) {}

  getTemplatePath(template: string): string {
    return path.join(this.rootPath, TEMPLATES_PATH, template)
  }

  exists(template: string): boolean {
    const resolvedRootPath = path.join(this.rootPath, TEMPLATES_PATH)
    return existsSync(join(resolvedRootPath, template, 'template.jsonc'))
  }

  /**
   * @returns A record where the keys are template IDs (relative paths from the templates
   *          root directory) and the values are arrays of paths to the Solidity shape
   *          files for each template.
   */
  listAllTemplates() {
    const result: Record<
      string,
      { criteria?: ShapeCriteria; shapePath: string | undefined }
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
      const shapePath = join(path, 'shapes.json')

      const hasShape = existsSync(shapePath)
      const criteriaPath = join(path, 'criteria.json')
      const criteria = existsSync(criteriaPath)
        ? JSON.parse(readFileSync(criteriaPath, 'utf8'))
        : undefined
      criteria?.validAddresses?.map((a: string) => EthereumAddress(a))

      const templateId = path.substring(resolvedRootPath.length + 1)
      result[templateId] = {
        criteria,
        shapePath: hasShape ? shapePath : undefined,
      }
    }
    return result
  }

  findMatchingTemplates(
    sources: ContractSources,
    address: EthereumAddress,
  ): string[] {
    if (!sources.isVerified) {
      return []
    }

    const sourceHash = getHashForMatchingFromSources(sources.sources)

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

  loadContractTemplateBase<T extends z.ZodTypeAny>(
    template: string,
    keySuffix: string,
    parser: T,
  ): z.infer<T> {
    const key = `${template}.${keySuffix}`
    const loadedTemplate = this.loadedTemplates[key]
    if (loadedTemplate !== undefined) {
      return loadedTemplate as z.infer<T>
    }

    const templateJsonc = readJsonc(
      path.join(this.rootPath, TEMPLATES_PATH, template, 'template.jsonc'),
    )

    const parsed = parser.parse(templateJsonc)
    this.loadedTemplates[key] = parsed
    return parsed
  }

  loadClingoModelTemplate(template: string): string | undefined {
    const modelPath = path.join(
      this.rootPath,
      TEMPLATES_PATH,
      template,
      'model.lp',
    )
    return existsSync(modelPath) ? readFileSync(modelPath, 'utf8') : undefined
  }

  loadContractTemplate(template: string): StructureContract {
    return this.loadContractTemplateBase(
      template,
      'contract',
      StructureContract,
    )
  }

  loadContractTemplateColor(template: string | undefined): ColorContract {
    if (template === undefined) {
      return ColorContract.parse({})
    }

    return this.loadContractTemplateBase(template, 'color', ColorContract)
  }

  loadContractPermissionTemplate(template: string): ContractPermission {
    return this.loadContractTemplateBase(
      template,
      'permission',
      ContractPermission,
    )
  }

  getTemplateHash(template: string): Hash256 {
    const templateJson = this.loadContractTemplate(template)
    return hashJsonStable(templateJson)
  }

  getAllShapes(): Record<string, Shape> {
    if (this.shapeHashes !== undefined) {
      return this.shapeHashes
    }

    const result: Record<string, Shape> = {}
    const allTemplates = this.listAllTemplates()
    for (const [templateId, { criteria, shapePath }] of Object.entries(
      allTemplates,
    )) {
      const hashes = Object.values(this.readShapeSchema(shapePath)).map(
        (shape) => shape.hash,
      )
      result[templateId] = { criteria, hashes }
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

  // returns reason or undefined
  discoveryNeedsRefresh(discovery: DiscoveryOutput, config: ConfigRegistry) {
    const allTemplateHashes = this.getAllTemplateHashes()
    const allShapes = this.getAllShapes()

    for (const contract of discovery.entries) {
      if (contract.sourceHashes === undefined) {
        continue
      }
      const hashes =
        contract.sourceHashes.length === 1
          ? contract.sourceHashes
          : contract.sourceHashes.slice(1)

      if (hashes.length > 1) {
        // NOTE(radomski): Diamonds don't really work well with templates right now
        continue
      }

      const hash = hashes[0]
      assert(
        hash !== undefined,
        `Source hash is undefined for contract "${contract.name}" at address "${contract.address}". This indicates an issue with the discovery process or contract deployment.`,
      )
      const sourcesHash = Hash256(hash)
      const matchingTemplates = this.findMatchingTemplatesByHash(
        sourcesHash,
        contract.address,
      )

      if (
        contract.template !== undefined &&
        (allShapes[contract.template]?.hashes.length ?? 0) > 0
      ) {
        if (
          makeEntryStructureConfig(config.structure, contract.address)
            .extends === undefined
        ) {
          if (matchingTemplates.length === 0) {
            return `A contract "${contract.name}" with template "${contract.template}", no longer matches any template`
          }
          if (contract.template !== matchingTemplates[0]) {
            return `A contract "${contract.name}" matches a different template: "${contract.template} -> ${matchingTemplates.join(', ')}"`
          }
        }
      } else if (matchingTemplates.length > 0) {
        return `A contract "${contract.name}" without template now matches: "${matchingTemplates.join(', ')}"`
      }
    }

    if (discovery.configHash !== hashJsonStable(config.structure)) {
      return 'project config or used template has changed'
    }

    const outdatedTemplates = []
    for (const [templateId, templateHash] of Object.entries(
      discovery.usedTemplates,
    )) {
      if (templateHash !== allTemplateHashes[templateId]) {
        outdatedTemplates.push(templateId)
      }
    }

    if (outdatedTemplates.length > 0) {
      return `template configs has changed: ${outdatedTemplates.join(', ')}`
    }
  }

  async ensureTemplateExists(templateId: string) {
    const templateDirPath = join(this.rootPath, TEMPLATES_PATH, templateId)
    const templatePath = join(templateDirPath, 'template.jsonc')

    if (!existsSync(templatePath)) {
      mkdirSync(templateDirPath, { recursive: true })

      const numOfBackwardsSlashes = templateId.split('/').length - 1
      const schemaProperty = `../../../../../${'../'.repeat(numOfBackwardsSlashes)}discovery/schemas/contract.v2.schema.json`
      const json = {
        $schema: schemaProperty,
      }

      writeFileSync(templatePath, await toPrettyJson(json))

      return true
    }

    return false
  }

  reload() {
    this.shapeHashes = undefined
    this.allTemplateHashes = undefined
    this.loadedTemplates = {}
  }

  async addToShape(
    templateId: string,
    chain: string,
    addresses: EthereumAddress[],
    fileName: string,
    blockNumber: number,
    sources: ContractSource[],
  ): Promise<void> {
    assert(this.exists(templateId), 'Template does not exist')
    const allTemplates = this.listAllTemplates()
    const entry = allTemplates[templateId]
    assert(entry !== undefined, 'Could not find template')

    const shapes =
      entry.shapePath === undefined ? {} : this.readShapeSchema(entry.shapePath)

    const hashes = sources
      .map(contractFlatteningHash)
      .filter((h) => h !== undefined)
      .sort()

    assert(hashes.length > 0, 'Could not find hash')

    const masterHash =
      hashes.length > 1
        ? combineImplementationHashes(hashes)
        : // biome-ignore lint/style/noNonNullAssertion: just checked
          Hash256(hashes[0]!)

    if (Object.values(shapes).some((s) => s.hash === masterHash)) {
      return
    }

    shapes[fileName] = {
      hash: masterHash,
      // biome-ignore lint/style/noNonNullAssertion: just checked
      address: addresses.length > 1 ? addresses : addresses[0]!,
      chain,
      blockNumber,
    }

    const resolvedRootPath = path.join(this.rootPath, TEMPLATES_PATH)
    const templatePath = join(resolvedRootPath, templateId)
    const shapePath = join(templatePath, 'shapes.json')
    writeFileSync(shapePath, await toPrettyJson(shapes))
  }

  readShapeSchema(shapePath: string | undefined): ShapeSchema {
    if (shapePath === undefined) {
      return {}
    }

    return JSON.parse(readFileSync(shapePath, 'utf8')) as ShapeSchema
  }

  findShapeByTemplateAndHash(templateId: string, hash: Hash256) {
    const allTemplates = this.listAllTemplates()
    const entry = allTemplates[templateId]
    if (!entry || !entry.shapePath) {
      return undefined
    }

    const shapes = this.readShapeSchema(entry.shapePath)

    const shapeFound = Object.entries(shapes).find(([_, s]) => s.hash === hash)

    if (!shapeFound) {
      return undefined
    }

    const [shapeKey, shape] = shapeFound

    return { name: shapeKey, shape, criteria: entry.criteria }
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
