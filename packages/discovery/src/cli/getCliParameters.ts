import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

export type CliParameters =
  | ServerCliParameters
  | DiscoverCliParameters
  | InvertCliParameters
  | HelpCliParameters
  | SingleDiscoveryCliParameters

export interface ServerCliParameters {
  mode: 'server'
}

export interface DiscoverCliParameters {
  mode: 'discover'
  project: string
  chain: ChainId
  dryRun: boolean
  dev: boolean
}

export interface InvertCliParameters {
  mode: 'invert'
  project: string
  chain: ChainId
  useMermaidMarkup: boolean
}
export interface SingleDiscoveryCliParameters {
  mode: 'single-discovery'
  address: EthereumAddress
  chain: ChainId
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

    if (remaining.includes('--dry-run')) {
      dryRun = true
      remaining.splice(remaining.indexOf('--dry-run'), 1)
    }

    if (remaining.includes('--dev')) {
      dev = true
      remaining.splice(remaining.indexOf('--dev'), 1)
    }

    if (remaining.length === 0) {
      return { mode: 'help', error: 'Not enough arguments' }
    } else if (remaining.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    } else {
      const result: DiscoverCliParameters = {
        mode: 'discover',
        chain: ChainId.fromName(remaining[0]),
        project: remaining[1],
        dryRun,
        dev,
      }
      return result
    }
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
    } else if (remaining.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    } else {
      const result: InvertCliParameters = {
        mode: 'invert',
        chain: ChainId.fromName(remaining[0]),
        project: remaining[1],
        useMermaidMarkup,
      }
      return result
    }
  }

  if (args[0] === 'single-discovery') {
    const remaining = args.slice(1)

    if (remaining.length === 0) {
      return { mode: 'help', error: 'Not enough arguments' }
    } else if (remaining.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    } else {
      const result: SingleDiscoveryCliParameters = {
        mode: 'single-discovery',
        chain: ChainId.fromName(remaining[0]),
        address: EthereumAddress(remaining[1]),
      }
      return result
    }
  }

  return { mode: 'help', error: `Unknown mode: ${args[0]}` }
}
