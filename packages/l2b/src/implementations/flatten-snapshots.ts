import type { Logger } from '@l2beat/backend-tools'
import {
  type ContractSource,
  type DiscoveryCache,
  flattenStartingFrom,
  getChainConfig,
  getDiscoveryPaths,
  type IProvider,
  SQLiteCache,
} from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { dirname, join, relative } from 'path'
import { getProvider } from './common/GetProvider'
import {
  compareBytecodes,
  stripMetadata,
  type VerificationResult,
} from './compareBytecode'
import { type CompilationOutput, compileFlattenedSource } from './solc'

const DEFAULT_PROJECTS = [
  'metis',
  'polygonzkevm',
  'cartesi-prt-honeypot-v2',
  'taiko',
  'scroll',
  'arbitrum',
  'base',
  'optimism',
  'ink',
  'starknet',
  'linea',
  'katana',
  'zksync2',
  'unichain',
  'bob',
  'abstract',
  'morph',
  'loopring',
] as const

const PROGRESS_INTERVAL = 25

type VerificationStatus =
  | 'verified'
  | 'verified-with-immutables'
  | 'mismatch'
  | 'unverified'
  | 'no-solidity-files'
  | 'no-compiler-settings'
  | 'compilation-error'
  | 'error'

const ALL_STATUSES: readonly VerificationStatus[] = [
  'verified',
  'verified-with-immutables',
  'mismatch',
  'unverified',
  'no-solidity-files',
  'no-compiler-settings',
  'compilation-error',
  'error',
] as const

interface ProjectAddress {
  projectName: string
  address: ChainSpecificAddress
}

interface DiscoveredEntry {
  type?: unknown
  address?: unknown
  values?: unknown
}

interface DiscoveredJson {
  entries?: unknown
}

interface RunSummary {
  processed: number
  statuses: Record<VerificationStatus, number>
}

interface SolidityFile {
  path: string
  content: string
}

export async function runFlattenSnapshots(
  logger: Logger,
  requestedProjects: string[],
  requestedAddress?: ChainSpecificAddress,
): Promise<void> {
  const paths = getDiscoveryPaths()
  const mismatchArtifactsDir = join(dirname(paths.cache), 'flatten-snapshots')
  const projectNames = getProjectNames(requestedProjects)
  const loadedAddresses = await loadProjectAddresses(
    paths.discovery,
    projectNames,
  )
  const addresses = filterProjectAddresses(loadedAddresses, requestedAddress)
  const providers = await createProviders(addresses)
  const projectTotals = countProjects(addresses)
  const cache = new SQLiteCache(paths.cache)
  await mkdir(mismatchArtifactsDir, { recursive: true })

  logRunHeader(logger, {
    projectNames,
    contractCount: addresses.length,
    chainCount: providers.size,
    cachePath: relative(paths.root, paths.cache),
    requestedAddress,
  })

  const globalSummary = createRunSummary()
  const perProject = new Map<string, RunSummary>()

  let currentProjectName: string | undefined

  for (const [index, item] of addresses.entries()) {
    if (currentProjectName !== item.projectName) {
      if (currentProjectName !== undefined) {
        const summary = perProject.get(currentProjectName)
        assert(summary !== undefined, 'Missing project summary')
        logProjectSummary(
          logger,
          currentProjectName,
          projectTotals.get(currentProjectName) ?? 0,
          summary,
        )
      }

      currentProjectName = item.projectName
      logger.info('')
      logProjectHeader(
        logger,
        item.projectName,
        projectTotals.get(item.projectName) ?? 0,
      )
    }

    const chain = ChainSpecificAddress.longChain(item.address)
    const provider = providers.get(chain)
    assert(provider !== undefined, `Missing provider for chain: ${chain}`)

    const result = await verifyContract(
      provider,
      item.address,
      mismatchArtifactsDir,
      cache,
    )
    const projectSummary = getOrCreateProjectSummary(
      perProject,
      item.projectName,
    )

    recordResult(globalSummary, result.status)
    recordResult(projectSummary, result.status)

    if (
      result.status !== 'verified' &&
      result.status !== 'verified-with-immutables'
    ) {
      logVerificationResult(logger, {
        item,
        totalContracts: addresses.length,
        contractIndex: index + 1,
        result,
      })
    } else if (projectSummary.processed % PROGRESS_INTERVAL === 0) {
      logger.info(
        chalk.dim(
          `  progress ${projectSummary.processed}/${projectTotals.get(item.projectName) ?? 0} | verified ${projectSummary.statuses.verified + projectSummary.statuses['verified-with-immutables']}`,
        ),
      )
    }
  }

  logger.info('')
  if (currentProjectName !== undefined) {
    const summary = perProject.get(currentProjectName)
    assert(summary !== undefined, 'Missing project summary')
    logProjectSummary(
      logger,
      currentProjectName,
      projectTotals.get(currentProjectName) ?? 0,
      summary,
    )
  }

  logger.info('')
  logGlobalSummary(logger, globalSummary)

  if (globalSummary.statuses.mismatch > 0) {
    throw new Error(
      `Detected ${globalSummary.statuses.mismatch} bytecode mismatch(es)`,
    )
  }
}

