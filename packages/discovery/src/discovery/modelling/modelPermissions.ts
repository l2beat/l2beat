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
import { parseUltimatePermissionFact } from './parseUltimatePermissionFact'
import { runClingo } from './runClingo'

export async function modelPermissions(
  project: string,
  configReader: ConfigReader,
  templateService: TemplateService,
  paths: DiscoveryPaths,
  debug: boolean,
): Promise<PermissionsOutput> {
  const { permissionFacts, permissionsConfigHash } =
    await modelPermissionFactsUsingClingo(
      project,
      configReader,
      templateService,
      paths,
      debug,
    )
  return buildPermissionsOutput(permissionFacts, permissionsConfigHash)
}

export async function buildPermissionsOutput(
  permissionFacts: ClingoFact[],
  permissionsConfigHash: Hash256,
) {
  const kb = new KnowledgeBase(permissionFacts)
  const modelIdRegistry = new ModelIdRegistry(kb)
  const ultimatePermissionFacts = kb.getFacts('ultimatePermission')
  const ultimatePermissions = ultimatePermissionFacts.map((fact) =>
    parseUltimatePermissionFact(fact, modelIdRegistry),
  )
  return {
    permissionsConfigHash,
    permissions: ultimatePermissions,
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
) {
  const clingoForProject = generateClingoForProject(
    project,
    configReader,
    templateService,
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

export function generateClingoForProject(
  project: string,
  configReader: ConfigReader,
  templateService: TemplateService,
): string {
  const generatedClingo: string[] = []

  const chainConfigs = configReader
    .readAllChainsForProject(project)
    .sort((a, b) => a.localeCompare(b))
    .flatMap((chain) => configReader.readConfig(project, chain))

  for (const config of chainConfigs) {
    const discovery = configReader.readDiscovery(config.name, config.chain)
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
  const clingoForProject = generateClingoForProjectOnChain(
    permissionConfig,
    discovery,
    templateService,
  )
  const modelPermissionsClingoFile = readModelPermissionsClingoFile(paths)
  const combinedClingo = clingoForProject + '\n' + modelPermissionsClingoFile
  const facts = await runClingoForSingleModel(combinedClingo)
  const parsedFacts = facts.map(parseClingoFact)
  return buildPermissionsOutput(parsedFacts, Hash256.ZERO) // hash for isolated discovery is incorrect anyway
}
