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
  parsePermissionGroupFacts,
  parseUltimatePermissionFact,
} from './parseUltimatePermissionFact'
import { resolveImpactScenarios } from './resolveImpactScenarios'
import { runClingo } from './runClingo'

export type DiscoveryTimestamps = {
  [project: string]: { timestamp: number }
}

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

  getTimestamps(options: { skip?: { project: string } } = {}) {
    const result: DiscoveryTimestamps = {}
    const skip = options.skip

    for (const [project, discovery] of Object.entries(this.discoveries)) {
      if (skip && skip.project === project) {
        continue
      }
      result[project] = {
        timestamp: discovery.discoveryOutput.timestamp,
      }
    }

    return result
  }
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
  const output = buildPermissionsOutput(
    permissionFacts,
    permissionsConfigHash,
    discoveries,
  )
  output.impactScenarios = resolveImpactScenarios(
    discoveries.getSortedProjects().map((dependencyProject) => ({
      discovery: discoveries.get(dependencyProject).discoveryOutput,
      permissions: configReader.readConfig(dependencyProject).permission,
    })),
    output,
    templateService,
  )
  return output
}

export function buildPermissionsOutput(
  permissionFacts: ClingoFact[],
  permissionsConfigHash: Hash256,
  discoveries: DiscoveryRegistry,
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
  const permissionGroups = parsePermissionGroupFacts(
    kb.getFacts('permissionGroup'),
    modelIdRegistry,
  )
  return {
    permissionsConfigHash,
    permissions: ultimatePermissions,
    eoasWithUpgradePermissions,
    permissionGroups,
    dependentTimestamps: discoveries.getTimestamps(),
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
  const clingoForProject = generateClingoForDiscoveries(
    discoveries,
    configReader,
    templateService,
  )
  const modelPermissionsClingoFile = readModelPermissionsClingoFile(paths)
  const combinedClingo = clingoForProject + '\n' + modelPermissionsClingoFile

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

  const permissionsConfigHash = generatePermissionConfigHash(clingoForProject)
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
): string {
  const generatedClingo: string[] = []
  const projects = discoveries.getSortedProjects()
  const addressToNameMap = buildAddressToNameMap(
    projects.flatMap(
      (project) => discoveries.get(project).discoveryOutput.entries,
    ),
  )

  for (const dependencyProject of projects) {
    const discovery = discoveries.get(dependencyProject).discoveryOutput
    const config = configReader.readConfig(dependencyProject)
    const permissionsInClingo = generateClingoForProjectOnChain(
      config.permission,
      configReader,
      discovery,
      templateService,
      addressToNameMap,
    )
    generatedClingo.push(permissionsInClingo)
  }

  return generatedClingo.join('\n')
}

export function generateClingoForProjectOnChain(
  config: PermissionsConfig,
  configReader: ConfigReader,
  discovery: DiscoveryOutput,
  templateService: TemplateService,
  addressToNameMap = buildAddressToNameMap(discovery.entries),
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

export function getDependenciesToDiscoverForProject(
  project: string,
  configReader: ConfigReader,
): string[] {
  const config = configReader.readRawConfig(project)
  if (!config.modelCrossChainPermissions) {
    return [project]
  }

  return configReader
    .readDiscoveryWithReferences(project)
    .map((discovery) => discovery.name)
}
