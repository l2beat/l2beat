/**
 * The command line: one subcommand per tool, so each stage can be run,
 * timed and diffed alone, plus `pipeline` to run them all. Every command
 * takes `--env-file` because RPC keys live outside this package (see
 * `env/loadEnv.ts`). Arguments are parsed here and nothing else: the work
 * is in `commands/*`, which the integration test and later the benchmark
 * call directly.
 */
import {
  command,
  flag,
  number,
  oneOf,
  option,
  optional,
  positional,
  restPositionals,
  run,
  string,
  subcommands,
} from 'cmd-ts'
import path from 'path'
import { REASONING_EFFORTS } from './author/codex/CodexClient'
import {
  authorCommand,
  factsFor,
  MODEL_PROVIDERS,
  summariseAuthoring,
} from './commands/authorCommand'
import { baselineCommand } from './commands/baselineCommand'
import {
  benchmarkCommand,
  summariseBenchmark,
} from './commands/benchmarkCommand'
import { createContext } from './commands/context'
import { executeCommand } from './commands/executeCommand'
import { FILE_NAMES, readPrepared } from './commands/files'
import { outputCommand } from './commands/outputCommand'
import {
  type PipelineResult,
  pipelineCommand,
} from './commands/pipelineCommand'
import { prepareCommand } from './commands/prepareCommand'
import { reportCommand } from './commands/reportCommand'
import { suiteCommand } from './commands/suiteCommand'
import {
  countErrors,
  formatFinding,
  validateCommand,
} from './commands/validateCommand'
import { worklistCommand } from './commands/worklistCommand'
import { PLAN_STATUSES } from './types/EntryMeta'

const envFile = option({
  type: optional(string),
  long: 'env-file',
  description:
    'dotenv file with <CHAIN>_RPC_URL etc.; default: <repo>/.env, then <repo>/packages/backend/.env',
})

const out = option({
  type: optional(string),
  long: 'out',
  description:
    'output directory; default: runs/<chain>/<address> or the directory of the input file',
})

const target = {
  chain: positional({ type: string, displayName: 'chain' }),
  address: positional({ type: string, displayName: 'address' }),
  blockNumber: option({
    type: optional(number),
    long: 'block',
    description: 'block number to read state at (wins over --timestamp)',
  }),
  timestamp: option({
    type: optional(number),
    long: 'timestamp',
    description: 'unix timestamp resolved to a block as V1 does; default: now',
  }),
}

const preparedFile = positional({ type: string, displayName: 'preparedFile' })
const baselineFile = positional({ type: string, displayName: 'baselineFile' })

const authoring = {
  provider: option({
    type: oneOf(MODEL_PROVIDERS),
    long: 'provider',
    defaultValue: () => 'codex' as const,
    description: 'CLI that carries the model: codex (default) or opencode',
  }),
  model: option({
    type: optional(string),
    long: 'model',
    description:
      'codex: model name, default the Codex default; opencode: provider/model as `opencode models` lists them',
  }),
  reasoning: option({
    type: optional(oneOf(REASONING_EFFORTS)),
    long: 'reasoning',
    description:
      'reasoning effort: codex model_reasoning_effort, opencode --variant',
  }),
  maxRounds: option({
    type: optional(number),
    long: 'max-rounds',
    description: 'repair rounds after the first turn; default 2',
  }),
  noStore: flag({
    long: 'no-store',
    description: 'do not save an accepted plan under plans/<shapeHash>.json',
  }),
  review: flag({
    long: 'review',
    description:
      'second pass: show the model what its accepted plan produced and ask for a revision',
  }),
  facts: flag({
    long: 'facts',
    description:
      'compile the sources and add compiler-derived writer/event facts to the prompt (needs souffle on PATH)',
  }),
}

function authorOptions(args: {
  provider: (typeof MODEL_PROVIDERS)[number]
  model?: string
  reasoning?: (typeof REASONING_EFFORTS)[number]
  maxRounds?: number
  noStore: boolean
  review: boolean
  facts: boolean
}) {
  return {
    provider: args.provider,
    model: args.model,
    review: args.review,
    facts: args.facts,
    reasoning: args.reasoning,
    maxRounds: args.maxRounds,
    store: !args.noStore,
  }
}

const prepare = command({
  name: 'prepare',
  description:
    'bytecode class, proxy, sources, ABI, flattened source, shape hash',
  args: { ...target, out, envFile },
  handler: async (args) => {
    await prepareCommand(createContext(args), args)
  },
})

const baseline = command({
  name: 'baseline',
  description: 'every 0-arg view/pure getter at the prepared block',
  args: { preparedFile, out, envFile },
  handler: async (args) => {
    await baselineCommand(createContext(args), args)
  },
})

