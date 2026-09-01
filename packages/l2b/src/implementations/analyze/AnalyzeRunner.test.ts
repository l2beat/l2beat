import { expect, mockObject } from 'earl'
import {
  type AnalyzeRunner,
  AnalyzeRunnerUnavailableError,
  runWithSelectedRunner,
} from './AnalyzeRunner'

describe(runWithSelectedRunner.name, () => {
  it('uses the cli runner in auto mode when available', async () => {
    const result = await runWithSelectedRunner(
      'auto',
      async (runner) => ({ result: runner.name }),
      {
        cli: runner('cli'),
        api: runner('api'),
      },
    )

    expect(result).toEqual({ runner: 'cli', result: 'cli' })
  })

  it('falls back to api in auto mode when cli is unavailable', async () => {
    const result = await runWithSelectedRunner(
      'auto',
      async (runner) => {
        if (runner.name === 'cli') {
          throw new AnalyzeRunnerUnavailableError('missing')
        }
        return { result: runner.name }
      },
      {
        cli: runner('cli'),
        api: runner('api'),
      },
    )

    expect(result).toEqual({ runner: 'api', result: 'api' })
  })

  it('does not fall back in cli mode', async () => {
    await expect(
      runWithSelectedRunner(
        'cli',
        async (runner) => {
          if (runner.name === 'cli') {
            throw new AnalyzeRunnerUnavailableError('missing')
          }
          return { result: runner.name }
        },
        {
          cli: runner('cli'),
          api: runner('api'),
        },
      ),
    ).toBeRejectedWith('missing')
  })

  it('uses only api in api mode', async () => {
    const result = await runWithSelectedRunner(
      'api',
      async (runner) => ({ result: runner.name }),
      {
        cli: runner('cli'),
        api: runner('api'),
      },
    )

    expect(result).toEqual({ runner: 'api', result: 'api' })
  })
})

function runner(name: 'cli' | 'api'): AnalyzeRunner {
  return mockObject<AnalyzeRunner>({
    name,
    listAnalyzers: async () => ({ result: [] }),
    runAnalyzer: async () => {
      throw new Error('unused')
    },
  })
}
