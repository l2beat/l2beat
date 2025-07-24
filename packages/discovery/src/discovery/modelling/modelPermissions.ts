import { assert, Hash256 } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { getChainShortName } from '../../config/config.discovery'
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
  parseEoaWithMajorityUpgradePermissionsFacts,
  parseUltimatePermissionFact,
} from './parseUltimatePermissionFact'
import { runClingo } from './runClingo'

export type DiscoveryTimestamps = {
  [project: string]: {
    [chain: string]: {
      timestamp: number
      blockNumber?: number // TODO(radomski): To be removed
    }
  }
}

export class DiscoveryRegistry {
  discoveries: {
    [name: string]: {
      [chain: string]: {
        discoveryOutput: DiscoveryOutput
        analysis?: Analysis[]
      }
    }
  } = {}

  get(project: string, chain: string) {
    assert(
      this.discoveries[project]?.[chain],
      `Discovery for ${project} on ${chain} is not set.`,
    )
    return this.discoveries[project][chain]
  }

  set(
    project: string,
    chain: string,
    discoveryOutput: DiscoveryOutput,
    analysis?: Analysis[],
  ) {
    this.discoveries[project] ??= {}
    this.discoveries[project][chain] = { discoveryOutput, analysis }
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

  getTimestamps(options: { skip?: { project: string; chain: string } } = {}) {
    const result: DiscoveryTimestamps = {}
    const skip = options.skip

    for (const [project, chains] of Object.entries(this.discoveries)) {
      for (const [chain, discovery] of Object.entries(chains)) {
        if (skip && skip.project === project && skip.chain === chain) {
          continue
        }
        result[project] ??= {}
        result[project][chain] = {
          timestamp: discovery.discoveryOutput.timestamp,
        }
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
    .sort((a, b) =>
      `${a.chain}-${a.project}`.localeCompare(`${b.chain}-${b.project}`),
    )
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
  const eoaWithMajorityUpgradePermissions =
    parseEoaWithMajorityUpgradePermissionsFacts(
      kb.getFacts('eoaWithMajorityUpgradePermissions'),
      modelIdRegistry,
    )
  return {
    permissionsConfigHash,
    permissions: ultimatePermissions,
    eoasWithMajorityUpgradePermissions: eoaWithMajorityUpgradePermissions,
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

  for (const { project, chain } of discoveries.getSortedProjects()) {
    const discovery = discoveries.get(project, chain).discoveryOutput
    const config = configReader.readConfig(project, chain)
    const permissionsInClingo = generateClingoForProjectOnChain(
      config.permission,
      configReader,
      discovery,
      templateService,
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
) {
  const generatedClingo: string[] = []

  const shortChain = getChainShortName(discovery.chain)
  const addressToNameMap = buildAddressToNameMap(discovery.entries)

  const projectSpecificModelLp = getProjectSpecificModelLp(
    discovery.name,
    discovery.chain,
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
        shortChain,
        config,
        templateService,
        addressToNameMap,
      )
      generatedClingo.push(clingoFromPermissions)
      const clingoFromModelLp = generateClingoFromModelLp(
        entry,
        shortChain,
        templateService,
        addressToNameMap,
      )
      if (clingoFromModelLp !== undefined) {
        generatedClingo.push(clingoFromModelLp)
      }
    })

  return generatedClingo.join('\n')
}
