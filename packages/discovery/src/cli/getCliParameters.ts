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
  dryRun: boolean
  dev: boolean
}

export interface InvertCliParameters {
  mode: 'invert'
  file: string
  useMermaidMarkup: boolean
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
    } else if (remaining.length > 1) {
      return { mode: 'help', error: 'Too many arguments' }
    } else {
      const result: DiscoverCliParameters = {
        mode: 'discover',
        project: remaining[0],
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
    } else if (remaining.length > 1) {
      return { mode: 'help', error: 'Too many arguments' }
    } else {
      const result: InvertCliParameters = {
        mode: 'invert',
        file: remaining[0],
        useMermaidMarkup,
      }
      return result
    }
  }

  return { mode: 'help', error: `Unknown mode: ${args[0]}` }
}
