import type {
  AnalyzerResultApiResponse,
  AnalyzersApiResponse,
} from '@l2beat/shared-pure'
import {
  boolean,
  command,
  flag,
  oneOf,
  option,
  optional,
  restPositionals,
} from 'cmd-ts'
import { AnalyzeClientError } from '../implementations/analyze/AnalyzeClient'
import {
  AnalyzeRunnerError,
  type AnalyzeRunnerResult,
  AnalyzeRunnerUnavailableError,
  listAnalyzersWithRunner,
  runAnalyzerWithRunner,
} from '../implementations/analyze/AnalyzeRunner'
import { AnalyzeSourceError } from '../implementations/analyze/loadFlatSources'

export const Analyze = command({
  name: 'analyze',
  description: 'Run a source-code analyzer against discovery flat sources.',
  args: {
    json: flag({
      type: boolean,
      long: 'json',
      description: 'Print the raw analyzer API response as JSON.',
    }),
    backend: option({
      type: optional(oneOf(['cli', 'api'] as const)),
      long: 'backend',
      description: 'Force the analyzer backend.',
    }),
    args: restPositionals({
      displayName: 'args',
      description: 'Use "list" or "<analyzer-id> <path-inside-.flat>".',
    }),
  },
  handler: async (args) => {
    const runnerPreference = args.backend ?? 'auto'

    try {
      if (isListCommand(args.args)) {
        const output = await listAnalyzersWithRunner(runnerPreference)
        printAnalyzers(output.result, args.json)
        finish(output)
        return
      }

      const commandArgs = parseRunArgs(args.args)
      if (commandArgs === undefined) {
        printUsageError()
        process.exitCode = 1
        return
      }

      const output = await runAnalyzerWithRunner(runnerPreference, commandArgs)
      const resultExitCode = printAnalyzerResult(output.result, args.json)
      finish(output, resultExitCode)
    } catch (error) {
      process.exitCode = handleAnalyzeError(error)
    }
  },
})

function isListCommand(args: string[]) {
  return args.length === 1 && (args[0] === 'list' || args[0] === 'analyzers')
}

function parseRunArgs(
  args: string[],
): { analyzerId: string; entrypointPath: string } | undefined {
  if (args.length !== 2) {
    return undefined
  }
  const [analyzerId, entrypointPath] = args
  if (analyzerId === undefined || entrypointPath === undefined) {
    return undefined
  }
  return { analyzerId, entrypointPath }
}

function finish<T>(output: AnalyzeRunnerResult<T>, exitCode?: number) {
  const finalExitCode =
    exitCode ??
    (output.exitStatus !== undefined && output.exitStatus !== 0
      ? output.exitStatus
      : undefined)

  if (finalExitCode !== undefined) {
    process.exitCode = finalExitCode
  }
  console.error(`Analyzer backend: ${output.runner}`)
}

function printAnalyzers(analyzers: AnalyzersApiResponse, asJson: boolean) {
  if (asJson) {
    console.log(JSON.stringify(analyzers, null, 2))
    return
  }

  if (analyzers.length === 0) {
    console.log('No analyzers available.')
    return
  }

  for (const analyzer of analyzers) {
    console.log(`${analyzer.id}  ${analyzer.title}  v${analyzer.version}`)
    if (analyzer.description) {
      console.log(`  ${analyzer.description}`)
    }
  }
}

function printAnalyzerResult(
  result: AnalyzerResultApiResponse,
  asJson: boolean,
): number | undefined {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2))
    if (result.status === 'error') {
      return 1
    }
    return
  }

  if (result.status === 'ok') {
    console.log(result.output.text)
    return
  }

  console.error(result.error.message)
  if (result.error.details) {
    console.error(JSON.stringify(result.error.details, null, 2))
  }
  return 1
}

function handleAnalyzeError(error: unknown): number {
  if (
    error instanceof AnalyzeClientError ||
    error instanceof AnalyzeSourceError ||
    error instanceof AnalyzeRunnerError ||
    error instanceof AnalyzeRunnerUnavailableError
  ) {
    console.error(error.message)
    return 1
  }

  throw error
}

function printUsageError() {
  console.error('Usage:')
  console.error('  l2b analyze [--backend cli|api] list')
  console.error(
    '  l2b analyze [--backend cli|api] <analyzer-id> <path-inside-.flat>',
  )
}
