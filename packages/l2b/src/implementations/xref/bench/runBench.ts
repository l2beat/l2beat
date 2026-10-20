import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  type ConfigReader,
  type DiscoveryPaths,
  getChainConfigs,
  type IProvider,
  SQLiteCache,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import {
  ChainSpecificAddress as Address,
  assert,
  type ChainSpecificAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join, sep } from 'path'
import { FlatWorkspace } from '../FlatWorkspace'
import {
  type CompiledSource,
  type Oracle,
  type OracleSite,
  oracleSites,
} from './oracle'
import { SolcAst } from './SolcAst'
import { type JudgedSite, judgeSites } from './score'
import { type ReferenceScore, scoreReferences } from './scoreReferences'
import { FlatCompileError, fetchSolcReleases, SolcCompilers } from './solc'

export interface BenchResult {
  project: string
  filesTotal: number
  filesUnique: number
  compileFailures: string[]
  judged: JudgedSite[]
  references: ReferenceScore
}

interface OracleCache {
  fingerprint: string
  filesTotal: number
  filesUnique: number
  compileFailures: string[]
  sites: OracleSite[]
}

// Bump when the oracle changes, so cached ground truth is rebuilt.
const ORACLE_VERSION = '15'

export async function runBench(
  configReader: ConfigReader,
  paths: DiscoveryPaths,
  project: string,
): Promise<BenchResult> {
  const workspace = FlatWorkspace.fromProject(configReader, project)
  const fingerprint = fingerprintOf(configReader, project, workspace)
  const cachePath = join(dirname(paths.cache), 'xref-oracle', `${project}.json`)
  let cache = readCache(cachePath, fingerprint)
  if (cache === undefined) {
    cache = await buildOracleCache(configReader, paths, project, workspace)
    cache.fingerprint = fingerprint
    mkdirSync(dirname(cachePath), { recursive: true })
    writeFileSync(cachePath, JSON.stringify(cache))
  }
  return {
    project,
    filesTotal: cache.filesTotal,
    filesUnique: cache.filesUnique,
    compileFailures: cache.compileFailures,
    judged: judgeSites(workspace, cache.sites),
    references: scoreReferences(workspace, cache.sites),
  }
}

async function buildOracleCache(
  configReader: ConfigReader,
  paths: DiscoveryPaths,
  project: string,
  workspace: FlatWorkspace,
): Promise<OracleCache> {
  const compileFailures: string[] = []
  const oracle = await createOracle(
    configReader,
    paths,
    project,
    workspace,
    (path) => compileFailures.push(path),
  )
  const projectFlats = join(configReader.getProjectPath(project), '.flat') + sep
  const seenTexts = new Set<string>()
  const work: { entry: (typeof workspace.entries)[number]; path: string }[] = []
  let filesTotal = 0
  for (const entry of workspace.entries) {
    for (const path of entry.sourcePaths) {
      if (!path.startsWith(projectFlats)) {
        continue
      }
      filesTotal++
      const text = workspace.source(path).text
      if (!seenTexts.has(text)) {
        seenTexts.add(text)
        work.push({ entry, path })
      }
    }
  }
  const sites: OracleSite[] = []
  for (const { entry, path } of work) {
    const source = await oracle.compiled(path)
    if (source !== undefined) {
      sites.push(...(await oracleSites(oracle, entry, source)))
    }
  }
  return {
    fingerprint: '',
    filesTotal,
    filesUnique: work.length,
    compileFailures,
    sites,
  }
}

async function createOracle(
  configReader: ConfigReader,
  paths: DiscoveryPaths,
  project: string,
  workspace: FlatWorkspace,
  onCompileFailure: (path: string) => void,
): Promise<Oracle> {
  const compilers = new SolcCompilers(
    join(dirname(paths.cache), 'soljson'),
    await fetchSolcReleases(),
  )
  const compiledByPath = new Map<string, Promise<CompiledSource | undefined>>()
  const compiled = (path: string) => {
    let result = compiledByPath.get(path)
    if (result === undefined) {
      const text = workspace.source(path).text
      result = compilers.compile(text).then(
        (output) => ({
          path,
          ast: new SolcAst(output.ast, text),
          storage: output.storage,
        }),
        (error) => {
          if (!(error instanceof FlatCompileError)) {
            throw error
          }
          onCompileFailure(path)
          return undefined
        },
      )
      compiledByPath.set(path, result)
    }
    return result
  }
  return {
    workspace,
    compiled,
    provider: createProviders(configReader, paths, project),
  }
}

// Reads happen at the blocks discovery used, so the oracle sees the same
// chain state that discovered.json and the flats describe.
function createProviders(
  configReader: ConfigReader,
  paths: DiscoveryPaths,
  project: string,
): (address: ChainSpecificAddress) => Promise<IProvider> {
  // An address is read at the block of the discovery that holds it; a module
  // can be discovered at another block than the project. Addresses no
  // discovery holds use the project's block for their chain.
  const byChainBlock = new Map<string, Snapshot>()
  const byAddress = new Map<ChainSpecificAddress, Snapshot>()
  for (const discovery of configReader.readDiscoveryWithReferences(project)) {
    for (const [chain, block] of Object.entries(discovery.usedBlockNumbers)) {
      if (!byChainBlock.has(chain)) {
        byChainBlock.set(chain, { block, timestamp: discovery.timestamp })
      }
    }
    for (const entry of discovery.entries) {
      const block = discovery.usedBlockNumbers[Address.longChain(entry.address)]
      if (entry.type !== 'Reference' && block !== undefined) {
        byAddress.set(entry.address, { block, timestamp: discovery.timestamp })
      }
    }
  }
  const allProviders = new AllProviders(
    getChainConfigs(),
    new HttpClient(),
    new SQLiteCache(paths.cache),
    Logger.SILENT,
  )
  const providers = new Map<string, Promise<IProvider>>()
  return (address) => {
    const chain = Address.longChain(address)
    const at = byAddress.get(address) ?? byChainBlock.get(chain)
    assert(at !== undefined, 'No discovered block for chain')
    const key = `${chain}:${at.block}`
    let provider = providers.get(key)
    if (provider === undefined) {
      provider = allProviders
        .get(chain, UnixTime(at.timestamp))
        .then((p) => p.switchBlock(at.block))
      providers.set(key, provider)
    }
    return provider
  }
}

interface Snapshot {
  block: number
  timestamp: number
}

function fingerprintOf(
  configReader: ConfigReader,
  project: string,
  workspace: FlatWorkspace,
): string {
  const hash = createHash('sha256')
  hash.update(ORACLE_VERSION)
  for (const discovery of configReader.readDiscoveryWithReferences(project)) {
    hash.update(JSON.stringify(discovery.entries))
    hash.update(
      JSON.stringify([discovery.usedBlockNumbers, discovery.timestamp]),
    )
  }
  for (const path of [...workspace.sourcePaths].sort()) {
    hash.update(path)
    hash.update(workspace.source(path).text)
  }
  return hash.digest('hex')
}

function readCache(path: string, fingerprint: string): OracleCache | undefined {
  if (!existsSync(path)) {
    return undefined
  }
  const cache = JSON.parse(readFileSync(path, 'utf-8')) as OracleCache
  return cache.fingerprint === fingerprint ? cache : undefined
}
