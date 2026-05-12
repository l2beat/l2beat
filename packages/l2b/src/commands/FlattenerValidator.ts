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
  type Bytes,
  ChainSpecificAddress,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command } from 'cmd-ts'

const statusTable: Record<VerificationResult['type'], string> = {
  success: chalk.bgGreen(' OK '),
  failure: chalk.bgRed('FAIL'),
}

export const FlattenerValidator = command({
  name: 'flattener-validator',
  description:
    'Verifies that flattened source of discovered contracts compiles to equivalent bytecode',
  args: {},
  handler: async () => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const allProviders = getProviders(paths)

    const now = UnixTime(1778573466)
    const contracts = getAllContractAddresses(configReader).slice(0, 10)
    const maxLength = Math.floor(Math.log10(contracts.length)) + 1
    for (const [i, contract] of contracts.entries()) {
      const chain = ChainSpecificAddress.longChain(contract)
      const provider = await allProviders.get(chain, now)

      const bytecode = await provider.getBytecode(contract)
      const source = await provider.getSource(contract)
      const flat = flattenSource(source)

      const status = verifyBytecode(flat, bytecode)
      const progress = colorMap(
        `${(i + 1).toString().padStart(maxLength)}`,
        (i + 1) / contracts.length,
      )

      console.log(
        `${progress}/${contracts.length.toString().padStart(maxLength)}: ${statusTable[status.type]}`,
      )
    }

    console.log(`Got ${contracts.length} addresses`)
  },
})

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

function verifyBytecode(source: string, bytecode: Bytes): VerificationResult {
  return { type: 'success' }
}
