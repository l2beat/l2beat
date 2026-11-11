import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import {
  array,
  command,
  multioption,
  number,
  option,
  optional,
  string,
} from 'cmd-ts'
import path from 'path'
import { getChainConfigs } from '../config/config.discovery'
import { getDiscoveryPaths } from '../discovery/config/getDiscoveryPaths'
import { AllProviders } from '../discovery/provider/AllProviders'
import { SQLiteCache } from '../discovery/provider/SQLiteCache'
import { analyzeWithHiddenTemplate } from '../discovery/templatizer/benchmark/analyzeWithHiddenTemplate'
import {
  loadProject,
  quickSuiteProjects,
  readSuite,
  type SuiteName,
  selectSuiteProjects,
  unreachableByTemplate,
} from '../discovery/templatizer/benchmark/loadProject'
import {
  REPORT_MARKDOWN,
  runBenchmark,
} from '../discovery/templatizer/benchmark/runBenchmark'
import { DEFAULT_MAX_ROUNDS } from '../discovery/templatizer/loop'
import { chooseModel } from '../discovery/templatizer/model/createModelClient'
import { configureLogger } from './logger'
import { PositiveInteger } from './types'

export const TemplatizerBenchmarkCommand = command({
  name: 'templatizer-benchmark',
  description:
    'hides the committed template of every suite contract, lets the templatizer author one, and compares the values with the committed discovered.json',
  args: {
    out: option({
      type: string,
      long: 'out',
      description:
        'directory for benchmark.json, benchmark.md, the authored templates and the model trail',
    }),
    suite: option({
      type: string,
      long: 'suite',
      defaultValue: () => 'quick',
      description:
        'quick (default: fourteen contracts chosen for dense use of the generic handlers, about half an hour) or full (the research suite: scroll, 24 base contracts, 6 plumenetwork)',
    }),
    aiModel: option({
      type: optional(string),
      long: 'ai-model',
      description:
        'a Codex model name (default: Codex default), or an opencode gateway model, opencode/<model> (Zen) or opencode-go/<model> (Go), e.g. opencode-go/deepseek-v4.1-flash for the cheap option',
    }),
    aiEffort: option({
      type: optional(string),
      long: 'ai-effort',
      description:
        'reasoning effort (default high): for opencode one of the levels of the model, which `opencode models <provider> --verbose` lists under variants (DeepSeek: low, high, max); for Codex none, minimal, low, medium, high, xhigh or max',
    }),
    aiRounds: option({
      type: optional(PositiveInteger),
      long: 'ai-rounds',
      description: `model turns per contract, the first included (default ${DEFAULT_MAX_ROUNDS})`,
    }),
    projects: multioption({
      type: array(string),
      long: 'project',
      defaultValue: () => [],
      description:
        'suite project to run; repeat or comma-separate (default: every project of the chosen suite)',
    }),
    addresses: option({
      type: optional(string),
      long: 'addresses',
      description:
        'comma-separated addresses (0x… or eth:0x…) to restrict every project to, for smoke runs',
    }),
    limit: option({
      type: optional(number),
      long: 'limit',
      description: 'first n contracts per project, for smoke runs',
    }),
  },
  handler: async (args) => {
    await templatizerBenchmark(args)
  },
})

interface TemplatizerBenchmarkArgs {
  out: string
  suite: string
  aiModel?: string
  aiEffort?: string
  aiRounds?: number
  projects: string[]
  addresses?: string
  limit?: number
}

export async function templatizerBenchmark(
  args: TemplatizerBenchmarkArgs,
): Promise<void> {
  const logger = configureLogger(Logger.DEBUG).for('TemplatizerBenchmark')
  const paths = getDiscoveryPaths()
  // The same providers and sqlite cache as `discover`, so a contract
  // already discovered with `--dev` costs no RPC calls here.
  const allProviders = new AllProviders(
    getChainConfigs(),
    new HttpClient(),
    new SQLiteCache(paths.cache),
    logger,
  )
  const outDir = path.resolve(args.out)
  const chosen = await chooseModel({
    model: args.aiModel,
    effort: args.aiEffort,
  })
  const model = chosen.client
  const modelLabel = chosen.label
  const maxRounds = args.aiRounds ?? DEFAULT_MAX_ROUNDS
  const suiteName = parseSuiteName(args.suite)
  const suite = readSuite()
  const report = await runBenchmark(
    {
      logger,
      loadProject: (project) => loadProject(paths.discovery, project),
      providerFor: (project) =>
        allProviders.get(project.chain, project.timestamp),
      analyzeWithHiddenTemplate: (run) =>
        analyzeWithHiddenTemplate(
          {
            discoveryPath: paths.discovery,
            artifactsRoot: path.join(outDir, 'trails'),
            model,
            modelLabel,
            effort: chosen.effort,
            maxRounds,
            logger,
          },
          run,
        ),
    },
    suiteName === 'quick'
      ? quickSuiteProjects(suite, splitList(args.projects))
      : selectSuiteProjects(suite, splitList(args.projects)),
    {
      outDir,
      model: modelLabel,
      maxRounds,
      onlyAddresses:
        args.addresses === undefined ? undefined : splitList([args.addresses]),
      limit: args.limit,
      unreachable: unreachableByTemplate(suite),
    },
  )
  logger.info('Benchmark written', {
    report: path.join(outDir, REPORT_MARKDOWN),
    reachableFound: `${report.totals.reachableFound}/${report.totals.reachableFields}`,
    regressions: report.totals.regressions,
    handlerFieldsFound: `${report.totals.handlerFound}/${report.totals.handlerFields}`,
  })
}

function parseSuiteName(value: string): SuiteName {
  if (value === 'quick' || value === 'full') {
    return value
  }
  throw new Error(`--suite must be quick or full, got ${value}`)
}

function splitList(values: readonly string[]): string[] {
  return values
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}
