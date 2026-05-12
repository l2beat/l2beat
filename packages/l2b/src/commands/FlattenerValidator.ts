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
import { command, number, option } from 'cmd-ts'
import { dirname, join } from 'path'

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
  },
  handler: async ({ concurrency }) => {
    assertPositiveInteger(concurrency, 'concurrency')

    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const allProviders = getProviders(paths)

    const now = UnixTime(1778573466)
    const contracts = getAllContractAddresses(configReader)
    const maxLength = Math.floor(Math.log10(contracts.length)) + 1
    let completed = 0

    await mapWithConcurrency(contracts, concurrency, async (contract) => {
      const chain = ChainSpecificAddress.longChain(contract)
      const provider = await allProviders.get(chain, now)

      const bytecode = await provider.getBytecode(contract)
      const source = await provider.getSource(contract)
      const flat = flattenSource(source)

      const status = await verifyBytecode(source, flat, bytecode, paths)
      const done = ++completed
      const progress = colorMap(
        `${done.toString().padStart(maxLength)}`,
        done / contracts.length,
      )

      console.log(
        `${progress}/${contracts.length.toString().padStart(maxLength)}: ${statusTable[status.type]} <- ${contract}`,
      )
    })

    console.log(`Got ${contracts.length} addresses`)
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
      .flatMap((e) => [e.address, ...get$Implementations(e.values)])

    result.push(...contractAddresses)
  }

  return unique(result)
}

type VerificationResult = { type: 'success' } | { type: 'failure' }

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
      true,
    )

    const contract = output.contracts[FLAT_SOURCE_PATH]?.[source.name]
    if (contract === undefined) {
      console.log('Failed to find contract', source.name)
      return { type: 'failure' }
    }

    if (matchesRuntimeBytecode(contract, bytecode)) {
      return { type: 'success' }
    }
  } catch {
    console.log('Failure error', source.name)
    return { type: 'failure' }
  }

  console.log('Failure not matching bytecode', source.name)
  return { type: 'failure' }
}

function createCompilerInput(
  source: ContractSource,
  flat: string,
): SolidityJsonInput {
  return {
    language: 'Solidity',
    sources: {
      [FLAT_SOURCE_PATH]: {
        content: flat,
      },
    },
    settings: {
      ...source.compilerSettings,
      remappings: source.remappings,
      libraries: getLibraries(source),
      outputSelection: {
        '*': {
          '*': ['evm.deployedBytecode'],
        },
      },
    },
  }
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
): boolean {
  const compiledBytecode = contract.evm.deployedBytecode.object
  if (compiledBytecode.length === 0) {
    return false
  }

  const normalizedCompiled = stripAuxdata(
    Bytes.fromHex(`0x${compiledBytecode}`),
  )
  const normalizedDeployed = stripAuxdata(deployedBytecode)

  return maskImmutableReferences(
    normalizedCompiled,
    contract.evm.deployedBytecode.immutableReferences ?? {},
  ).equals(
    maskImmutableReferences(
      normalizedDeployed,
      contract.evm.deployedBytecode.immutableReferences ?? {},
    ),
  )
}

function stripAuxdata(bytecode: Bytes): Bytes {
  return Bytes.fromHex(
    splitAuxdata(bytecode.toString(), AuxdataStyle.SOLIDITY)[0],
  )
}

function maskImmutableReferences(
  bytecode: Bytes,
  references: SolidityOutputContract['evm']['deployedBytecode']['immutableReferences'],
): Bytes {
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
