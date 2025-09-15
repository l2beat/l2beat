import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
  formatJson,
  Hash256,
} from '@l2beat/shared-pure'
import type { Parser } from '@l2beat/validate'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import path, { join } from 'path'
import {
  combineImplementationHashes,
  contractFlatteningHash,
  getHashForMatchingFromSources,
} from '../../flatten/utils'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import type { ContractSource } from '../../utils/IEtherscanClient'
import { ColorContract } from '../config/ColorConfig'
import type { ConfigRegistry } from '../config/ConfigRegistry'
import { hashJsonStable } from '../config/hashJsonStable'
import { ContractPermission } from '../config/PermissionConfig'
import type { ShapeSchema } from '../config/ShapeSchema'
import { StructureContract } from '../config/StructureConfig'
import { generateStructureHash } from '../output/structureOutput'
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
  private loadedTemplates: Record<string, unknown> = {}
  private shapeHashes: Record<string, Shape> | undefined
  private allTemplateHashes: Record<string, Hash256> | undefined
  private hashIndex:
    | Map<string, { templateId: string; criteria?: ShapeCriteria }[]>
    | undefined

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
    address: ChainSpecificAddress,
  ): string[] {
    const sourceHash = getHashForMatchingFromSources(sources.sources)

    if (sourceHash === undefined) {
      return []
    }

    return this.findMatchingTemplatesByHash(sourceHash, address)
  }

  findMatchingTemplatesByHash(
    sourcesHash: Hash256,
    address: ChainSpecificAddress,
  ): string[] {
    const candidates = this.getHashIndex().get(sourcesHash.toString()) ?? []

    let max = 0
    const scored: [string, number][] = []

    for (const { templateId, criteria } of candidates) {
      let score = 1 // implementation hash always matched
      if ((criteria?.validAddresses ?? []).includes(address)) {
        score++ // valid-address criterion matched
      } else if (criteria?.validAddresses?.length ?? 0 > 0) {
        continue // valid-address criterion not matched
      }

      max = Math.max(max, score)
      scored.push([templateId, score])
    }

    return [
      ...new Set(
        scored
          .filter(([, s]) => s === max)
          .map(([id]) => id)
          .sort(),
      ),
    ]
  }

  loadContractTemplateBase<T>(
    template: string,
    keySuffix: string,
    parser: Parser<T>,
  ): T {
    const key = `${template}.${keySuffix}`
    const loadedTemplate = this.loadedTemplates[key]
    if (loadedTemplate !== undefined) {
      return loadedTemplate as T
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
        if (matchingTemplates.length === 0) {
          return `A contract "${contract.name}" with template "${contract.template}", no longer matches any template`
        }
        if (contract.template !== matchingTemplates[0]) {
          return `A contract "${contract.name}" matches a different template: "${contract.template} -> ${matchingTemplates.join(', ')}"`
        }
      } else if (matchingTemplates.length > 0) {
        return `A contract "${contract.name}" without template now matches: "${matchingTemplates.join(', ')}"`
      }
    }

    const structureHash = generateStructureHash(config.structure)
    if (discovery.configHash !== structureHash) {
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

  ensureTemplateExists(templateId: string) {
    const templateDirPath = join(this.rootPath, TEMPLATES_PATH, templateId)
    const templatePath = join(templateDirPath, 'template.jsonc')

    if (!existsSync(templatePath)) {
      mkdirSync(templateDirPath, { recursive: true })

      const numOfBackwardsSlashes = templateId.split('/').length - 1
      const schemaProperty = `../../../../../${'../'.repeat(numOfBackwardsSlashes)}discovery/schemas/contract.v2.schema.json`
      const json = {
        $schema: schemaProperty,
      }

      writeFileSync(templatePath, formatJson(json))

      return true
    }

    return false
  }

  private getHashIndex() {
    if (this.hashIndex) return this.hashIndex

    this.hashIndex = new Map()
    for (const [templateId, shape] of Object.entries(this.getAllShapes())) {
      for (const h of shape.hashes) {
        const key = h.toString()
        const bucket = this.hashIndex.get(key)
        const entry = { templateId, criteria: shape.criteria }
        bucket ? bucket.push(entry) : this.hashIndex.set(key, [entry])
      }
    }
    return this.hashIndex
  }

  reload() {
    this.shapeHashes = undefined
    this.allTemplateHashes = undefined
    this.loadedTemplates = {}
    this.hashIndex = undefined
  }

  addToShape(
    templateId: string,
    chain: string,
    addresses: EthereumAddress[],
    fileName: string,
    blockNumber: number,
    sources: ContractSource[],
  ): void {
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

    const hashAlreadyExists = Object.values(shapes).some(
      (s) => s.hash === masterHash,
    )

    assert(
      !hashAlreadyExists,
      `Shape for '${fileName}' with hash '${masterHash.toString().slice(0, 10)}...${masterHash.toString().slice(-10)}' already exists in '${templateId}'`,
    )

    assert(
      !shapes[fileName],
      `Shape with file name '${fileName}' already exists in '${templateId}'. Select a different file name.`,
    )

    const address =
      addresses.length > 1
        ? addresses.map((a) => ChainSpecificAddress.fromLong(chain, a))
        : // biome-ignore lint/style/noNonNullAssertion: just checked
          ChainSpecificAddress.fromLong(chain, addresses[0]!)

    const newShapes = {
      ...shapes,
      [fileName]: {
        hash: masterHash,
        address,
        chain,
        blockNumber,
      },
    }

    const resolvedRootPath = path.join(this.rootPath, TEMPLATES_PATH)
    const templatePath = join(resolvedRootPath, templateId)
    const shapePath = join(templatePath, 'shapes.json')
    writeFileSync(shapePath, formatJson(newShapes))
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

  readTemplateFile(templateId: string) {
    const templatePath = join(this.rootPath, TEMPLATES_PATH, templateId)
    const filePath = join(templatePath, 'template.jsonc')
    return existsSync(filePath) ? readFileSync(filePath, 'utf8') : undefined
  }

  writeTemplateFile(templateId: string, template: string) {
    const templatePath = join(this.rootPath, TEMPLATES_PATH, templateId)
    const filePath = join(templatePath, 'template.jsonc')
    writeFileSync(filePath, template)
  }

  readShapeFile(templateId: string) {
    const templatePath = join(this.rootPath, TEMPLATES_PATH, templateId)
    const filePath = join(templatePath, 'shapes.json')
    return existsSync(filePath) ? readFileSync(filePath, 'utf8') : undefined
  }

  readCriteriaFile(templateId: string) {
    const templatePath = join(this.rootPath, TEMPLATES_PATH, templateId)
    const filePath = join(templatePath, 'criteria.json')
    return existsSync(filePath) ? readFileSync(filePath, 'utf8') : undefined
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