const worklist = command({
  name: 'worklist',
  description: 'every parametrized view/pure function and every event',
  args: { preparedFile, out, envFile },
  handler: (args) => {
    worklistCommand(createContext(args), args)
  },
})

const validate = command({
  name: 'validate',
  description: 'static plan validation; prints findings, exit 1 on errors',
  args: {
    preparedFile,
    baselineFile,
    worklistFile: positional({ type: string, displayName: 'worklistFile' }),
    planFile: positional({ type: string, displayName: 'planFile' }),
    envFile,
  },
  handler: async (args) => {
    const findings = await validateCommand(createContext(args), args)
    for (const finding of findings) {
      console.log(formatFinding(finding))
    }
    if (countErrors(findings) > 0) {
      process.exitCode = 1
    }
  },
})

const author = command({
  name: 'author',
  description:
    'ask Codex for a plan, validate, dry-run and repair it; writes plan.json and author/, exit 1 on failure',
  args: {
    preparedFile,
    baselineFile,
    worklistFile: positional({ type: string, displayName: 'worklistFile' }),
    ...authoring,
    out,
    envFile,
  },
  handler: async (args) => {
    const { result } = await authorCommand(createContext(args), {
      ...args,
      ...authorOptions(args),
    })
    console.log(summariseAuthoring(result))
    if (result.status !== 'ok') {
      process.exitCode = 1
    }
  },
})

const execute = command({
  name: 'execute',
  description: 'run a plan and write values.json',
  args: {
    preparedFile,
    baselineFile,
    planFile: positional({ type: string, displayName: 'planFile' }),
    out,
    envFile,
  },
  handler: async (args) => {
    await executeCommand(createContext(args), args)
  },
})

const output = command({
  name: 'output',
  description: 'assemble entry.json (V1 EntryParameters) and entry.meta.json',
  args: {
    preparedFile,
    baselineFile,
    valuesFile: positional({
      type: optional(string),
      displayName: 'valuesFile',
    }),
    planFile: positional({ type: optional(string), displayName: 'planFile' }),
    status: option({
      type: optional(oneOf(PLAN_STATUSES)),
      long: 'status',
      description:
        'plan status for entry.meta.json; default: from values.json, or missing',
    }),
    out,
    envFile,
  },
  handler: (args) => {
    outputCommand(createContext(args), args)
  },
})

const pipeline = command({
  name: 'pipeline',
  description:
    'prepare, baseline, worklist, then validate and execute a plan (--plan, the store, or --author), then output',
  args: {
    ...target,
    planFile: option({
      type: optional(string),
      long: 'plan',
      description: 'plan file; default: plans/<shapeHash>.json when present',
    }),
    author: flag({
      long: 'author',
      description: 'ask Codex when no plan applies',
    }),
    reauthor: flag({
      long: 'reauthor',
      description: 'ask Codex even when a stored plan applies',
    }),
    ...authoring,
    out,
    envFile,
  },
  handler: async (args) => {
    const result = await pipelineCommand(createContext(args), {
      ...args,
      ...authorOptions(args),
    })
    console.log(summarisePipeline(result))
    if (result.planStatus === 'failed') {
      process.exitCode = 1
    }
  },
})

function summarisePipeline(result: PipelineResult): string {
  const { entry, meta } = result.output
  return [
    `status=${result.planStatus}`,
    `source=${result.planSource ?? 'none'}`,
    `rounds=${result.authoring?.rounds.length ?? 0}`,
    `steps=${meta.stepCount}`,
    `skips=${meta.skipCount}`,
    `fields=${Object.keys(entry.values ?? {}).length}`,
    `errors=${Object.keys(entry.errors ?? {}).length}`,
    ...(meta.model === undefined ? [] : [`model=${meta.model}`]),
    ...(result.authoring?.failure === undefined
      ? []
      : [`failure=${JSON.stringify(result.authoring.failure)}`]),
  ].join(' ')
}

const facts = command({
  name: 'facts',
  description:
    'compile each verified source with its exact compiler, run the Datalog rules and write facts.json: who writes each state variable, under which modifiers, emitting which events',
  args: {
    preparedFile,
    out,
    envFile,
  },
  handler: async (args) => {
    const ctx = createContext(args)
    const prepared = readPrepared(args.preparedFile)
    const file = path.join(
      args.out ?? path.dirname(args.preparedFile),
      FILE_NAMES.facts,
    )
    const result = await factsFor(ctx, prepared, file)
    for (const source of result.sources) {
      console.log(
        source.error === undefined
          ? `${source.name}: ${source.variables.length} variable(s), ${source.neverEmitted.length} never-emitted event(s), solc ${source.compilerVersion}${source.evmVersion ? ` (${source.evmVersion})` : ''}`
          : `${source.name}: ${source.error}`,
      )
    }
  },
})

