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
  readSuite,
  selectSuiteProjects,
} from '../discovery/templatizer/benchmark/loadProject'
import {
  REPORT_MARKDOWN,
  runBenchmark,
} from '../discovery/templatizer/benchmark/runBenchmark'
import { DEFAULT_MAX_ROUNDS } from '../discovery/templatizer/loop'
import {
  createModelClient,
  describeModel,
} from '../discovery/templatizer/model/createModelClient'
import { configureLogger } from './logger'

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
    aiModel: option({
      type: optional(string),
      long: 'ai-model',
      description:
        'a Codex model name (default: Codex default), or opencode/<model>, e.g. opencode/deepseek-v4.1-flash for the cheap option',
    }),
    aiRounds: option({
      type: optional(number),
      long: 'ai-rounds',
      description: `model turns per contract, the first included (default ${DEFAULT_MAX_ROUNDS})`,
    }),
    projects: multioption({
      type: array(string),
      long: 'project',
      defaultValue: () => [],
      description:
        'suite project to run; repeat or comma-separate (default: every suite project)',
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
  aiModel?: string
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
  const model = createModelClient(args.aiModel)
  const modelLabel = describeModel(args.aiModel)
  const maxRounds = args.aiRounds ?? DEFAULT_MAX_ROUNDS
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
            maxRounds,
            logger: logger.for('Templatizer'),
          },
          run,
        ),
    },
    selectSuiteProjects(readSuite(), splitList(args.projects)),
    {
      outDir,
      model: modelLabel,
      maxRounds,
      onlyAddresses:
        args.addresses === undefined ? undefined : splitList([args.addresses]),
      limit: args.limit,
    },
  )
  logger.info('Benchmark written', {
    report: path.join(outDir, REPORT_MARKDOWN),
    handlerFieldsFound: `${report.totals.handlerFound}/${report.totals.handlerFields}`,
  })
}

function splitList(values: readonly string[]): string[] {
  return values
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}
