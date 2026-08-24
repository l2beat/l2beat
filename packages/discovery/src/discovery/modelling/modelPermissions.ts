import { Logger } from '@l2beat/backend-tools'
import { assert, Hash256 } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { Analysis } from '../analysis/AddressAnalyzer'
import type { TemplateService } from '../analysis/TemplateService'
import type { ConfigReader } from '../config/ConfigReader'
import type { DiscoveryPaths } from '../config/getDiscoveryPaths'
import type { PermissionsConfig } from '../config/PermissionConfig'
import type { DiscoveryOutput, PermissionsOutput } from '../output/types'
import { buildAddressToNameMap } from './buildAddressToNameMap'
import { type ClingoFact, parseClingoFact } from './clingoparser'
import {
  generateClingoFromModelLp,
  generateClingoFromPermissionsConfig,
  getProjectSpecificModelLp,
} from './generateClingo'
import { KnowledgeBase } from './KnowledgeBase'
import { ModelIdRegistry } from './ModelIdRegistry'
import {
  parseEoaWithUpgradePermissionsFacts,
  parseUltimatePermissionFact,
} from './parseUltimatePermissionFact'
import { runClingo } from './runClingo'

export class DiscoveryRegistry {
  discoveries: {
    [name: string]: {
      discoveryOutput: DiscoveryOutput
      analysis?: Analysis[]
    }
  } = {}
  private insertionOrder: string[] = []

  get(project: string) {
    assert(this.discoveries[project], `Discovery for ${project} is not set.`)
    return this.discoveries[project]
  }

  set(
    project: string,
    discoveryOutput: DiscoveryOutput,
    analysis?: Analysis[],
  ) {
    if (this.discoveries[project] === undefined) {
      this.insertionOrder.push(project)
    }
    this.discoveries[project] = { discoveryOutput, analysis }
  }

  getSortedProjects(): string[] {
    const result = []
    const sortedProjects = Object.keys(this.discoveries).sort()
    for (const project of sortedProjects) {
      result.push(project)
    }
    return result
  }

  // Names in the order they were registered: the modelled project first, then
  // the projects it references. Naming precedence depends on this order.
  getProjectsInPriorityOrder(): string[] {
    return [...this.insertionOrder]
  }
}

// Reads the project and every project it transitively references through
// entrypoints. Referenced projects are never re-discovered, their committed
// discovery is what the project is modelled against.
export function loadDiscoveriesForModelling(
  project: string,
  configReader: ConfigReader,
  logger: Logger = Logger.SILENT,
): DiscoveryRegistry {
  const discoveries = new DiscoveryRegistry()
  for (const discovery of configReader.readDiscoveryWithReferences(project)) {
    logger.info(` - ${discovery.name}`)
    discoveries.set(discovery.name, discovery)
  }
  return discoveries
}

export async function modelPermissions(
  project: string,
  discoveries: DiscoveryRegistry,
  configReader: ConfigReader,
  templateService: TemplateService,
  paths: DiscoveryPaths,
  options: {
    debug: boolean
  },
): Promise<PermissionsOutput> {
  const { permissionFacts, permissionsConfigHash } =
    await modelPermissionFactsUsingClingo(
      project,
      discoveries,
      configReader,
      templateService,
      paths,
      options,
    )
  return buildPermissionsOutput(permissionFacts, permissionsConfigHash)
}

export function buildPermissionsOutput(
  permissionFacts: ClingoFact[],
  permissionsConfigHash: Hash256,
): PermissionsOutput {
  const kb = new KnowledgeBase(permissionFacts)
  const modelIdRegistry = new ModelIdRegistry(kb)
  const ultimatePermissionFacts = kb.getFacts('ultimatePermission')
  const ultimatePermissions = ultimatePermissionFacts.map((fact) =>
    parseUltimatePermissionFact(fact, modelIdRegistry),
  )
  const eoasWithUpgradePermissions = parseEoaWithUpgradePermissionsFacts(
    kb.getFacts('eoaWithUpgradePermissions'),
    modelIdRegistry,
  )
  return {
    permissionsConfigHash,
    permissions: ultimatePermissions,
    eoasWithUpgradePermissions,
  }
}

export async function runClingoForSingleModel(clingoInput: string) {
  const clingoResult = await runClingo(clingoInput)
  if (clingoResult.Result === 'ERROR') {
    throw new Error(clingoResult.Error)
  }
  if (clingoResult.Models.Number !== 1) {
    throw new Error('Expected 1 model, got ' + clingoResult.Models.Number)
  }
  const facts = clingoResult.Call[0]?.Witnesses[0]?.Value as string[]
  if (!facts) {
    throw new Error('No facts found')
  }
  return facts
}

