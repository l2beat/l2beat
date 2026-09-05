// CLI for the spike.
//
//   tsx src/main.ts pipeline <file.sol> [--unit <id>] [--out <dir>] [--backend native|solcjs]
//                                      [--solc <x.y.z>] [--souffle <bin>] [--jobs <n>]
//   tsx src/main.ts facts    <file.sol> [...same]          # compile + emit base facts only
//
// pipeline = compile → emit the AST as facts → run Soufflé on rules/*.dl → render report.md
// (the loop itself lives in pipeline.ts, shared with the web explorer in web/).

import { readFileSync } from 'fs'
import { basename, join, resolve } from 'path'
import type { Backend } from './compile'
import { runPipeline, SouffleError } from './pipeline'

const ROOT = resolve(__dirname, '..')

interface Args {
  cmd: 'facts' | 'pipeline'
  file: string
  unit?: string
  out?: string
  backend: Backend
  solc?: string
  souffle: string
  jobs: string
}

function parseArgs(argv: string[]): Args {
  const [cmd, file, ...rest] = argv
  if ((cmd !== 'facts' && cmd !== 'pipeline') || !file) {
    throw new Error(
      'usage: main.ts <facts|pipeline> <file.sol> [--unit id] [--out dir] [--backend native|solcjs] [--solc x.y.z] [--souffle bin] [--jobs n]',
    )
  }
  const args: Args = {
    cmd,
    file,
    backend: 'native',
    souffle: process.env.SOUFFLE ?? 'souffle',
    jobs: '1',
  }
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i]
    const value = rest[i + 1]
    if (value === undefined) throw new Error(`missing value for ${key}`)
    switch (key) {
      case '--unit':
        args.unit = value
        break
      case '--out':
        args.out = value
        break
      case '--backend':
        if (value !== 'native' && value !== 'solcjs')
          throw new Error(`bad backend ${value}`)
        args.backend = value
        break
      case '--solc':
        args.solc = value
        break
      case '--souffle':
        args.souffle = value
        break
      case '--jobs':
        args.jobs = value
        break
      default:
        throw new Error(`unknown flag ${key}`)
    }
  }
  return args
}

const ms = (n: number) => `${n.toFixed(0)} ms`

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))
  const file = resolve(args.file)
  const source = readFileSync(file, 'utf8')
  const unit = args.unit ?? basename(file)
  const outDir = args.out ?? join(ROOT, 'out', unit.replace(/\.sol$/, ''))

  const result = await runPipeline({
    unit,
    source,
    outDir,
    rulesDir: join(ROOT, 'rules'),
    cacheDir: join(ROOT, '.cache'),
    backend: args.backend,
    solcVersion: args.solc,
    souffle: args.souffle,
    jobs: Number(args.jobs),
    factsOnly: args.cmd === 'facts',
  })
  const { compiled, facts, factsWritten, timings } = result
  console.log(
    `[compile] pragma ${JSON.stringify(compiled.constraints)} → solc ${compiled.solcVersion} (${compiled.resolvedFrom}); resolve ${ms(timings.resolveMs)}, compile ${ms(timings.compileMs)}, ${compiled.warnings} warning(s)`,
  )
  const counts = [...facts.rows.entries()]
    .filter(([, rows]) => rows.size > 0)
    .map(([name, rows]) => `${name}=${rows.size}`)
    .join(' ')
  console.log(
    `[emit] ${factsWritten.rows} rows, ${(factsWritten.bytes / 1024).toFixed(1)} KiB in ${ms(timings.emitMs)}; ${facts.count('node')} AST nodes (${result.syntheticIds} Yul nodes given synthetic ids)`,
  )
  console.log(`[emit] ${counts}`)
  if (args.cmd === 'facts') return

  if (result.souffle.stderr) console.log(`[souffle] ${result.souffle.stderr}`)
  const sizes = [...result.derived.entries()]
    .map(([name, rows]) => `${name}=${rows.length}`)
    .join(' ')
  console.log(
    `[souffle] ${ms(timings.souffleMs)} (interpreter, -j${args.jobs}); ${sizes}`,
  )
  for (const cols of result.derived.get('unhandled') ?? [])
    console.log(`[souffle] UNHANDLED ${cols.join('\t')}`)
  console.log(`[report] ${join(outDir, 'report.md')}`)
  console.log(
    `[timing] compile ${ms(timings.compileMs)} + emit ${ms(timings.emitMs)} + souffle ${ms(timings.souffleMs)} = ${ms(timings.compileMs + timings.emitMs + timings.souffleMs)} (excluding one-off solc resolution/download)`,
  )
  console.log(`\n${result.report}`)
}

main().catch((error: unknown) => {
  if (error instanceof SouffleError) {
    console.error(`${error.message}\n${error.stdout}\n${error.stderr}`)
  } else {
    console.error(error instanceof Error ? error.message : error)
  }
  process.exitCode = 1
})
