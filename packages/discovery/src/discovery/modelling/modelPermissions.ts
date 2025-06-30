import { createHash } from 'crypto'
import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Hash256 } from '@l2beat/shared-pure'
import type { TemplateService } from '../analysis/TemplateService'
import type { ConfigReader } from '../config/ConfigReader'
import type { PermissionsConfig } from '../config/PermissionConfig'
import type { DiscoveryPaths } from '../config/getDiscoveryPaths'
import type { DiscoveryOutput, PermissionsOutput } from '../output/types'
import { KnowledgeBase } from './KnowledgeBase'
import { ModelIdRegistry } from './ModelIdRegistry'
import { buildAddressToNameMap } from './buildAddressToNameMap'
import { type ClingoFact, parseClingoFact } from './clingoparser'
import { generateClingoFromModelLp } from './generateClingo'
import { generateClingoFromPermissionsConfig } from './generateClingo'
import {
  parseEoaWithMajorityUpgradePermissionsFacts,
  parseUltimatePermissionFact,
} from './parseUltimatePermissionFact'
import { runClingo } from './runClingo'

export type DiscoveryBlockNumbers = {
  [project: string]: {
    [chain: string]: {
      blockNumber: number
    }
  }
}

export class Discoveries {
  discoveries: { [name: string]: { [chain: string]: DiscoveryOutput } } = {}

  get(project: string, chain: string): DiscoveryOutput | undefined {
    return this.discoveries[project]?.[chain]
  }

  set(project: string, chain: string, discovery: DiscoveryOutput) {
    this.discoveries[project] ??= {}
    this.discoveries[project][chain] = discovery
  }

  getSortedProjects(): { project: string; chain: string }[] {
    const result = []
    const sortedProjects = Object.keys(this.discoveries).sort()
    for (const project of sortedProjects) {
      const sortedChains = Object.keys(this.discoveries[project] ?? {}).sort()
      for (const chain of sortedChains) {
        result.push({ project, chain })
      }
    }
    return result
  }

  getBlockNumbers(
    options: {
      skip?: { project: string; chain: string }
    } = {},
  ) {
    const result: DiscoveryBlockNumbers = {}
    const skip = options.skip

    for (const [project, chains] of Object.entries(this.discoveries)) {
      for (const [chain, discovery] of Object.entries(chains)) {
        if (skip && skip.project === project && skip.chain === chain) {
          continue
        }
        result[project] ??= {}
        result[project][chain] = {
          blockNumber: discovery.blockNumber,
        }
      }
    }

    return result
  }
}

export async function modelPermissions(
  project: string,
  configReader: ConfigReader,
  templateService: TemplateService,
  paths: DiscoveryPaths,
  debug: boolean,
  discoveries: Discoveries,
  options: {
    ignoreMissingDependencies?: boolean
  } = {},
): Promise<PermissionsOutput> {
  const { permissionFacts, permissionsConfigHash } =
    await modelPermissionFactsUsingClingo(
      project,
      configReader,
      templateService,
      paths,
      debug,
      discoveries,
      options,
    )
  return buildPermissionsOutput(
    permissionFacts,
    permissionsConfigHash,
    discoveries,
  )
}

export function getDependenciesToDiscoverForProject(
  project: string,
  configReader: ConfigReader,
): { project: string; chain: string }[] {
  // Currently, only instances of the same project on different chains are returned.
  // In the future, we might want to return referenced shared-modules
  // and recursively dependencies of those.
  return configReader
    .readAllDiscoveredChainsForProject(project)
    .map((chain) => ({ project, chain }))
}

