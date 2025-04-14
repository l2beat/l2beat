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
import { buildAddressToNameMap } from './build'
import { parseClingoFact } from './clingoparser'
import { type ClingoFact, ClingoFactFile } from './factTypes'
import { interpolateModelTemplate } from './interpolate'
import { runClingo } from './projectPageFacts'
import {
  buildPermissionsModel,
  contractValuesForInterpolation,
} from './relations2'

export async function modelPermissions(
  project: string,
  configReader: ConfigReader,
  templateService: TemplateService,
  paths: DiscoveryPaths,
) {
  const facts = await buildProjectPageFacts(
    project,
    configReader,
    templateService,
    paths,
  )
  // TODO, why reparsing?
  const parsedFacts = ClingoFactFile.parse(JSON.parse(JSON.stringify(facts)))
  const kb = new KnowledgeBase(parsedFacts.facts)
  const modelIdRegistry = new ModelIdRegistry(kb)
  const transitivePermissionFacts = kb.getFacts('filteredTransitivePermission')
  const ultimatePermissions = transitivePermissionFacts.map((fact) =>
    parseTransitivePermissionFact(fact, modelIdRegistry),
  )
  return ultimatePermissions.filter((p) => p.isFinal)
}

export function parseTransitivePermissionFact(
  fact: ClingoFact,
  modelIdRegistry: ModelIdRegistry,
) {
  return {
    receiver: modelIdRegistry.idToChainPrefixedAddress(String(fact.params[0])),
    permission: String(fact.params[1]),
    giver: modelIdRegistry.idToChainPrefixedAddress(String(fact.params[2])),
    delay: Number(fact.params[3]),
    description: orUndefined(String, fact.params[4]),
    totalDelay: Number(fact.params[5]),
    viaList:
      fact.params[6] === undefined
        ? undefined
        : ((fact.params[6] as ClingoFact[]).map((x) =>
            parseTransitivePermissionVia(x, modelIdRegistry),
          ) ?? undefined),
    isFinal: fact.params[7] === 'isFinal',
  }
}

// type ParsedTransitivePermissionFact = ReturnType<
//   typeof parseTransitivePermissionFact
// >

// interface TransitivePermissionVia {
//   atom: 'tuple'
//   params: [string, string, number]
// }

// type ParsedTransitivePermissionVia = ReturnType<
//   typeof parseTransitivePermissionVia
// >

export function parseTransitivePermissionVia(
  via: ClingoFact,
  modelIdRegistry: ModelIdRegistry,
) {
  return {
    contract: modelIdRegistry.idToChainPrefixedAddress(String(via.params[0])),
    permission: String(via.params[1]),
    delay: Number(via.params[2]),
  }
}

export async function buildProjectPageFacts(
  project: string,
  configReader: ConfigReader,
  templateService: TemplateService,
  paths: DiscoveryPaths,
) {
  const clingo = generateClingoForProject(
    project,
    configReader,
    templateService,
  )
  const projectPageClingoFile = readProjectPageClingoFile(paths)
  const combinedClingo = clingo + '\n' + projectPageClingoFile
  const outputPath = configReader.getProjectPath(project)
  const debugFilePath = join(outputPath, 'facts.debug.lp')
  writeFileSync(debugFilePath, combinedClingo)
  const clingoResult = await runClingo(combinedClingo)
  if (clingoResult.Result === 'ERROR') {
    throw new Error(clingoResult.Error)
  }
  if (clingoResult.Models.Number !== 1) {
    throw new Error('Expected 1 model, got ' + clingoResult.Models.Number)
  }
  const facts = clingoResult.Call[0]?.Witnesses[0]?.Value
  if (!facts) {
    throw new Error('No facts found')
  }
  unlinkSync(debugFilePath)
  const parsed = { facts: facts.map(parseClingoFact) }
  return parsed
}

export function readProjectPageClingoFile(paths: DiscoveryPaths): string {
  const path = join(paths.discovery, '_clingo', 'forProjectPage.lp')
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

function orUndefined<V, C>(
  caster: (value: V) => C,
  value: V | undefined,
): C | undefined {
  return value === undefined ? undefined : caster(value)
}