interface VerifyResult {
  status: VerificationStatus
  detail?: string
}

async function verifyContract(
  provider: IProvider,
  address: ChainSpecificAddress,
  mismatchArtifactsDir: string,
  cache: DiscoveryCache,
): Promise<VerifyResult> {
  let source: ContractSource
  try {
    source = await provider.getSource(address)
  } catch (error) {
    return { status: 'error', detail: stringifyError(error) }
  }

  if (!source.isVerified) {
    return { status: 'unverified' }
  }

  const solFiles: SolidityFile[] = Object.entries(source.files)
    .map(([path, content]) => ({ path, content }))
    .filter((file) => file.path.endsWith('.sol'))

  if (solFiles.length === 0) {
    return { status: 'no-solidity-files' }
  }

  if (!source.compilerSettings) {
    return { status: 'no-compiler-settings' }
  }

  let flattened: string
  try {
    flattened = flattenStartingFrom(source.name, solFiles, source.remappings, {
      includeAll: true,
    })
  } catch (error) {
    return { status: 'error', detail: `flatten: ${stringifyError(error)}` }
  }

  const cacheKey = `flat:${ChainSpecificAddress.longChain(address)}:${ChainSpecificAddress.address(address)}`
  const cached = await cache.get(cacheKey)
  if (cached === flattened) {
    return { status: 'verified' }
  }

  let compiled: CompilationOutput
  try {
    compiled = await compileFlattenedSource({
      flattenedSource: flattened,
      contractName: source.name,
      solidityVersion: source.solidityVersion,
      compilerSettings: source.compilerSettings,
      libraries: source.libraries,
    })
  } catch (error) {
    console.log(
      await writeCompilationErrorArtifacts(
        mismatchArtifactsDir,
        address,
        flattened,
      ),
    )
    return {
      status: 'compilation-error',
      detail: stringifyError(error),
    }
  }

  let deployedHex: string
  try {
    const bytecode = await provider.getBytecode(address)
    deployedHex = bytecode.toString()
  } catch (error) {
    return { status: 'error', detail: `getBytecode: ${stringifyError(error)}` }
  }

  let comparison: VerificationResult
  try {
    comparison = compareBytecodes(
      compiled.runtimeBytecode,
      deployedHex,
      compiled.immutableReferences,
    )
  } catch (error) {
    return { status: 'error', detail: `compare: ${stringifyError(error)}` }
  }

  switch (comparison.status) {
    case 'match':
      await cache.set(cacheKey, flattened)
      return { status: 'verified' }
    case 'match-with-immutables':
      await cache.set(cacheKey, flattened)
      return {
        status: 'verified-with-immutables',
        detail: `${comparison.immutableCount} immutable ref(s)`,
      }
    case 'mismatch': {
      const artifactPaths = await writeMismatchArtifacts(
        mismatchArtifactsDir,
        address,
        compiled.runtimeBytecode,
        deployedHex,
        flattened,
      )
      return {
        status: 'mismatch',
        detail: `${comparison.detail}\nartifacts: ${artifactPaths.flattenedPath}\nartifacts: ${artifactPaths.deployedPath}`,
      }
    }
  }
}

async function writeCompilationErrorArtifacts(
  mismatchArtifactsDir: string,
  address: ChainSpecificAddress,
  flattenedSource: string,
): Promise<string> {
  const baseName = getMismatchArtifactBaseName(address)
  const flattenedSourcePath = join(
    mismatchArtifactsDir,
    `${baseName}-flattened.sol`,
  )
  await Promise.all([writeFile(flattenedSourcePath, flattenedSource)])
  return flattenedSourcePath
}