export function buildPermissionsOutput(
  permissionFacts: ClingoFact[],
  permissionsConfigHash: Hash256,
  discoveries: Discoveries,
): PermissionsOutput {
  const kb = new KnowledgeBase(permissionFacts)
  const modelIdRegistry = new ModelIdRegistry(kb)
  const ultimatePermissionFacts = kb.getFacts('ultimatePermission')
  const ultimatePermissions = ultimatePermissionFacts.map((fact) =>
    parseUltimatePermissionFact(fact, modelIdRegistry),
  )
  const eoaWithMajorityUpgradePermissions =
    parseEoaWithMajorityUpgradePermissionsFacts(
      kb.getFacts('eoaWithMajorityUpgradePermissions'),
      modelIdRegistry,
    )
  return {
    permissionsConfigHash,
    permissions: ultimatePermissions,
    eoasWithMajorityUpgradePermissions: eoaWithMajorityUpgradePermissions,
    dependentBlockNumbers: discoveries.getBlockNumbers(),
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
  configReader: ConfigReader,
  templateService: TemplateService,
  paths: DiscoveryPaths,
  debug: boolean,
  discoveries: Discoveries,
  options: {
    ignoreMissingDependencies?: boolean
  },
) {
  const clingoForProject = generateClingoForDiscoveries(
    discoveries,
    configReader,
    templateService,
    options,
  )
  const modelPermissionsClingoFile = readModelPermissionsClingoFile(paths)
  const combinedClingo = clingoForProject + '\n' + modelPermissionsClingoFile
  const projectPath = configReader.getProjectPath(project)

  const inputFilePath = join(projectPath, 'clingo.input.lp')
  writeFileSync(inputFilePath, combinedClingo)

  const facts = await runClingoForSingleModel(combinedClingo)

  const outputFilePath = join(projectPath, 'clingo.output.lp')
  writeFileSync(outputFilePath, facts.join('.\n'))

  const result = facts.map(parseClingoFact)

  if (!debug) {
    unlinkSync(inputFilePath)
    unlinkSync(outputFilePath)
  }

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
  discoveries: Discoveries,
  configReader: ConfigReader,
  templateService: TemplateService,
  options: {
    ignoreMissingDependencies?: boolean
  } = {},
): string {
  const generatedClingo: string[] = []

  for (const { project, chain } of discoveries.getSortedProjects()) {
    const discovery = discoveries.get(project, chain)
    if (!discovery) {
      if (options.ignoreMissingDependencies) {
        console.log(
          `Ignoring missing dependency: ${project} on ${chain}, as requested.`,
        )
        continue
      }
      throw new Error(
        `Discovery for ${project} on ${chain} is required as a dependency but is not provided.`,
      )
    }
    const config = configReader.readConfig(project, chain)
    const permissionsInClingo = generateClingoForProjectOnChain(
      config.permission,
      discovery,
      templateService,
    )
    generatedClingo.push(permissionsInClingo)
  }

  return generatedClingo.join('\n')
}

export function generateClingoForProjectOnChain(
  config: PermissionsConfig,
  discovery: DiscoveryOutput,
  templateService: TemplateService,
) {
  const generatedClingo: string[] = []

  const addressToNameMap = buildAddressToNameMap(
    discovery.chain,
    discovery.entries,
  )

  discovery.entries
    .sort((a, b) => a.address.localeCompare(b.address))
    .forEach((entry) => {
      const clingoFromPermissions = generateClingoFromPermissionsConfig(
        entry,
        discovery.chain,
        config,
        templateService,
        addressToNameMap,
      )
      generatedClingo.push(clingoFromPermissions)
      const clingoFromModelLp = generateClingoFromModelLp(
        entry,
        discovery.chain,
        templateService,
        addressToNameMap,
      )
      if (clingoFromModelLp !== undefined) {
        generatedClingo.push(clingoFromModelLp)
      }
    })

  return generatedClingo.join('\n')
}

// This function is a temporary solution for Update Monitor
// which does discovery per single isolated project.
export async function modelPermissionsForIsolatedDiscovery(
  discovery: DiscoveryOutput,
  permissionConfig: PermissionsConfig,
  templateService: TemplateService,
  paths: DiscoveryPaths,
) {
  const discoveries = new Discoveries()
  discoveries.set(discovery.name, discovery.chain, discovery)
  const clingoForProject = generateClingoForProjectOnChain(
    permissionConfig,
    discovery,
    templateService,
  )
  const modelPermissionsClingoFile = readModelPermissionsClingoFile(paths)
  const combinedClingo = clingoForProject + '\n' + modelPermissionsClingoFile
  const facts = await runClingoForSingleModel(combinedClingo)
  const parsedFacts = facts.map(parseClingoFact)
  return buildPermissionsOutput(parsedFacts, Hash256.ZERO, discoveries) // hash for isolated discovery is incorrect anyway
}
