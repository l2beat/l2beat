import { AuxdataStyle, splitAuxdata } from '@ethereum-sourcify/bytecode-utils'
import { useSolidityCompiler } from '@ethereum-sourcify/compilers'
import type {
  Libraries,
  SolidityJsonInput,
  SolidityOutput,
  SolidityOutputContract,
} from '@ethereum-sourcify/compilers-types'
import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  ConfigReader,
  type DiscoveryCache,
  type DiscoveryPaths,
  flattenStartingFrom,
  get$Implementations,
  getChainConfigs,
  getDiscoveryPaths,
  type IProvider,
  SQLiteCache,
} from '@l2beat/discovery'
import type { ContractSource } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { HttpClient } from '@l2beat/shared'
import {
  Bytes,
  ChainSpecificAddress,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, number, option, restPositionals } from 'cmd-ts'
import { createHash } from 'crypto'
import intersection from 'lodash/intersection'
import { dirname, join } from 'path'
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

    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const { allProviders, cache } = getProviders(paths)

    const now = UnixTime(1778573466)
    let addresses = getAllContractAddresses(configReader)
    if (filterAddresses.length > 0) {
      addresses = intersection(addresses, filterAddresses)
    }
    if (addresses.length === 0) {
      console.log('No contracts to verify')
      return
    }

    const total = addresses.length
    const maxLength = Math.floor(Math.log10(total)) + 1
    const totalText = total.toString().padStart(maxLength)
    const runStartedAtMs = Date.now()
    let completed = 0
    let matching = 0
    let failed = 0
    let verificationTimeMsTotal = 0
    const failures: { address: ChainSpecificAddress; message: string }[] = []

    await mapWithConcurrency(addresses, concurrency, async (address) => {
      const chain = ChainSpecificAddress.longChain(address)
      const provider = await allProviders.get(chain, now)

      const startedAtMs = Date.now()
      const status = await verifyAddress(provider, address, paths, cache)
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

      const cursorControl = completed === 1 ? '' : '\x1b[1A\r\x1b[K'
      const failureMessage =
        status.type === 'failure' ? `: ${status.message}` : ''
      console.log(
        `${cursorControl}${progress}/${totalText}: ` +
          `${statusTable[status.type]} ${formatDuration(verificationTimeMs).padStart(6)} <- ${address}${failureMessage}`,
      )
      console.log(
        `Status: completed=${completed.toString().padStart(maxLength)}/${totalText} ` +
          `matching=${matching.toString().padStart(maxLength)} ` +
          `failed=${failed.toString().padStart(maxLength)} ` +
          `avg=${formatDuration(verificationTimeMsTotal / completed)} ` +
          `elapsed=${formatDuration(Date.now() - runStartedAtMs)}`,
      )
    })

    printFailures(failures)
    if (failures.length > 0) {
      throw new Error(`${failures.length} contract(s) failed validation`)
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

async function verifyAddress(
  provider: IProvider,
  address: ChainSpecificAddress,
  paths: DiscoveryPaths,
  cache: DiscoveryCache,
): Promise<VerificationResult> {
  try {
    const [bytecode, source] = await Promise.all([
      provider.getBytecode(address),
      provider.getSource(address),
    ])

    if (!source.isVerified) return { type: 'skip' }

    const flat = flattenSource(source)

    return await verifyBytecode(source, flat, bytecode, paths, cache)
  } catch {
    return { type: 'failure', message: 'Top level thrown an error' }
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

function flattenSource(source: ContractSource): string {
  const input = Object.entries(source.files)
    .map(([fileName, content]) => ({
      path: fileName,
      content,
    }))
    .filter((e) => e.path.endsWith('.sol'))
  const flat = flattenStartingFrom(
    source.name,
    source.rootFile,
    input,
    source.remappings,
    { includeAll: true },
  )

  return flat
}

function getProviders(paths: DiscoveryPaths) {
  const http = new HttpClient()
  const chainConfigs = getChainConfigs()
  const cache = new SQLiteCache(paths.cache)
  const logger = Logger.INFO

  return {
    cache,
    allProviders: new AllProviders(chainConfigs, http, cache, logger),
  }
}

function getAllContractAddresses(
  configReader: ConfigReader,
): ChainSpecificAddress[] {
  const result: ChainSpecificAddress[] = []
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

    result.push(...contractAddresses)
  }

  const ignoredChains = new Set(['kinto', 'zksync2', 'gateway'])
  return unique(result).filter(
    (a) => !ignoredChains.has(ChainSpecificAddress.longChain(a)),
  )
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
    const contract = output.contracts[FLAT_SOURCE_PATH]?.[source.name]
    if (contract === undefined) {
      return { type: 'failure', message: 'Root contract not found' }
    }

    return matchesRuntimeBytecode(contract, bytecode)
  } catch {
    return { type: 'failure', message: 'An errow was thrown' }
  }
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

async function compile(
  source: ContractSource,
  flat: string,
  paths: DiscoveryPaths,
  cache: DiscoveryCache,
) {
  const input = createCompilerInput(source, flat)
  const cacheKey = `solidity-compilation-${sha256(JSON.stringify([input, source.solidityVersion]))}`
  const entry = await cache.get(cacheKey)
  if (entry !== undefined) {
    try {
      return JSON.parse(entry) as SolidityOutput
    } catch {}
  }

  const output = await useSolidityCompiler(
    join(dirname(paths.cache), 'solc'),
    join(dirname(paths.cache), 'soljson'),
    source.solidityVersion,
    input,
    false,
  )

  await cache.set(cacheKey, JSON.stringify(output))

  return output
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
      outputSelection: { '*': { '*': ['evm.deployedBytecode'] } },
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
    Bytes.fromHex(`0x${compiledBytecode}`),
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

// CBOR metadata prefixes per hash scheme: map(2) + key + bytes(N). The section
// ends with a 2-byte big-endian length equal to its own size — used as a
// checksum to confirm the match and determine how much to mask.
const CBOR_MARKERS: Buffer[] = [
  Buffer.from([0xa2, 0x64, 0x69, 0x70, 0x66, 0x73, 0x58, 0x22]), //       "ipfs"  + bytes(34)
  Buffer.from([0xa2, 0x65, 0x62, 0x7a, 0x7a, 0x72, 0x31, 0x58, 0x20]), // "bzzr1" + bytes(32)
  Buffer.from([0xa2, 0x65, 0x62, 0x7a, 0x7a, 0x72, 0x30, 0x58, 0x20]), // "bzzr0" + bytes(32)
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
  for (let len = 50; len <= 80; len++) {
    if (start + len + 2 > buf.length) return
    if (buf.readUInt16BE(start + len) === len) return len + 2
  }
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
