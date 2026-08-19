import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { mkdir, writeFile } from 'fs/promises'
import { posix } from 'path'
import { rimraf } from 'rimraf'
import type {
  AddressesWithTemplates,
  Analysis,
} from '../discovery/analysis/AddressAnalyzer'
import { TemplateService } from '../discovery/analysis/TemplateService'
import type { ConfigRegistry } from '../discovery/config/ConfigRegistry'
import type { DiscoveryPaths } from '../discovery/config/getDiscoveryPaths'
import { makeEntryStructureConfig } from '../discovery/config/structureUtils'
import { saveDiscoveredJson } from '../discovery/output/saveDiscoveryResult'
import { toDiscoveryOutput } from '../discovery/output/toDiscoveryOutput'
import type { DiscoveryOutput } from '../discovery/output/types'
import { SQLiteCache } from '../discovery/provider/SQLiteCache'
import { analyzeStarknetContract } from './analyzeStarknetContract'
import {
  StarknetDiscoveryProvider,
  type StarknetDiscoveryProviderOptions,
} from './StarknetDiscoveryProvider'

export interface StarknetDiscoveryResult {
  output: DiscoveryOutput
  projectPath: string
}

export interface StarknetDiscoveryPin {
  blockNumber: number
  timestamp: UnixTime
}

export async function discoverStarknet(
  config: ConfigRegistry,
  paths: DiscoveryPaths,
  http: HttpClient,
  logger: Logger,
  options: StarknetDiscoveryProviderOptions,
  /** Reuse a previous run's block and timestamp for byte-stable reruns */
  pin?: StarknetDiscoveryPin,
): Promise<StarknetDiscoveryResult> {
  const cache = new SQLiteCache(paths.cache)
  const provider = await StarknetDiscoveryProvider.create(
    http,
    cache,
    logger,
    options,
    pin?.blockNumber,
  )
  logger.info(
    `Starknet discovery of ${config.name} at block ${provider.blockNumber}`,
  )

  const structure = config.structure
  const maxDepth = structure.maxDepth ?? Number.POSITIVE_INFINITY
  const maxAddresses = structure.maxAddresses ?? 100
  const templateService = new TemplateService(paths.discovery)

  const analyses: Analysis[] = []
  const flatSources = new Map<string, string>()
  const visited = new Set<string>()
  let queue: AddressesWithTemplates = Object.fromEntries(
    structure.initialAddresses.map((a) => [a.toString(), new Set<string>()]),
  )
  let depth = 0

  while (Object.keys(queue).length > 0 && depth <= maxDepth) {
    const next: AddressesWithTemplates = {}
    for (const [addressString, suggestedTemplates] of Object.entries(queue)) {
      if (visited.has(addressString)) {
        continue
      }
      visited.add(addressString)
      if (visited.size > maxAddresses) {
        logger.warn(`Reached maxAddresses (${maxAddresses}), stopping`)
        queue = {}
        break
      }

      const address = ChainSpecificAddress(addressString)
      const contractConfig = makeEntryStructureConfig(structure, address)
      if (contractConfig.ignoreDiscovery) {
        continue
      }

      logger.info(`Analyzing ${addressString} (depth ${depth})`)
      const { analysis, flatSource } = await analyzeStarknetContract(
        provider,
        address,
        contractConfig,
        templateService,
        logger,
        suggestedTemplates.size > 0 ? suggestedTemplates : undefined,
      )
      analyses.push(analysis)
      if (flatSource !== undefined) {
        flatSources.set(addressString, flatSource)
      }

      if (analysis.type !== 'Reference') {
        for (const [relative, templates] of Object.entries(
          analysis.relatives,
        )) {
          if (visited.has(relative)) {
            continue
          }
          next[relative] ??= new Set()
          for (const template of templates) {
            next[relative].add(template)
          }
        }
      }
    }
    queue = next
    depth += 1
  }

  nameMultisigs(analyses)

  const output = toDiscoveryOutput(
    templateService,
    config,
    pin?.timestamp ?? UnixTime.now(),
    { starknet: provider.blockNumber },
    analyses,
  )

  const projectPath = posix.join(paths.discovery, config.name)
  await saveDiscoveredJson(output, projectPath)
  await saveFlatSources(projectPath, output, flatSources)
  logger.info(
    `Discovered ${output.entries.length} entries, saved to ${projectPath}`,
  )

  return { output, projectPath }
}

/**
 * Multisig accounts get stable EVM-style names ('Multisig 1', 'Multisig 2',
 * ...) so every UI surface shows the same identity. Numbered in address
 * order for determinism; config `names` and templates take precedence
 * during colorize.
 */
function nameMultisigs(analyses: Analysis[]): void {
  const multisigs = analyses
    .filter(
      (a): a is Analysis & { type: 'EOA' } =>
        a.type === 'EOA' && Array.isArray(a.values?.$signers),
    )
    .sort((a, b) => a.address.localeCompare(b.address))
  multisigs.forEach((analysis, i) => {
    analysis.name ??= `Multisig ${i + 1}`
  })
}

/**
 * One file per contract at .flat/<Name>.cairo - the single-file layout the
 * discovery UI expects for entries without $implementation values.
 */
async function saveFlatSources(
  projectPath: string,
  output: DiscoveryOutput,
  flatSources: Map<string, string>,
): Promise<void> {
  const flatPath = posix.join(projectPath, '.flat')
  await rimraf(flatPath)
  await mkdir(flatPath, { recursive: true })

  for (const entry of output.entries) {
    const flatSource = flatSources.get(entry.address.toString())
    if (entry.type !== 'Contract' || flatSource === undefined) {
      continue
    }
    const sameName = output.entries.filter(
      (e) => e.type !== 'Reference' && e.name === entry.name,
    )
    const fileName =
      sameName.length > 1
        ? `${entry.name}-${entry.address}.cairo`
        : `${entry.name}.cairo`
    await writeFile(posix.join(flatPath, fileName), flatSource)
  }
}
