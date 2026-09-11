// The command line: run a project or a file, list runs, print the catalogue, and the `q` commands an
// agent (or a person) uses inside a run folder.
//
//   tsx src/cli.ts run <project|dir|file.sol> [--out <dir>] [--only a,b] [--reuse-units] [--jobs n]
//   tsx src/cli.ts runs
//   tsx src/cli.ts catalog [--all]
//   tsx src/cli.ts q --run <dir> <command> [...]        (see src/q.ts)
//   tsx src/cli.ts ask --run <dir> "<question>" [--model m] [--effort e]

import { join, resolve } from 'path'
import { ask, DEFAULT_EFFORT, DEFAULT_MODEL } from './agent'
import {
  CACHE_DIR,
  inputName,
  listRuns,
  RULES_DIR,
  RUNS_DIR,
  resolveInput,
  timestamp,
} from './paths'
import { runAll } from './pipeline'
import { qMain } from './q'
import { catalog, loadLibrary } from './rules'
import { SouffleError } from './souffle'

const USAGE = `usage:
  tsx src/cli.ts run <project|dir|file.sol> [--out <dir>] [--only a,b] [--reuse-units] [--jobs n]
  tsx src/cli.ts runs
  tsx src/cli.ts catalog [--all]
  tsx src/cli.ts q --run <dir> <command> [...]        (see src/q.ts)
  tsx src/cli.ts ask --run <dir> "<question>" [--model m] [--effort e]`

interface Args {
  positional: string[]
  flags: Record<string, string | boolean>
}

function parseArgs(argv: string[]): Args {
  const positional: string[] = []
  const flags: Record<string, string | boolean> = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? ''
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next
        i++
      } else flags[key] = true
    } else positional.push(a)
  }
  return { positional, flags }
}

async function cmdRun(args: Args): Promise<void> {
  const what = args.positional[0]
  if (!what) throw new Error('usage: run <project|dir|file.sol> [--out <dir>]')
  const input = resolveInput(what)
  const out =
    typeof args.flags.out === 'string'
      ? resolve(args.flags.out)
      : join(RUNS_DIR, `${inputName(input)}-${timestamp()}`)
  const only =
    typeof args.flags.only === 'string' ? args.flags.only.split(',') : undefined
  const meta = await runAll({
    input,
    outDir: out,
    rulesDir: RULES_DIR,
    cacheDir: CACHE_DIR,
    only,
    reuseUnits: Boolean(args.flags['reuse-units']),
    jobs: typeof args.flags.jobs === 'string' ? Number(args.flags.jobs) : 1,
    onProgress: (e) => {
      if (e.type === 'plan')
        console.log(
          `${e.units} unit(s) to run${e.missing ? `, ${e.missing} without a flattened file` : ''}`,
        )
      else if (e.type === 'unit' && e.status === 'done')
        console.log(
          `  ok   ${e.unit}  solc ${e.solcVersion.split('+')[0]}  ${e.baseRows} facts → ${e.derivedRows} derived  ${(e.ms / 1000).toFixed(1)} s`,
        )
      else if (e.type === 'unit' && e.status === 'failed')
        console.log(`  FAIL ${e.unit}: ${e.error.split('\n')[0]}`)
      else if (e.type === 'project')
        console.log(e.status === 'facts' ? 'project facts…' : 'project rules…')
    },
  })
  console.log(
    `\n${meta.units.filter((u) => u.status === 'ok').length}/${meta.units.length} units, ${meta.counts.baseRows} base facts, ${meta.counts.unitDerivedRows} unit tuples, ${meta.counts.projectDerivedRows} project tuples in ${(meta.timings.totalMs / 1000).toFixed(1)} s`,
  )
  console.log(`→ ${out}`)
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2)
  const args = parseArgs(rest)
  switch (command) {
    case 'run':
      await cmdRun(args)
      return
    case 'runs':
      for (const r of listRuns()) console.log(r.id)
      return
    case 'catalog':
      console.log(catalog(loadLibrary(RULES_DIR), Boolean(args.flags.all)))
      return
    case 'q':
      qMain(args.positional, args.flags)
      return
    case 'ask': {
      const runDir =
        typeof args.flags.run === 'string' ? resolve(args.flags.run) : undefined
      const question = args.positional.join(' ')
      if (!runDir || !question)
        throw new Error(
          'usage: ask --run <dir> "<question>" [--model m] [--effort e]',
        )
      await ask(
        runDir,
        {
          question,
          model:
            typeof args.flags.model === 'string'
              ? args.flags.model
              : DEFAULT_MODEL,
          effort:
            typeof args.flags.effort === 'string'
              ? args.flags.effort
              : DEFAULT_EFFORT,
        },
        (e) => {
          if (e.type === 'command') {
            if (e.status === 'running') console.log(`$ ${e.command}`)
            else if (e.output)
              console.log(e.output.split('\n').slice(0, 12).join('\n'))
          } else if (e.type === 'message') console.log(`\n${e.text}\n`)
          else if (e.type === 'reasoning')
            console.log(`  (${e.text.replace(/\s+/g, ' ').slice(0, 160)})`)
          else if (e.type === 'error') console.error(`error: ${e.message}`)
          else if (e.type === 'done')
            console.log(
              `done in ${(e.ms / 1000).toFixed(0)} s · ${e.claims.filter((c) => c.status === 'verified').length}/${e.claims.length} cited atoms verified · asks/${e.ask}`,
            )
        },
      )
      return
    }
    default:
      console.log(USAGE)
      process.exitCode = command ? 1 : 0
  }
}

main().catch((e: unknown) => {
  if (e instanceof SouffleError) console.error(`${e.message}\n${e.stderr}`)
  else console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