export async function modelPermissionFactsUsingClingo(
  project: string,
  discoveries: DiscoveryRegistry,
  configReader: ConfigReader,
  templateService: TemplateService,
  paths: DiscoveryPaths,
  options: {
    debug: boolean
  },
) {
  const clingo = generateClingoForDiscoveries(
    discoveries,
    configReader,
    templateService,
  )
  const modelPermissionsClingoFile = readModelPermissionsClingoFile(paths)
  const combinedClingo = clingo.combined + '\n' + modelPermissionsClingoFile

  const projectPath = configReader.getProjectPath(project)
  const inputFilePath = join(projectPath, 'clingo.input.lp')
  const outputFilePath = join(projectPath, 'clingo.output.lp')

  if (options.debug) {
    writeFileSync(inputFilePath, combinedClingo)
  }

  const facts = await runClingoForSingleModel(combinedClingo)

  if (options.debug) {
    writeFileSync(outputFilePath, facts.join('.\n'))
  }

  const result = facts.map(parseClingoFact)

  const ownClingo = clingo.byProject[project]
  assert(ownClingo !== undefined, `No clingo generated for ${project}.`)
  const permissionsConfigHash = generatePermissionConfigHash(ownClingo)
  return {
    permissionsConfigHash,
    permissionFacts: result,
  }
}

export function readModelPermissionsClingoFile(paths: DiscoveryPaths): string {
  const path = join(paths.discovery, '_clingo', 'modelPermissions.lp')
  return readFileSync(path, 'utf8')
}

export function generatePermissionConfigHash(clingoInput: string) {
  const hash = createHash('sha256').update(clingoInput).digest('hex')
  return Hash256('0x' + hash)
}

export interface GeneratedClingo {
  // Every project of the cluster, this is what gets solved.
  combined: string
  // Per project, so the hash of a project stays independent of what the
  // projects it references contain.
  byProject: Record<string, string>
}

export function generateClingoForDiscoveries(
  discoveries: DiscoveryRegistry,
  configReader: ConfigReader,
  templateService: TemplateService,
): GeneratedClingo {
  const addressToNameMap = buildClusterAddressToNameMap(discoveries)
  const byProject: Record<string, string> = {}

  for (const project of discoveries.getSortedProjects()) {
    const discovery = discoveries.get(project).discoveryOutput
    const config = configReader.readConfig(project)
    byProject[project] = generateClingoForProjectOnChain(
      config.permission,
      configReader,
      discovery,
      templateService,
      addressToNameMap,
    )
  }

  return {
    combined: Object.values(byProject).join('\n'),
    byProject,
  }
}

// One map for the whole cluster: a permission whose target is missing from it
// is dropped when building the model, which is what used to cut every
// permission crossing an entrypoint boundary.
export function buildClusterAddressToNameMap(
  discoveries: DiscoveryRegistry,
): Record<string, string> {
  const entries = discoveries
    .getProjectsInPriorityOrder()
    .flatMap((project) => discoveries.get(project).discoveryOutput.entries)
  return buildAddressToNameMap(entries)
}

export function generateClingoForProjectOnChain(
  config: PermissionsConfig,
  configReader: ConfigReader,
  discovery: DiscoveryOutput,
  templateService: TemplateService,
  addressToNameMap: Record<string, string>,
) {
  const generatedClingo: string[] = []

  const projectSpecificModelLp = getProjectSpecificModelLp(
    discovery.name,
    configReader,
  )
  if (projectSpecificModelLp) {
    generatedClingo.push(projectSpecificModelLp)
  }

  discovery.entries
    .sort((a, b) => a.address.localeCompare(b.address))
    .forEach((entry) => {
      const clingoFromPermissions = generateClingoFromPermissionsConfig(
        entry,
        config,
        templateService,
        addressToNameMap,
      )
      if (clingoFromPermissions !== undefined) {
        generatedClingo.push(clingoFromPermissions)
      }
      const clingoFromModelLp = generateClingoFromModelLp(
        entry,
        templateService,
        addressToNameMap,
      )
      if (clingoFromModelLp !== undefined) {
        generatedClingo.push(clingoFromModelLp)
      }
    })

  return generatedClingo.join('\n')
}
