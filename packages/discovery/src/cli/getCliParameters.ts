import { assert } from '@l2beat/backend-tools'

import { chains } from '../config/chains'
import { EthereumAddress } from '../utils/EthereumAddress'

export type CliParameters =
  | ServerCliParameters
  | DiscoverCliParameters
  | InvertCliParameters
  | FlattenCliParameters
  | HelpCliParameters
  | SingleDiscoveryCliParameters

export interface ServerCliParameters {
  mode: 'server'
}

export interface DiscoverCliParameters {
  mode: 'discover'
  project: string
  chain: string
  dryRun: boolean
  dev: boolean
  sourcesFolder?: string
  discoveryFilename?: string
  blockNumber?: number
}

export interface InvertCliParameters {
  mode: 'invert'
  project: string
  chain: string
  useMermaidMarkup: boolean
}

export interface FlattenCliParameters {
  mode: 'flatten'
  path: string
  rootContractName: string
}

export interface SingleDiscoveryCliParameters {
  mode: 'single-discovery'
  address: EthereumAddress
  chain: string
}

export interface HelpCliParameters {
  mode: 'help'
  error?: string
}

export function getCliParameters(args = process.argv.slice(2)): CliParameters {
  if (args.includes('--help') || args.includes('-h')) {
    return { mode: 'help' }
  }

  if (args.length === 0) {
    return { mode: 'help', error: 'Not enough arguments' }
  }

  if (args[0] === 'server') {
    if (args.length !== 1) {
      return { mode: 'help', error: 'Too many arguments' }
    }
    return { mode: 'server' }
  }

  if (args[0] === 'discover') {
    const remaining = args.slice(1)

    let dryRun = false
    let dev = false
    let blockNumber: number | undefined
    let sourcesFolder: string | undefined
    let discoveryFilename: string | undefined

    if (remaining.includes('--dry-run')) {
      dryRun = true
      remaining.splice(remaining.indexOf('--dry-run'), 1)
    }

    if (remaining.includes('--dev')) {
      dev = true
      remaining.splice(remaining.indexOf('--dev'), 1)
    }

    const blockNumberArg = extractArgWithValue(remaining, '--block-number')
    if (blockNumberArg.found) {
      const blockNumberStr = blockNumberArg.value
      if (blockNumberStr === undefined) {
        return { mode: 'help', error: 'Please provide a valid block number' }
      }
      blockNumber = parseInt(blockNumberStr, 10)
      assert(
        blockNumber.toString() === blockNumberStr,
        `"${blockNumberStr}" is not a valid block number`,
      )
    }

    const sourcesFolderArg = extractArgWithValue(remaining, '--sources-folder')
    if (sourcesFolderArg.found) {
      sourcesFolder = sourcesFolderArg.value
    }

    const discoveryFilenameArg = extractArgWithValue(
      remaining,
      '--discovery-filename',
    )
    if (discoveryFilenameArg.found) {
      discoveryFilename = discoveryFilenameArg.value
    }

    if (remaining.length === 0) {
      return { mode: 'help', error: 'Not enough arguments' }
    }
    if (remaining.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    }

    const [chain, project] = remaining
    if (!chain || !project) {
      return getHelpCliParameter(
        'You need to provide arguments for both the chain name and the project',
      )
    }

    if (!isValidChain(chain)) {
      return createWrongChainNameHelpCli(chain)
    }

    const result: DiscoverCliParameters = {
      mode: 'discover',
      chain,
      project,
      dryRun,
      dev,
      sourcesFolder,
      discoveryFilename,
      blockNumber,
    }
    return result
  }

  if (args[0] === 'invert') {
    const remaining = args.slice(1)

    let useMermaidMarkup = false

    if (remaining.includes('--mermaid')) {
      useMermaidMarkup = true
      remaining.splice(remaining.indexOf('--mermaid'), 1)
    }

    if (remaining.length === 0) {
      return { mode: 'help', error: 'Not enough arguments' }
    }
    if (remaining.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    }

    const [chain, project] = remaining
    if (!chain || !project) {
      return getHelpCliParameter(
        'You need to provide arguments for both the chain name and the project',
      )
    }

    if (!isValidChain(chain)) {
      return createWrongChainNameHelpCli(chain)
    }

    const result: InvertCliParameters = {
      mode: 'invert',
      chain,
      project,
      useMermaidMarkup,
    }
    return result
  }

  if (args[0] === 'flatten') {
    const remaining = args.slice(1)

    if (remaining.length === 0) {
      return { mode: 'help', error: 'Not enough arguments' }
    }
    if (remaining.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    }

    const [path, rootContractName] = remaining
    if (!path || !rootContractName) {
      return getHelpCliParameter(
        'You need to provide arguments for both the path and the root contract name',
      )
    }

    const result: FlattenCliParameters = {
      mode: 'flatten',
      path,
      rootContractName,
    }
    return result
  }

  if (args[0] === 'single-discovery') {
    const remaining = args.slice(1)

    if (remaining.length === 0) {
      return { mode: 'help', error: 'Not enough arguments' }
    }
    if (remaining.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    }
    const [chain, address] = remaining
    if (!chain || !address) {
      return getHelpCliParameter(
        'You need to provide arguments for both the chain name and the address',
      )
    }

    if (!isValidChain(chain)) {
      return createWrongChainNameHelpCli(chain)
    }

    const result: SingleDiscoveryCliParameters = {
      mode: 'single-discovery',
      chain,
      address: EthereumAddress(address),
    }
    return result
  }

  const mode = args[0] ?? '<unknown mode>'

  return { mode: 'help', error: `Unknown mode: ${mode}` }
}

function extractArgWithValue(
  args: string[],
  argName: string,
): { found: false } | { found: true; value: string | undefined } {
  assert(argName.startsWith('--'), 'Argument name must start with "--"')
  const argIndex = args.findIndex((arg) => arg.startsWith(`${argName}=`))
  if (argIndex !== -1) {
    const value = args[argIndex]?.split('=')[1]
    args.splice(argIndex, 1)
    return { found: true, value }
  }
  return { found: false }
}

function isValidChain(chain: string): boolean {
  return chains.some((c) => c.name === chain)
}

function getHelpCliParameter(message: string): HelpCliParameters {
  return {
    mode: 'help',
    error: message,
  }
}

function createWrongChainNameHelpCli(chainName: string): HelpCliParameters {
  return getHelpCliParameter(
    `Argument provided ${chainName} could not be linked to any of the known chain names`,
  )
}
