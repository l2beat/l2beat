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
  run,
  string,
  subcommands,
} from 'cmd-ts'
import { REASONING_EFFORTS } from './author/codex/CodexClient'
import { authorCommand, summariseAuthoring } from './commands/authorCommand'
import { baselineCommand } from './commands/baselineCommand'
import { createContext } from './commands/context'
import { executeCommand } from './commands/executeCommand'
import { outputCommand } from './commands/outputCommand'
import {
  type PipelineResult,
  pipelineCommand,
} from './commands/pipelineCommand'
import { prepareCommand } from './commands/prepareCommand'
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
  model: option({
    type: optional(string),
    long: 'model',
    description: 'Codex model; default: the Codex default',
  }),
  reasoning: option({
    type: optional(oneOf(REASONING_EFFORTS)),
    long: 'reasoning',
    description: 'model_reasoning_effort for Codex',
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
}

function authorOptions(args: {
  model?: string
  reasoning?: (typeof REASONING_EFFORTS)[number]
  maxRounds?: number
  noStore: boolean
}) {
  return {
    model: args.model,
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
  },
})

run(cli, process.argv.slice(2)).then(
  () => process.exit(process.exitCode ?? 0),
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