async function writeMismatchArtifacts(
  mismatchArtifactsDir: string,
  address: ChainSpecificAddress,
  runtimeBytecode: string,
  deployedBytecode: string,
  flattenedSource: string,
): Promise<{ flattenedPath: string; deployedPath: string }> {
  const baseName = getMismatchArtifactBaseName(address)
  const flattenedBytecodePath = join(
    mismatchArtifactsDir,
    `${baseName}-flattened.bin`,
  )
  const deployedBytecodePath = join(
    mismatchArtifactsDir,
    `${baseName}-deployed.bin`,
  )
  const flattenedSourcePath = join(
    mismatchArtifactsDir,
    `${baseName}-flattened.sol`,
  )
  await Promise.all([
    writeFile(
      flattenedBytecodePath,
      hexToBytes(stripMetadata(runtimeBytecode)),
    ),
    writeFile(
      deployedBytecodePath,
      hexToBytes(stripMetadata(deployedBytecode)),
    ),
    writeFile(flattenedSourcePath, flattenedSource),
  ])
  return {
    flattenedPath: relative(process.cwd(), flattenedBytecodePath),
    deployedPath: relative(process.cwd(), deployedBytecodePath),
  }
}

function hexToBytes(hex: string): Uint8Array {
  hex = hex.replace(/^0x/, '')
  if (hex.length % 2 !== 0) hex = '0' + hex
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function getMismatchArtifactBaseName(address: ChainSpecificAddress): string {
  return `${ChainSpecificAddress.longChain(address)}-${ChainSpecificAddress.address(address)}`
}

function getProjectNames(requestedProjects: string[]): string[] {
  const projects =
    requestedProjects.length > 0 ? requestedProjects : [...DEFAULT_PROJECTS]
  return [...new Set(projects)]
}

function filterProjectAddresses(
  projectAddresses: ProjectAddress[],
  requestedAddress?: ChainSpecificAddress,
): ProjectAddress[] {
  if (requestedAddress === undefined) {
    return projectAddresses
  }

  const matches = projectAddresses.filter(
    (item) => item.address === requestedAddress,
  )
  assert(
    matches.length > 0,
    `Address not found in selected projects: ${requestedAddress}`,
  )
  return matches
}

async function loadProjectAddresses(
  discoveryRoot: string,
  projectNames: string[],
): Promise<ProjectAddress[]> {
  const result: ProjectAddress[] = []
  for (const projectName of projectNames) {
    const path = join(discoveryRoot, projectName, 'discovered.json')
    const fileContent = await readFile(path, 'utf8')
    const parsed = JSON.parse(fileContent) as DiscoveredJson
    assert(
      Array.isArray(parsed.entries),
      `Invalid discovered.json for ${projectName}`,
    )

    const seen = new Set<string>()
    for (const rawEntry of parsed.entries) {
      const entry = rawEntry as DiscoveredEntry
      if (entry.type !== 'Contract') {
        continue
      }
      for (const address of getEntryAddresses(entry, path)) {
        if (seen.has(address)) {
          continue
        }

        seen.add(address)
        result.push({
          projectName,
          address: ChainSpecificAddress(address),
        })
      }
    }
  }
  return result
}

function getEntryAddresses(entry: DiscoveredEntry, path: string): string[] {
  assert(typeof entry.address === 'string', `Missing address in ${path}`)

  const result = [entry.address]
  if (!isRecord(entry.values)) {
    return result
  }

  const implementationKeys = ['$implementation', 'implementation'] as const
  for (const key of implementationKeys) {
    const value = entry.values[key]
    if (typeof value === 'string') {
      result.push(value)
    }
  }

  return result
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

async function createProviders(
  addresses: ProjectAddress[],
): Promise<Map<string, IProvider>> {
  const chains = [
    ...new Set(addresses.map((x) => ChainSpecificAddress.longChain(x.address))),
  ]
  const providers = await Promise.all(
    chains.map(async (chainName) => {
      const chain = getChainConfig(chainName)
      const provider = await getProvider(
        chain.rpcUrl,
        chain.explorer,
        chainName,
      )
      return [chainName, provider] as const
    }),
  )
  return new Map(providers)
}

function stringifyError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return JSON.stringify(error)
}

function createRunSummary(): RunSummary {
  const statuses = Object.fromEntries(
    ALL_STATUSES.map((s) => [s, 0]),
  ) as Record<VerificationStatus, number>
  return { processed: 0, statuses }
}

function recordResult(summary: RunSummary, status: VerificationStatus): void {
  summary.processed += 1
  summary.statuses[status] += 1
}

function getOrCreateProjectSummary(
  summaries: Map<string, RunSummary>,
  projectName: string,
): RunSummary {
  const existing = summaries.get(projectName)
  if (existing !== undefined) {
    return existing
  }

  const created = createRunSummary()
  summaries.set(projectName, created)
  return created
}

function countProjects(addresses: ProjectAddress[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const item of addresses) {
    counts.set(item.projectName, (counts.get(item.projectName) ?? 0) + 1)
  }
  return counts
}

function logRunHeader(
  logger: Logger,
  options: {
    projectNames: string[]
    contractCount: number
    chainCount: number
    cachePath: string
    requestedAddress?: ChainSpecificAddress
  },
): void {
  logger.info(chalk.bold('Bytecode Verification'))
  logger.info(`  projects: ${chalk.cyan(options.projectNames.join(', '))}`)
  if (options.requestedAddress !== undefined) {
    logger.info(`  address: ${chalk.cyan(options.requestedAddress)}`)
  }
  logger.info(`  contracts: ${chalk.white(options.contractCount.toString())}`)
  logger.info(`  chains: ${chalk.white(options.chainCount.toString())}`)
  logger.info(`  cache: ${chalk.magenta(options.cachePath)}`)
}

function logProjectHeader(
  logger: Logger,
  projectName: string,
  contractCount: number,
): void {
  logger.info(chalk.bold(projectName))
  logger.info(chalk.dim(`  ${contractCount} contracts`))
}

function logProjectSummary(
  logger: Logger,
  projectName: string,
  contractCount: number,
  summary: RunSummary,
): void {
  const verified =
    summary.statuses.verified + summary.statuses['verified-with-immutables']
  logger.info(
    chalk.dim(
      `  summary ${projectName}: ${summary.processed}/${contractCount} | verified ${verified} | mismatch ${summary.statuses.mismatch} | errors ${summary.statuses.error + summary.statuses['compilation-error']}`,
    ),
  )
}

function logGlobalSummary(logger: Logger, summary: RunSummary): void {
  logger.info(chalk.bold('Overall Summary'))
  logger.info(
    `  verified: ${chalk.green(summary.statuses.verified.toString())}`,
  )
  logger.info(
    `  verified-with-immutables: ${chalk.green(summary.statuses['verified-with-immutables'].toString())}`,
  )
  logger.info(`  mismatch: ${formatErrorCount(summary.statuses.mismatch)}`)
  logger.info(
    `  unverified: ${chalk.yellow(summary.statuses.unverified.toString())}`,
  )
  logger.info(
    `  no-solidity-files: ${chalk.yellow(summary.statuses['no-solidity-files'].toString())}`,
  )
  logger.info(
    `  no-compiler-settings: ${chalk.yellow(summary.statuses['no-compiler-settings'].toString())}`,
  )
  logger.info(
    `  compilation-error: ${formatErrorCount(summary.statuses['compilation-error'])}`,
  )
  logger.info(`  error: ${formatErrorCount(summary.statuses.error)}`)
}

function formatErrorCount(count: number): string {
  if (count === 0) {
    return chalk.green('0')
  }
  return chalk.red(count.toString())
}

function logVerificationResult(
  logger: Logger,
  options: {
    item: ProjectAddress
    totalContracts: number
    contractIndex: number
    result: VerifyResult
  },
): void {
  const prefix = `[${options.contractIndex}/${options.totalContracts}]`
  const label = options.item.address
  const statusText = formatStatus(options.result.status)
  logger.info(`${chalk.bold(prefix)} ${statusText} ${label}`)

  if (options.result.detail !== undefined) {
    for (const line of options.result.detail.split('\n')) {
      logger.info(`  ${line}`)
    }
  }
}

function formatStatus(status: VerificationStatus): string {
  switch (status) {
    case 'verified':
      return chalk.green('VERIFIED')
    case 'verified-with-immutables':
      return chalk.green('VERIFIED (immutables)')
    case 'mismatch':
      return chalk.red('MISMATCH')
    case 'unverified':
      return chalk.yellow('UNVERIFIED')
    case 'no-solidity-files':
      return chalk.yellow('NO SOLIDITY')
    case 'no-compiler-settings':
      return chalk.yellow('NO SETTINGS')
    case 'compilation-error':
      return chalk.red('COMPILE ERROR')
    case 'error':
      return chalk.red('ERROR')
  }
}
