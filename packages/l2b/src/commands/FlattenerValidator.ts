import { AuxdataStyle, splitAuxdata } from '@ethereum-sourcify/bytecode-utils'
import { useSolidityCompiler } from '@ethereum-sourcify/compilers'
import type {
  Libraries,
  SolidityJsonInput,
  SolidityOutputContract,
} from '@ethereum-sourcify/compilers-types'
import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  ConfigReader,
  type DiscoveryPaths,
  flattenStartingFrom,
  get$Implementations,
  getChainConfigs,
  getDiscoveryPaths,
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
import intersection from 'lodash/intersection'
import { dirname, join } from 'path'
import { formatOpcodeDiff } from '../implementations/common/disassemble'
import { ChainSpecificAddressValue } from './types'

const statusTable: Record<VerificationResult['type'], string> = {
  success: chalk.bgGreen(' OK '),
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
    const allProviders = getProviders(paths)

    const now = UnixTime(1778573466)
    let contracts = getAllContractAddresses(configReader)
    if (filterAddresses.length > 0) {
      contracts = intersection(contracts, filterAddresses)
    }
    if (contracts.length === 0) {
      console.log('No contracts to verify')
      return
    }

    const total = contracts.length
    const maxLength = Math.floor(Math.log10(total)) + 1
    const totalText = total.toString().padStart(maxLength)
    const runStartedAtMs = Date.now()
    let completed = 0
    let matching = 0
    let verificationTimeMsTotal = 0

    await mapWithConcurrency(contracts, concurrency, async (contract) => {
      const chain = ChainSpecificAddress.longChain(contract)
      const provider = await allProviders.get(chain, now)

      const bytecode = await provider.getBytecode(contract)
      const source = await provider.getSource(contract)
      const flat = flattenSource(source)

      const startedAtMs = Date.now()
      const status = await verifyBytecode(source, flat, bytecode, paths)
      const verificationTimeMs = Date.now() - startedAtMs

      completed++
      verificationTimeMsTotal += verificationTimeMs
      matching += status.type === 'success' ? 1 : 0

      const failed = completed - matching
      const progress = colorMap(
        `${completed.toString().padStart(maxLength)}`,
        completed / total,
      )

      const cursorControl = completed === 1 ? '' : '\x1b[1A\r\x1b[K'
      const failureMessage =
        status.type === 'failure' ? `: ${status.message}` : ''
      console.log(
        `${cursorControl}${progress}/${totalText}: ` +
          `${statusTable[status.type]} ${formatDuration(verificationTimeMs).padStart(6)} <- ${contract}${failureMessage}`,
      )
      console.log(
        `Status: completed=${completed.toString().padStart(maxLength)}/${totalText} ` +
          `matching=${matching.toString().padStart(maxLength)} ` +
          `failed=${failed.toString().padStart(maxLength)} ` +
          `avg=${formatDuration(verificationTimeMsTotal / completed)} ` +
          `elapsed=${formatDuration(Date.now() - runStartedAtMs)}`,
      )
    })
  },
})

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

  return new AllProviders(chainConfigs, http, cache, logger)
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

  return unique(result)
}

type VerificationResult =
  | { type: 'success' }
  | { type: 'failure'; message: string }

const FLAT_SOURCE_PATH = 'Flat.sol'

async function verifyBytecode(
  source: ContractSource,
  flat: string,
  bytecode: Bytes,
  paths: DiscoveryPaths,
): Promise<VerificationResult> {
  try {
    const input = createCompilerInput(source, flat)
    const output = await useSolidityCompiler(
      join(dirname(paths.cache), 'solc'),
      join(dirname(paths.cache), 'soljson'),
      source.solidityVersion,
      input,
      false,
    )

    const contract = output.contracts[FLAT_SOURCE_PATH]?.[source.name]
    if (contract === undefined) {
      return { type: 'failure', message: 'Root contract not found' }
    }

    return matchesRuntimeBytecode(contract, bytecode)
  } catch {
    return { type: 'failure', message: 'An errow was thrown' }
  }
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
    evmVersion: evmVersion === 'Default' ? undefined : evmVersion,
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

function maskSolidityAuxdata(
  _: SolidityOutputContract,
  bytecode: Bytes,
): Bytes {
  let result = bytecode.toString()

  while (true) {
    try {
      const [stripped, style] = splitAuxdata(result, AuxdataStyle.SOLIDITY)
      if (style === undefined) {
        return Bytes.fromHex(result)
      }
      result = stripped
    } catch {
      return Bytes.fromHex(result)
    }
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
