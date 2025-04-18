import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import { merge } from 'lodash'
import type { TemplateService } from '../analysis/TemplateService'
import type { ConfigReader } from '../config/ConfigReader'
import type { PermissionConfig } from '../config/PermissionConfig'
import type { DiscoveryPaths } from '../config/getDiscoveryPaths'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { KnowledgeBase } from './KnowledgeBase'
import { ModelIdRegistry } from './ModelIdRegistry'
import { type ClingoFact, parseClingoFact } from './clingoparser'
import { interpolateModelTemplate } from './interpolate'
import { parseUltimatePermissionFact } from './parseUltimatePermissionFact'
import {
  buildPermissionsModel,
  contractValuesForInterpolation,
} from './relations'
import { runClingo } from './runClingo'

export async function modelPermissions(
  project: string,
  configReader: ConfigReader,
  templateService: TemplateService,
  paths: DiscoveryPaths,
  debug: boolean,
) {
  const facts = await buildProjectPageFacts(
    project,
    configReader,
    templateService,
    paths,
    debug,
  )
  const kb = new KnowledgeBase(facts)
  const modelIdRegistry = new ModelIdRegistry(kb)
  const ultimatePermissionFacts = kb.getFacts('ultimatePermission')
  const ultimatePermissions = ultimatePermissionFacts.map((fact) =>
    parseUltimatePermissionFact(fact, modelIdRegistry),
  )
  return ultimatePermissions
}

export async function buildProjectPageFacts(
  project: string,
  configReader: ConfigReader,
  templateService: TemplateService,
  paths: DiscoveryPaths,
  debug: boolean,
): Promise<ClingoFact[]> {
  const clingo = generateClingoForProject(
    project,
    configReader,
    templateService,
  )
  const projectPageClingoFile = readProjectPageClingoFile(paths)
  const combinedClingo = clingo + '\n' + projectPageClingoFile
  const projectPath = configReader.getProjectPath(project)

  const inputFilePath = join(projectPath, 'clingo.input.lp')
  writeFileSync(inputFilePath, combinedClingo)

  const clingoResult = await runClingo(combinedClingo)
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

  const outputFilePath = join(projectPath, 'clingo.output.lp')
  writeFileSync(outputFilePath, facts.join('.\n'))

  const result = facts.map(parseClingoFact)

  if (!debug) {
    unlinkSync(inputFilePath)
    unlinkSync(outputFilePath)
  }
  return result
}

export function readProjectPageClingoFile(paths: DiscoveryPaths): string {
  const path = join(paths.discovery, '_clingo', 'modelPermissions.lp')
  return readFileSync(path, 'utf8')
}

export function generateClingoForProject(
  project: string,
  configReader: ConfigReader,
  templateService: TemplateService,
): string {
  const generatedClingo: string[] = []

  const chainConfigs = configReader
    .readAllChainsForProject(project)
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
  config: PermissionConfig,
  discovery: DiscoveryOutput,
  templateService: TemplateService,
) {
  const generatedClingo: string[] = []

  const addressToNameMap = buildAddressToNameMap(
    discovery.chain,
    discovery.entries,
  )

  discovery.entries.forEach((entry) => {
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

export function generateClingoFromPermissionsConfig(
  entry: EntryParameters,
  chain: string,
  config: PermissionConfig,
  templateService: TemplateService,
  addressToNameMap: Record<string, string>,
) {
  const permissionTemplate = entry.template
    ? templateService.loadContractPermissionTemplate(entry.template)
    : undefined
  const mergedPermissionsConfig = merge(
    {},
    permissionTemplate,
    config.overrides?.[entry.address.toString()],
  )

  return buildPermissionsModel(
    chain,
    mergedPermissionsConfig,
    entry,
    addressToNameMap,
  )
}

export function generateClingoFromModelLp(
  entry: EntryParameters,
  chain: string,
  templateService: TemplateService,
  addressToNameMap: Record<string, string>,
): string {
  const modelTemplate = entry.template
    ? templateService.loadClingoModelTemplate(entry.template)
    : undefined
  if (modelTemplate) {
    const values = contractValuesForInterpolation(chain, entry)
    const interpolated = interpolateModelTemplate(
      modelTemplate,
      values,
      addressToNameMap,
    )
    return interpolated
  }
  return ''
}

export function buildAddressToNameMap(
  chain: string,
  entries: EntryParameters[],
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const entity of entries) {
    const address = entity.address.toLowerCase()
    const suffix = `_${chain}_${address}`
    result[address] = (entity.name ?? 'eoa') + suffix
  }
  return result
}
