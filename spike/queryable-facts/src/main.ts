// CLI for the spike.
//
//   tsx src/main.ts pipeline <file.sol> [--unit <id>] [--out <dir>] [--backend native|solcjs]
//                                      [--solc <x.y.z>] [--souffle <bin>] [--jobs <n>]
//   tsx src/main.ts facts    <file.sol> [...same]          # compile + extract only
//
// pipeline = compile → extract facts → run Soufflé on rules/*.dl → render report.md

import { spawnSync } from 'child_process'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, join, resolve } from 'path'
import { type Backend, compile } from './compile'
import { extractFacts } from './extract'
import { renderReport } from './report'

const ROOT = resolve(__dirname, '..')
const RULE_FILES = ['schema.dl', 'lib.dl', 'report.dl']

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
  const factsDir = join(outDir, 'facts')
  const derivedDir = join(outDir, 'derived')
  mkdirSync(outDir, { recursive: true })

  // 1. compile
  const compiled = await compile({
    fileName: unit,
    source,
    cacheDir: join(ROOT, '.cache'),
    backend: args.backend,
    solcVersion: args.solc,
  })
  console.log(
    `[compile] pragma ${JSON.stringify(compiled.constraints)} → solc ${compiled.solcVersion} (${compiled.resolvedFrom}); resolve ${ms(compiled.timings.resolveMs)}, compile ${ms(compiled.timings.compileMs)}, ${compiled.warnings} warning(s)`,
  )
  writeFileSync(
    join(outDir, 'solc-output.json'),
    JSON.stringify(compiled.output),
  )

  // 2. extract
  const t0 = performance.now()
  const { facts, stats } = extractFacts({
    unit,
    fileName: unit,
    source,
    output: compiled.output,
    solcVersion: compiled.solcVersion,
  })
  const written = facts.write(factsDir)
  const t1 = performance.now()
  const counts = [...facts.rows.entries()]
    .filter(([, rows]) => rows.size > 0)
    .map(([name, rows]) => `${name}=${rows.size}`)
    .join(' ')
  console.log(
    `[extract] ${written.rows} rows, ${(written.bytes / 1024).toFixed(1)} KiB in ${ms(t1 - t0)}; ${stats.ignoredDeclarations} declaration(s) deliberately not modelled; ${stats.unhandled} unhandled`,
  )
  console.log(`[extract] ${counts}`)
  for (const row of facts.rows.get('unhandled') ?? [])
    console.log(`[extract] UNHANDLED ${row}`)
  if (args.cmd === 'facts') return

  // 3. Soufflé
  const program = RULE_FILES.map(
    (f) =>
      `// ----- ${f} -----\n${readFileSync(join(ROOT, 'rules', f), 'utf8')}`,
  ).join('\n')
  const programPath = join(outDir, 'program.dl')
  writeFileSync(programPath, program)
  mkdirSync(derivedDir, { recursive: true })
  const t2 = performance.now()
  const run = spawnSync(
    args.souffle,
    [
      '--no-preprocessor',
      `-j${args.jobs}`,
      '-F',
      factsDir,
      '-D',
      derivedDir,
      programPath,
    ],
    { encoding: 'utf8' },
  )
  const t3 = performance.now()
  if (run.error) {
    console.error(
      `[souffle] could not run '${args.souffle}': ${run.error.message} (set --souffle or $SOUFFLE)`,
    )
    process.exitCode = 2
    return
  }
  if (run.status !== 0) {
    console.error(`[souffle] exit ${run.status}\n${run.stdout}\n${run.stderr}`)
    process.exitCode = 1
    return
  }
  if (run.stderr.trim()) console.log(`[souffle] ${run.stderr.trim()}`)
  const sizes = readdirSync(derivedDir)
    .filter((f) => f.endsWith('.csv'))
    .sort()
    .map(
      (f) =>
        `${f.replace(/\.csv$/, '')}=${readFileSync(join(derivedDir, f), 'utf8').split('\n').filter(Boolean).length}`,
    )
    .join(' ')
  console.log(
    `[souffle] ${ms(t3 - t2)} (interpreter, -j${args.jobs}); ${sizes}`,
  )

  // 4. report
  const report = renderReport({ unit, factsDir, derivedDir })
  writeFileSync(join(outDir, 'report.md'), report)
  console.log(`[report] ${join(outDir, 'report.md')}`)
  console.log(
    `[timing] compile ${ms(compiled.timings.compileMs)} + extract ${ms(t1 - t0)} + souffle ${ms(t3 - t2)} = ${ms(compiled.timings.compileMs + (t1 - t0) + (t3 - t2))} (excluding one-off solc resolution/download)`,
  )
  console.log(`\n${report}`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