const suite = command({
  name: 'suite',
  description:
    'run the benchmark suite (benchmarks/suite.json) under one label; outputs runs/benchmark/<label>/<project>, plans in plans/experiments/<label>',
  args: {
    label: positional({ type: string, displayName: 'label' }),
    projects: option({
      type: optional(string),
      long: 'projects',
      description: 'comma-separated subset of the suite projects',
    }),
    suiteFile: option({
      type: optional(string),
      long: 'suite-file',
      description: 'suite file; default benchmarks/suite.json',
    }),
    author: flag({
      long: 'author',
      description: 'ask the model when the experiment store has no plan',
    }),
    rejudge: flag({
      long: 'rejudge',
      description: 're-compare the existing runs under the current rules',
    }),
    noPlan: flag({
      long: 'no-plan',
      description: 'empty plan for every contract (the floor)',
    }),
    repeat: option({
      type: number,
      long: 'repeat',
      defaultValue: () => 0,
      description: 'extra authorings per contract; needs --author',
    }),
    ...authoring,
    envFile,
  },
  handler: async (args) => {
    const results = await suiteCommand(createContext(args), {
      ...args,
      ...authorOptions(args),
      projects: args.projects?.split(',').map((p) => p.trim()),
    })
    for (const { report } of results) {
      console.log(summariseBenchmark(report))
    }
    if (results.some((r) => r.report.totals.failed > 0)) {
      process.exitCode = 1
    }
  },
})

const report = command({
  name: 'report',
  description:
    'render one self-contained HTML page comparing several benchmark.json runs; an input may be label=path',
  args: {
    inputs: restPositionals({ type: string, displayName: 'benchmark.json' }),
    out: option({
      type: string,
      long: 'out',
      defaultValue: () => 'BENCHMARK.html',
      description: 'output file; default BENCHMARK.html',
    }),
    markdown: option({
      type: optional(string),
      long: 'markdown',
      description: 'also write the cross-run table as a Markdown file',
    }),
    envFile,
  },
  handler: (args) => {
    reportCommand(createContext(args), args)
  },
})

const benchmark = command({
  name: 'benchmark',
  description:
    "run the pipeline over a V1 project's contracts at its committed block and compare field by field with discovered.json",
  args: {
    project: positional({ type: string, displayName: 'project' }),
    chain: option({
      type: string,
      long: 'chain',
      defaultValue: () => 'ethereum',
      description: 'chain whose entries are compared; default ethereum',
    }),
    limit: option({
      type: optional(number),
      long: 'limit',
      description: 'at most N contracts, in discovered.json order',
    }),
    addresses: option({
      type: optional(string),
      long: 'addresses',
      description: 'comma-separated addresses to restrict the run to',
    }),
    author: flag({
      long: 'author',
      description: 'ask Codex when the store has no plan for a shape',
    }),
    rejudge: flag({
      long: 'rejudge',
      description:
        're-compare the run already in --out under the current verdict rules, without running any pipeline',
    }),
    noPlan: flag({
      long: 'no-plan',
      description:
        'empty plan for every contract: measures proxy values and 0-arg getters alone, the floor without any decision',
    }),
    repeat: option({
      type: number,
      long: 'repeat',
      defaultValue: () => 0,
      description:
        'author N more times per contract with the store bypassed and report distinct decision hashes; needs --author',
    }),
    provider: authoring.provider,
    model: authoring.model,
    reasoning: authoring.reasoning,
    review: authoring.review,
    facts: authoring.facts,
    maxRounds: authoring.maxRounds,
    out: option({
      type: optional(string),
      long: 'out',
      description: 'output directory; default runs/benchmark/<project>',
    }),
    envFile,
  },
  handler: async (args) => {
    const { report } = await benchmarkCommand(createContext(args), {
      ...args,
      addresses: args.addresses?.split(',').map((a) => a.trim()),
    })
    console.log(summariseBenchmark(report))
    if (report.totals.failed > 0) {
      process.exitCode = 1
    }
  },
})

const cli = subcommands({
  name: 'discovery-v2',
  cmds: {
    prepare,
    baseline,
    worklist,
    author,
    validate,
    execute,
    output,
    pipeline,
    facts,
    benchmark,
    suite,
    report,
  },
})

run(cli, process.argv.slice(2)).then(
  () => process.exit(process.exitCode ?? 0),
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
