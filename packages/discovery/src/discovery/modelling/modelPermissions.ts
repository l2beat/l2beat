import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import { EthereumAddress } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import type { TemplateService } from '../analysis/TemplateService'
import type { ConfigReader } from '../config/ConfigReader'
import type { PermissionConfig } from '../config/PermissionConfig'
import type { Permission } from '../config/StructureConfig'
import type { DiscoveryPaths } from '../config/getDiscoveryPaths'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { KnowledgeBase } from './KnowledgeBase'
import { ModelIdRegistry } from './ModelIdRegistry'
import { type ClingoFact, parseClingoFact } from './clingoparser'
import { interpolateModelTemplate } from './interpolate'
import { runClingo } from './projectPageFacts'
import {
  buildPermissionsModel,
  contractValuesForInterpolation,
} from './relations'

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
    parseTransitivePermissionFact(fact, modelIdRegistry),
  )
  return ultimatePermissions
}

export function parseTransitivePermissionFact(
  fact: ClingoFact,
  modelIdRegistry: ModelIdRegistry,
) {
  const delay = Number(fact.params[3])
  // const totalDelay = Number(fact.params[6])
  const receiverData = modelIdRegistry.getAddressData(String(fact.params[0]))
  return {
    receiver: modelIdRegistry.idToChainPrefixedAddress(String(fact.params[0])),
    receiverChain: receiverData.chain,
    permission: String(fact.params[1]) as Permission,
    from: EthereumAddress(
      modelIdRegistry.idToChainPrefixedAddress(String(fact.params[2])),
    ),
    delay: delay === 0 ? undefined : delay,
    description: orUndefined(String, fact.params[4]),
    condition: orUndefined(String, fact.params[5]),
    // totalDelay: totalDelay === 0 ? undefined : totalDelay,
    via:
      fact.params[7] === undefined
        ? undefined
        : ((fact.params[7] as ClingoFact[]).map((x) =>
            parseTransitivePermissionVia(x, modelIdRegistry),
          ) ?? undefined),
    isFinal: fact.params[8] === 'isFinal',
  }
}

export type ParsedTransitivePermissionFact = ReturnType<
  typeof parseTransitivePermissionFact
>

export function parseTransitivePermissionVia(
  via: ClingoFact,
  modelIdRegistry: ModelIdRegistry,
) {
  const delay = Number(via.params[2])
  return {
    address: EthereumAddress(
      modelIdRegistry.idToChainPrefixedAddress(String(via.params[0])),
    ),
    // permission: String(via.params[1]),
    delay: delay === 0 ? undefined : delay,
    condition: orUndefined(String, via.params[3]),
  }
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
