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
import type {
  DiscoveryOutput,
  EntryParameters,
  PermissionsOutput,
} from '../output/types'
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

  get(project: string) {
    assert(this.discoveries[project], `Discovery for ${project} is not set.`)
    return this.discoveries[project]
  }

  set(
    project: string,
    discoveryOutput: DiscoveryOutput,
    analysis?: Analysis[],
  ) {
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
}

// Reads the project and every project it transitively references through
// entrypoints. Referenced projects are never re-discovered: their committed
// discovery is what the project is modelled against, and keeping the two sides
// in sync is a research call.
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

// Fills a registry that already holds a freshly discovered project with the
// committed discovery of everything it references. The fresh project stays
// authoritative. Used wherever a project is modelled against a discovery that
// is newer than what is on disk.
export function addReferencedDiscoveries(
  discoveries: DiscoveryRegistry,
  project: string,
  configReader: ConfigReader,
  logger: Logger = Logger.SILENT,
): void {
  let referenced: DiscoveryRegistry
  try {
    referenced = loadDiscoveriesForModelling(project, configReader)
  } catch (error) {
    // One broken reference must not take down the whole update loop.
    logger.error(`Could not read referenced discoveries of ${project}`, error)
    return
  }

  for (const name of referenced.getSortedProjects()) {
    if (name === project) {
      continue
    }
    logger.info(`Modelling against referenced project ${name}`)
    discoveries.set(name, referenced.get(name).discoveryOutput)
  }
}

// Every entry of the cluster, in the shape the permission writer wants.
export function clusterEntries(
  discoveries: DiscoveryRegistry,
): EntryParameters[] {
  return discoveries
    .getSortedProjects()
    .flatMap((name) => discoveries.get(name).discoveryOutput.entries)
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
  const clingoByProject = generateClingoForDiscoveries(
    discoveries,
    configReader,
    templateService,
  )
  const modelPermissionsClingoFile = readModelPermissionsClingoFile(paths)
  const combinedClingo =
    Object.values(clingoByProject).join('\n') +
    '\n' +
    modelPermissionsClingoFile

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

  // Scoped to this project: a change inside a shared module must not turn
  // every consumer red, that drift is surfaced rather than blocked.
  const ownClingo = clingoByProject[project]
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

export function generateClingoForDiscoveries(
  discoveries: DiscoveryRegistry,
  configReader: ConfigReader,
  templateService: TemplateService,
): Record<string, string> {
  // One map across the whole cluster: an address owned by a referenced project
  // is only a Reference stub here, and without its id every permission aimed
  // at it is dropped when the clingo facts are generated.
  const addressToNameMap = buildAddressToNameMap(
    discoveries
      .getSortedProjects()
      .flatMap((project) => discoveries.get(project).discoveryOutput.entries),
  )
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

  return byProject
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
