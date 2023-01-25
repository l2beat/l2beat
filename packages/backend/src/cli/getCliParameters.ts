export type CliParameters =
  | ServerCliParameters
  | DiscoverCliParameters
  | DiscoveryFindChangeCliParameters
  | HelpCliParameters

export interface ServerCliParameters {
  mode: 'server'
}

export interface DiscoverCliParameters {
  mode: 'discover'
  project: string
}

export interface DiscoveryFindChangeCliParameters {
  mode: 'findChange'
  project: string
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
    console.log(args)
    if (args.length === 1) {
      return { mode: 'help', error: 'Not enough arguments' }
    } else if (args.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    }
    return { mode: 'discover', project: args[1] }
  }

  if (args[0] === 'findChange') {
    if (args.length === 1) {
      return { mode: 'help', error: 'Not enough arguments' }
    } else if (args.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    }
    return { mode: 'findChange', project: args[1] }
  }

  return { mode: 'help', error: `Unknown mode: ${args[0]}` }
}
