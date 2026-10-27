import { AuxdataStyle, splitAuxdata } from '@ethereum-sourcify/bytecode-utils'
import type { ICompilersLogger } from '@ethereum-sourcify/compilers'
import type {
  Libraries,
  SolidityJsonInput,
  SolidityOutput,
  SolidityOutputContract,
} from '@ethereum-sourcify/compilers-types'
import type { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  ConfigReader,
  type ContractSource,
  type DiscoveryCache,
  type DiscoveryPaths,
  flattenStartingFrom,
  get$Implementations,
  getChainConfigs,
  getDiscoveryPaths,
  SQLiteCache,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { execFile } from 'child_process'
import { command, number, option, restPositionals } from 'cmd-ts'
import { createHash } from 'crypto'
import { dirname, join } from 'path'
import {
  type CliLogger,
  createCliLogger,
} from '../implementations/common/CliLogger'
import { formatOpcodeDiff } from '../implementations/common/disassemble'
import { ChainSpecificAddressValue } from './types'

const statusTable: Record<VerificationResult['type'], string> = {
  success: chalk.bgGreen(' OK '),
  skip: chalk.bgYellow('SKIP'),
  failure: chalk.bgRed('FAIL'),
}

export const FlattenerValidator = command({
  name: 'flattener-validator',
  description:
    'Verifies that flattened source of discovered contracts compiles to equivalent bytecode',
  args: {
    concurrency: option({
      type: number,
      long: 'concurrency',
      short: 'j',
      description: 'Number of addresses to verify at the same time.',
      defaultValue: () => 4,
      defaultValueIsSerializable: true,
    }),
    filterAddresses: restPositionals({
      type: ChainSpecificAddressValue,
      displayName: 'filterAddresses',
      description: 'Addresses that will be checked',
    }),
  },
  handler: async ({ concurrency, filterAddresses }) => {
    assertPositiveInteger(concurrency, 'concurrency')

    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const { setCompilersLogger } = await import('@ethereum-sourcify/compilers')
    setCompilersLogger(getCompilersLogger(cli))
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const { allProviders, cache } = getProviders(paths, cli.toLogger('INFO'))

    const targets = selectTargets(configReader, filterAddresses)
    if (targets.length === 0) {
      cli.log('No contracts to verify')
      return
    }

    const total = targets.length
    const maxLength = Math.floor(Math.log10(total)) + 1
    const totalText = total.toString().padStart(maxLength)
    const runStartedAtMs = Date.now()
    let completed = 0
    let matching = 0
    let failed = 0
    let verificationTimeMsTotal = 0
    const failures: { address: ChainSpecificAddress; message: string }[] = []
    const runStatus = cli.status()
    const formatRunStatus = () =>
      `Status: completed=${completed.toString().padStart(maxLength)}/${totalText} ` +
      `matching=${matching.toString().padStart(maxLength)} ` +
      `failed=${failed.toString().padStart(maxLength)} ` +
      `avg=${formatDuration(verificationTimeMsTotal / completed)} ` +
      `elapsed=${formatDuration(Date.now() - runStartedAtMs)}`

    await mapWithConcurrency(targets, concurrency, async (target) => {
      const { address } = target
      const startedAtMs = Date.now()
      const status = await verifyTarget(allProviders, target, paths, cache)
      const verificationTimeMs = Date.now() - startedAtMs

      completed++
      verificationTimeMsTotal += verificationTimeMs
      matching += status.type === 'success' ? 1 : 0

      if (status.type === 'failure') {
        failed += 1
        failures.push({ address, message: status.message })
      }

      const progress = colorMap(
        `${completed.toString().padStart(maxLength)}`,
        completed / total,
      )

      const failureMessage =
        status.type === 'failure' ? `: ${status.message}` : ''
      runStatus.update(formatRunStatus())
      cli.log(
        `${progress}/${totalText}: ` +
          `${statusTable[status.type]} ${formatDuration(verificationTimeMs).padStart(6)} <- ${address}${failureMessage}`,
      )
    })
    runStatus.done(formatRunStatus())

    printFailures(failures)
    if (failures.length > 0) {
      process.exitCode = 1
    }
  },
})

function printFailures(
  failures: { address: ChainSpecificAddress; message: string }[],
): void {
  if (failures.length === 0) return

  const grouped = new Map<string, ChainSpecificAddress[]>()
  for (const { address, message } of failures) {
    const key = message.split('\n')[0] ?? message
    grouped.set(key, [...(grouped.get(key) ?? []), address])
  }

  console.log(`\n${chalk.bgRed('FAIL')} ${failures.length} contract(s) failed`)
  const sorted = [...grouped].sort((a, b) => b[1].length - a[1].length)
  for (const [message, addresses] of sorted) {
    console.log(
      `\n${chalk.yellow(`[${addresses.length}]`)} ${chalk.red(message)}`,
    )
    for (const a of addresses) console.log(`  - ${a}`)
  }
}

async function verifyTarget(
  allProviders: AllProviders,
  { address, timestamp }: Target,
  paths: DiscoveryPaths,
  cache: DiscoveryCache,
): Promise<VerificationResult> {
  try {
    const chain = ChainSpecificAddress.longChain(address)
    const provider = await allProviders.get(chain, timestamp)
    const [bytecode, source] = await Promise.all([
      provider.getBytecode(address),
      provider.getSource(address),
    ])

    if (!source.isVerified) return { type: 'skip' }
    if (source.solidityVersion.startsWith('vyper')) return { type: 'skip' }

    const flat = flattenSource(source)

    return await verifyBytecode(source, flat, bytecode, paths, cache)
  } catch (error) {
    return {
      type: 'failure',
      message: `Top level thrown an error\n${formatError(error)}`,
    }
  }
}

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`)
  }
}

function colorMap(toColor: string, value: number, multiplier = 1): string {
  if (value < 0.125 * multiplier) {
    return chalk.grey(toColor)
  }
  if (value < 0.25 * multiplier) {
    return chalk.red(toColor)
  }
  if (value < 0.375 * multiplier) {
    return chalk.redBright(toColor)
  }
  if (value < 0.5 * multiplier) {
    return chalk.magenta(toColor)
  }
  if (value < 0.625 * multiplier) {
    return chalk.magentaBright(toColor)
  }
  if (value < 0.75 * multiplier) {
    return chalk.yellow(toColor)
  }
  if (value < 0.875 * multiplier) {
    return chalk.yellowBright(toColor)
  }
  return chalk.greenBright(toColor)
}

function formatDuration(durationMs: number): string {
  if (durationMs < 1000) {
    return `${Math.round(durationMs)}ms`
  }

  return `${(durationMs / 1000).toFixed(1)}s`
}

const flats = new Map<string, { flat: string } | { error: unknown }>()

function flattenSource(source: ContractSource): string {
  const key = sha256(
    JSON.stringify([
      source.name,
      source.rootFile,
      source.files,
      source.remappings,
    ]),
  )
  let result = flats.get(key)
  if (result === undefined) {
    try {
      result = { flat: flattenSourceUncached(source) }
    } catch (error) {
      result = { error }
    }
    flats.set(key, result)
  }
  if ('error' in result) {
    throw result.error
  }
  return result.flat
}

function flattenSourceUncached(source: ContractSource): string {
  const input = Object.entries(source.files)
    .map(([fileName, content]) => ({
      path: fileName,
      content,
    }))
    .filter((e) => e.path.endsWith('.sol') || e.path === source.rootFile)
  const flat = flattenStartingFrom(
    source.name,
    source.rootFile,
    input,
    source.remappings,
    { includeAll: true },
  )

  return flat
}

function getProviders(paths: DiscoveryPaths, logger: Logger) {
  const http = new HttpClient()
  const chainConfigs = getChainConfigs()
  const cache = new SQLiteCache(paths.cache)

  return {
    cache,
    allProviders: new AllProviders(chainConfigs, http, cache, logger),
  }
}

const COMPILERS_LOG_LEVEL_WARN = 1

function getCompilersLogger(cli: CliLogger): ICompilersLogger {
  const logger: ICompilersLogger = {
    logLevel: COMPILERS_LOG_LEVEL_WARN,
    setLevel: (level) => {
      logger.logLevel = level
    },
    log: (level, message) => {
      if (level <= logger.logLevel) {
        cli.log(message)
      }
    },
  }
  return logger
}

interface Target {
  address: ChainSpecificAddress
  timestamp: UnixTime
}

function selectTargets(
  configReader: ConfigReader,
  filterAddresses: ChainSpecificAddress[],
): Target[] {
  const targets = getAllContractTargets(configReader)
  if (filterAddresses.length === 0) {
    return targets
  }
  const filter = new Set(filterAddresses)
  return targets.filter((t) => filter.has(t.address))
}

function getAllContractTargets(configReader: ConfigReader): Target[] {
  const timestamps = new Map<ChainSpecificAddress, UnixTime>()
  const projects = configReader.readAllDiscoveredProjects()
  for (const project of projects) {
    const discovery = configReader.readDiscovery(project)
    const contractAddresses = discovery.entries
      .filter((e) => e.type === 'Contract' && e.unverified === undefined)
      .flatMap((e) => {
        const result = []

        // NOTE(radomski): We don't verify minimal proxies as they don't have
        // source code and Etherscan returns the source code for
        // implementation when asking for source for this address, this in
        // turn creates false positives. Same with gnosis safe zodiac
        // modules. They are behind a small proxy which destroyes everything
        if (
          e.proxyType !== 'EIP1167 proxy' &&
          e.proxyType !== 'gnosis safe zodiac module'
        ) {
          result.push(e.address)
        }

        result.push(...get$Implementations(e.values))
        return result
      })

    for (const address of contractAddresses) {
      const timestamp = timestamps.get(address) ?? 0
      timestamps.set(
        address,
        UnixTime(Math.max(timestamp, discovery.timestamp)),
      )
    }
  }

  const ignoredChains = new Set(['kinto', 'zksync2', 'gateway'])
  return [...timestamps]
    .filter(([a]) => !ignoredChains.has(ChainSpecificAddress.longChain(a)))
    .map(([address, timestamp]) => ({ address, timestamp }))
}

type VerificationResult =
  | { type: 'success' }
  | { type: 'skip' }
  | { type: 'failure'; message: string }

const FLAT_SOURCE_PATH = 'Flat.sol'

async function verifyBytecode(
  source: ContractSource,
  flat: string,
  bytecode: Bytes,
  paths: DiscoveryPaths,
  cache: DiscoveryCache,
): Promise<VerificationResult> {
  try {
    const output = await compile(source, flat, paths, cache)
    const errors = output.errors?.filter((e) => e.severity === 'error') ?? []
    if (errors.length > 0) {
      return {
        type: 'failure',
        message: `Compilation failed\n${errors.map((e) => e.formattedMessage ?? e.message).join('\n')}`,
      }
    }
    const contract = output.contracts[FLAT_SOURCE_PATH]?.[source.name]
    if (contract === undefined) {
      return { type: 'failure', message: 'Root contract not found' }
    }

    return matchesRuntimeBytecode(contract, bytecode)
  } catch (error) {
    return {
      type: 'failure',
      message: `Compilation thrown an error\n${formatError(error)}`,
    }
  }
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

const compilations = new Map<string, Promise<SolidityOutput>>()

function compile(
  source: ContractSource,
  flat: string,
  paths: DiscoveryPaths,
  cache: DiscoveryCache,
): Promise<SolidityOutput> {
  const input = createCompilerInput(source, flat)
  const cacheKey = `solidity-compilation-${sha256(JSON.stringify([input, source.solidityVersion, source.name]))}`
  let compilation = compilations.get(cacheKey)
  if (compilation === undefined) {
    compilation = compileUncached(source, input, cacheKey, paths, cache)
    compilations.set(cacheKey, compilation)
  }
  return compilation
}

async function compileUncached(
  source: ContractSource,
  input: SolidityJsonInput,
  cacheKey: string,
  paths: DiscoveryPaths,
  cache: DiscoveryCache,
): Promise<SolidityOutput> {
  const entry = await cache.get(cacheKey)
  if (entry !== undefined) {
    try {
      return JSON.parse(entry) as SolidityOutput
    } catch {}
  }

  const output = await runSolc(paths, source.solidityVersion, input)
  const root = output.contracts?.[FLAT_SOURCE_PATH]?.[source.name]
  const trimmed: SolidityOutput = {
    contracts: root ? { [FLAT_SOURCE_PATH]: { [source.name]: root } } : {},
    sources: {},
    errors: output.errors,
  }
  await cache.set(cacheKey, JSON.stringify(trimmed))
  return trimmed
}

async function runSolc(
  paths: DiscoveryPaths,
  version: string,
  input: SolidityJsonInput,
): Promise<SolidityOutput> {
  const solcRepoPath = join(dirname(paths.cache), 'solc')
  if (process.platform === 'darwin' && process.arch === 'arm64') {
    const solcPath = await getMacSolcPath(solcRepoPath, version)
    if (solcPath !== undefined) {
      return runSolcBinary(solcPath, input)
    }
  }

  const { useSolidityCompiler } = await import('@ethereum-sourcify/compilers')
  try {
    return await useSolidityCompiler(
      solcRepoPath,
      join(dirname(paths.cache), 'soljson'),
      version,
      input,
      false,
    )
  } catch (error) {
    const errors = (error as { errors?: SolidityOutput['errors'] }).errors
    if (errors === undefined) {
      throw error
    }
    return { contracts: {}, sources: {}, errors }
  }
}

const macSolcPaths = new Map<string, Promise<string | undefined>>()

function getMacSolcPath(solcRepoPath: string, version: string) {
  const cached = macSolcPaths.get(version)
  if (cached !== undefined) {
    return cached
  }
  const solcPath = (async () => {
    const { getSolcExecutable } = await import('@ethereum-sourcify/compilers')
    try {
      const path = await getSolcExecutable(
        solcRepoPath,
        'macosx-amd64',
        version.startsWith('v') ? version.slice(1) : version,
      )
      return path ?? undefined
    } catch {
      return undefined
    }
  })()
  macSolcPaths.set(version, solcPath)
  return solcPath
}

const SOLC_TIMEOUT_MS = 60_000

function runSolcBinary(
  solcPath: string,
  input: SolidityJsonInput,
): Promise<SolidityOutput> {
  return new Promise((resolve, reject) => {
    const child = execFile(
      solcPath,
      ['--standard-json'],
      {
        maxBuffer: 1024 * 1024 * 1024,
        timeout: SOLC_TIMEOUT_MS,
        killSignal: 'SIGKILL',
      },
      (error, stdout) => {
        if (error?.killed) {
          resolve({
            contracts: {},
            sources: {},
            errors: [
              {
                type: 'Exception',
                component: 'general',
                severity: 'error',
                message: 'Compilation timed out',
              },
            ],
          })
          return
        }
        if (error) {
          reject(error)
          return
        }
        resolve(JSON.parse(stdout) as SolidityOutput)
      },
    )
    child.stdin?.end(JSON.stringify(input))
  })
}

type SolidityJsonSettings = SolidityJsonInput['settings']

function createCompilerInput(
  source: ContractSource,
  flat: string,
): SolidityJsonInput {
  return {
    language: 'Solidity',
    sources: { [FLAT_SOURCE_PATH]: { content: flat } },
    settings: {
      ...getCompilerSettings(source),
      remappings: source.remappings,
      libraries: getLibraries(source),
      outputSelection: {
        '*': {
          '*': [
            'evm.deployedBytecode.object',
            'evm.deployedBytecode.immutableReferences',
            'evm.deployedBytecode.linkReferences',
          ],
        },
      },
    },
  }
}

function getCompilerSettings(source: ContractSource): SolidityJsonSettings {
  const { evmVersion, ...settings } = source.compilerSettings ?? {}
  return {
    ...settings,
    evmVersion:
      evmVersion?.toLowerCase() === 'default' ? undefined : evmVersion,
  } as SolidityJsonSettings
}

function getLibraries(source: ContractSource): Libraries {
  const libraries: Libraries = {}
  const flatLibraries: Record<string, string> = {}

  for (const [name, address] of Object.entries(source.libraries)) {
    flatLibraries[name.split('/').at(-1) ?? name] = address.toString()
  }

  if (Object.keys(flatLibraries).length > 0) {
    libraries[FLAT_SOURCE_PATH] = flatLibraries
  }

  return libraries
}

function matchesRuntimeBytecode(
  contract: SolidityOutputContract,
  deployedBytecode: Bytes,
): VerificationResult {
  const compiledBytecode = contract.evm.deployedBytecode.object
  if (compiledBytecode.length === 0) {
    return { type: 'failure', message: 'Compiled bytecode is empty' }
  }

  const mismatch = getBytecodeMismatch(
    contract,
    deployedBytecode,
    Bytes.fromHex(`0x${zeroLinkPlaceholders(contract, compiledBytecode)}`),
  )

  if (mismatch) {
    const { want, got } = mismatch
    return {
      type: 'failure',
      message: `Bytecodes do not match | want ${want.length} bytes got ${got.length} bytes\n\n${formatOpcodeDiff(got, want)}\n\n`,
    }
  }

  return { type: 'success' }
}

type Transform = (contract: SolidityOutputContract, input: Bytes) => Bytes

function getBytecodeMismatch(
  contract: SolidityOutputContract,
  deployedBytecode: Bytes,
  compiledBytecode: Bytes,
): { got: Bytes; want: Bytes } | undefined {
  const transforms: Transform[] = [
    maskCallProtection,
    stripAuxdata,
    maskImmutableReferences,
    maskLinkReferences,
    maskSolidityAuxdata,
  ]

  let got = compiledBytecode
  let want = deployedBytecode

  for (const xform of transforms) {
    if (got.equals(want)) return
    got = xform(contract, got)
    want = xform(contract, want)
  }

  return got.equals(want) ? undefined : { got, want }
}

function maskCallProtection(_: SolidityOutputContract, bytecode: Bytes): Bytes {
  const push20 = Bytes.fromHex('0x73')
  if (!bytecode.slice(0, 1).equals(push20)) {
    return bytecode
  }
  const twentyZeroes = Bytes.fromHex('0x' + '00'.repeat(20))
  return push20.concat(twentyZeroes).concat(bytecode.slice(21, bytecode.length))
}

function stripAuxdata(_: SolidityOutputContract, bytecode: Bytes): Bytes {
  const [stripped] = splitAuxdata(bytecode.toString(), AuxdataStyle.SOLIDITY)
  return Bytes.fromHex(stripped)
}

// CBOR metadata prefixes per hash scheme: map(N) + key + bytes(N). The section
// ends with a 2-byte big-endian length equal to its own size — used as a
// checksum to confirm the match and determine how much to mask.
const CBOR_MARKERS: Buffer[] = [
  Buffer.from([0xa2, 0x64, 0x69, 0x70, 0x66, 0x73, 0x58, 0x22]), //       "ipfs"  + bytes(34)
  Buffer.from([0xa2, 0x65, 0x62, 0x7a, 0x7a, 0x72, 0x31, 0x58, 0x20]), // "bzzr1" + bytes(32)
  Buffer.from([0xa2, 0x65, 0x62, 0x7a, 0x7a, 0x72, 0x30, 0x58, 0x20]), // "bzzr0" + bytes(32)
  Buffer.from([0xa1, 0x65, 0x62, 0x7a, 0x7a, 0x72, 0x30, 0x58, 0x20]), // "bzzr0" + bytes(32), solc <0.5.9
]

function maskSolidityAuxdata(
  _: SolidityOutputContract,
  bytecode: Bytes,
): Bytes {
  const buf = bytecode.toBuffer()
  for (const marker of CBOR_MARKERS) {
    for (let i = 0; (i = buf.indexOf(marker, i)) !== -1; ) {
      const total = findCborTotalBytes(buf, i)
      if (total === undefined) {
        i++
        continue
      }
      buf.fill(0, i, i + total)
      i += total
    }
  }
  return Bytes.fromBuffer(buf)
}

function findCborTotalBytes(buf: Buffer, start: number): number | undefined {
  for (let len = 41; len <= 80; len++) {
    if (start + len + 2 > buf.length) return
    if (buf.readUInt16BE(start + len) === len) return len + 2
  }
}

function getLinkReferences(
  contract: SolidityOutputContract,
): { start: number; length: number }[] {
  const references = contract.evm.deployedBytecode.linkReferences ?? {}
  return Object.values(references).flatMap((libraries) =>
    Object.values(libraries).flat(),
  )
}

function zeroLinkPlaceholders(
  contract: SolidityOutputContract,
  hex: string,
): string {
  let result = hex
  for (const { start, length } of getLinkReferences(contract)) {
    result =
      result.slice(0, start * 2) +
      '00'.repeat(length) +
      result.slice((start + length) * 2)
  }
  return result
}

function maskLinkReferences(
  contract: SolidityOutputContract,
  bytecode: Bytes,
): Bytes {
  const hex = bytecode.toString().slice(2)
  return Bytes.fromHex(`0x${zeroLinkPlaceholders(contract, hex)}`)
}

function maskImmutableReferences(
  contract: SolidityOutputContract,
  bytecode: Bytes,
): Bytes {
  const references = contract.evm.deployedBytecode.immutableReferences ?? {}
  let result = bytecode
  for (const entries of Object.values(references ?? {})) {
    for (const entry of entries) {
      result = result
        .slice(0, entry.start)
        .concat(Bytes.fromByteArray(Array(entry.length).fill(0)))
        .concat(result.slice(entry.start + entry.length, result.length))
    }
  }

  return result
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0
  const workers = new Array(Math.min(limit, items.length))
    .fill(0)
    .map(async () => {
      while (true) {
        const idx = cursor++
        if (idx >= items.length) return
        results[idx] = await fn(items[idx], idx)
      }
    })
  await Promise.all(workers)
  return results
}
