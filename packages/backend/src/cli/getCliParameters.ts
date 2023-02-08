export type CliParameters =
  | ServerCliParameters
  | DiscoverCliParameters
  | InvertCliParameters
  | HelpCliParameters

export interface ServerCliParameters {
  mode: 'server'
}

export interface DiscoverCliParameters {
  mode: 'discover'
  project: string
}

export interface InvertCliParameters {
  mode: 'invert'
  file: string
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
    if (args.length === 1) {
      return { mode: 'help', error: 'Not enough arguments' }
    } else if (args.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    }
    return { mode: 'discover', project: args[1] }
  }

  if (args[0] === 'invert') {
    if (args.length === 1) {
      return { mode: 'help', error: 'Not enough arguments' }
    } else if (args.length > 2) {
      return { mode: 'help', error: 'Too many arguments' }
    }

    return { mode: 'invert', file: args[1] }
  }

  return { mode: 'help', error: `Unknown mode: ${args[0]}` }
}
