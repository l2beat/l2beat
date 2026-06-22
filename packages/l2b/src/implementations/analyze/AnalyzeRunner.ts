import {
  AnalyzerResultApiResponse,
  AnalyzersApiResponse,
} from '@l2beat/shared-pure'
import { spawnSync } from 'child_process'
import { AnalyzeClient } from './AnalyzeClient'
import {
  loadFlatEntrypointSourceInput,
  resolveFlatEntrypointSource,
} from './loadFlatSources'

export type AnalyzeRunnerName = 'cli' | 'api'
export type AnalyzeRunnerPreference = 'auto' | 'cli' | 'api'

export interface AnalyzeRunInput {
  analyzerId: string
  entrypointPath: string
}

export interface AnalyzeRunnerOutput<T> {
  result: T
  exitStatus?: number
}

export interface AnalyzeRunnerResult<T> extends AnalyzeRunnerOutput<T> {
  runner: AnalyzeRunnerName
}

export interface AnalyzeRunner {
  name: AnalyzeRunnerName
  listAnalyzers(): Promise<AnalyzeRunnerOutput<AnalyzersApiResponse>>
  runAnalyzer(
    input: AnalyzeRunInput,
  ): Promise<AnalyzeRunnerOutput<AnalyzerResultApiResponse>>
}

export class AnalyzeRunnerUnavailableError extends Error {}

export class AnalyzeRunnerError extends Error {}

export async function listAnalyzersWithRunner(
  preference: AnalyzeRunnerPreference,
): Promise<AnalyzeRunnerResult<AnalyzersApiResponse>> {
  return await runWithSelectedRunner(preference, (runner) =>
    runner.listAnalyzers(),
  )
}

export async function runAnalyzerWithRunner(
  preference: AnalyzeRunnerPreference,
  input: AnalyzeRunInput,
): Promise<AnalyzeRunnerResult<AnalyzerResultApiResponse>> {
  return await runWithSelectedRunner(preference, (runner) =>
    runner.runAnalyzer(input),
  )
}

export async function runWithSelectedRunner<T>(
  preference: AnalyzeRunnerPreference,
  action: (runner: AnalyzeRunner) => Promise<AnalyzeRunnerOutput<T>>,
  runners: {
    cli: AnalyzeRunner
    api: AnalyzeRunner
  } = {
    cli: new L2AnalyzeCliRunner(),
    api: new AnalyzeApiRunner(),
  },
): Promise<AnalyzeRunnerResult<T>> {
  if (preference === 'api') {
    return addRunnerName(runners.api, await action(runners.api))
  }

  try {
    return addRunnerName(runners.cli, await action(runners.cli))
  } catch (error) {
    if (
      preference === 'auto' &&
      error instanceof AnalyzeRunnerUnavailableError
    ) {
      return addRunnerName(runners.api, await action(runners.api))
    }
    throw error
  }
}

function addRunnerName<T>(
  runner: AnalyzeRunner,
  output: AnalyzeRunnerOutput<T>,
): AnalyzeRunnerResult<T> {
  return {
    runner: runner.name,
    ...output,
  }
}

class L2AnalyzeCliRunner implements AnalyzeRunner {
  name = 'cli' as const

  listAnalyzers(): Promise<AnalyzeRunnerOutput<AnalyzersApiResponse>> {
    const output = runLocalL2Analyze(['list', '--json'])
    return Promise.resolve({
      result: parseLocalJson(output.stdout, AnalyzersApiResponse, 'list'),
      exitStatus: output.status,
    })
  }

  runAnalyzer(
    input: AnalyzeRunInput,
  ): Promise<AnalyzeRunnerOutput<AnalyzerResultApiResponse>> {
    const { flatDir, entrypoint } = resolveFlatEntrypointSource(
      input.entrypointPath,
    )
    const output = runLocalL2Analyze([
      'run',
      input.analyzerId,
      flatDir,
      '--entrypoint',
      entrypoint,
      '--json',
    ])

    return Promise.resolve({
      result: parseLocalJson(output.stdout, AnalyzerResultApiResponse, 'run'),
      exitStatus: output.status,
    })
  }
}

class AnalyzeApiRunner implements AnalyzeRunner {
  name = 'api' as const

  constructor(private readonly analyzeClient = new AnalyzeClient()) {}

  async listAnalyzers(): Promise<AnalyzeRunnerOutput<AnalyzersApiResponse>> {
    return {
      result: await this.analyzeClient.getAnalyzers(),
    }
  }

  async runAnalyzer(
    input: AnalyzeRunInput,
  ): Promise<AnalyzeRunnerOutput<AnalyzerResultApiResponse>> {
    return {
      result: await this.analyzeClient.runAnalyzer(
        input.analyzerId,
        await loadFlatEntrypointSourceInput(input.entrypointPath),
      ),
    }
  }
}

interface LocalCommandResult {
  stdout: string
  status: number
}

function runLocalL2Analyze(args: string[]): LocalCommandResult {
  const result = spawnSync('l2analyze', args, { encoding: 'utf-8' })
  const error = result.error as NodeJS.ErrnoException | undefined

  if (error !== undefined) {
    if (error.code === 'ENOENT') {
      throw new AnalyzeRunnerUnavailableError(
        'l2analyze is not installed or is not on PATH.',
      )
    }
    throw error
  }

  if (result.stderr) {
    process.stderr.write(result.stderr)
  }

  return {
    stdout: result.stdout ?? '',
    status: result.status ?? 1,
  }
}

function parseLocalJson<T>(
  stdout: string,
  schema: { parse(value: unknown): T },
  command: string,
): T {
  try {
    return schema.parse(JSON.parse(stdout))
  } catch {
    if (stdout) {
      process.stdout.write(stdout)
    }
    throw new AnalyzeRunnerError(`l2analyze ${command} returned invalid JSON`)
  }
}
