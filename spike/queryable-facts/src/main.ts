// CLI for the spike.
//
//   tsx src/main.ts pipeline <file.sol> [--unit <id>] [--out <dir>] [--backend native|solcjs]
//                                      [--solc <x.y.z>] [--souffle <bin>] [--jobs <n>]
//   tsx src/main.ts facts    <file.sol> [...same]          # compile + emit base facts only
//   tsx src/main.ts project  <name|dir> [--out <dir>] [--only <unit,unit>] [--all-relations] [--reuse-units] [...same]
//                                                          # every flattened file of a discovery project + discovered.json
//
// pipeline = compile → emit the AST as facts → run Soufflé on rules/*.dl → render report.md
// (the loop itself lives in pipeline.ts, shared with the web explorer in web/).
// project  = pipeline per unit, then rules/project.dl over the union + discovery's values (project.ts).

import { existsSync, readFileSync } from 'fs'
import { basename, join, resolve } from 'path'
import type { Backend } from './compile'
import { runPipeline, SouffleError } from './pipeline'
import { runProject } from './project'

const ROOT = resolve(__dirname, '..')
export const PROJECTS_DIR = resolve(
  ROOT,
  '..',
  '..',
  'packages',
  'config',
  'src',
  'projects',
)

interface Args {
  cmd: 'facts' | 'pipeline' | 'project'
  file: string
  unit?: string
  out?: string
  backend: Backend
  solc?: string
  souffle: string
  jobs: string
  only?: string[]
  allRelations: boolean
  reuseUnits: boolean
}

function parseArgs(argv: string[]): Args {
  const [cmd, file, ...rest] = argv
  if ((cmd !== 'facts' && cmd !== 'pipeline' && cmd !== 'project') || !file) {
    throw new Error(
      'usage: main.ts <facts|pipeline> <file.sol> [--unit id] [--out dir] [--backend native|solcjs] [--solc x.y.z] [--souffle bin] [--jobs n]\n' +
        '       main.ts project <name|dir> [--out dir] [--only unit,unit] [--all-relations] [--backend ...] [--souffle bin] [--jobs n]',
    )
  }
  const args: Args = {
    cmd,
    file,
    backend: 'native',
    souffle: process.env.SOUFFLE ?? 'souffle',
    jobs: '1',
    allRelations: false,
    reuseUnits: false,
  }
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i]
    if (key === '--all-relations' || key === '--reuse-units') {
      if (key === '--all-relations') args.allRelations = true
      else args.reuseUnits = true
      i -= 1
      continue
    }
    const value = rest[i + 1]
    if (value === undefined) throw new Error(`missing value for ${key}`)
    switch (key) {
      case '--unit':
        args.unit = value
        break
      case '--out':
        args.out = value
        break
      case '--only':
        args.only = value.split(',')
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

async function projectMain(args: Args): Promise<void> {
  const dir = existsSync(join(args.file, 'discovered.json'))
    ? resolve(args.file)
    : join(PROJECTS_DIR, args.file)
  if (!existsSync(join(dir, 'discovered.json')))
    throw new Error(`no discovered.json in ${dir}`)
  const outDir = args.out ?? join(ROOT, 'out', 'projects', basename(dir))
  const result = await runProject({
    projectDir: dir,
    outDir,
    rulesDir: join(ROOT, 'rules'),
    cacheDir: join(ROOT, '.cache'),
    backend: args.backend,
    souffle: args.souffle,
    jobs: Number(args.jobs),
    only: args.only,
    outputAllRelations: args.allRelations,
    reuseUnits: args.reuseUnits,
    onProgress: (e) => {
      if (e.type === 'plan')
        console.log(
          `[project] ${e.units} unit(s) to run${e.missing > 0 ? `, ${e.missing} code(s) without a flattened file` : ''}`,
        )
      else if (e.type === 'unit' && e.status === 'done')
        console.log(
          `[unit ${e.index + 1}] ${e.unit}: solc ${e.solcVersion.split('+')[0]}, ${ms(e.ms)}`,
        )
      else if (e.type === 'unit' && e.status === 'failed')
        console.log(
          `[unit ${e.index + 1}] ${e.unit}: FAILED ${e.error.split('\n')[0]}`,
        )
      else if (e.type === 'project') console.log(`[project] ${e.status}…`)
    },
  })
  const sizes = [...result.derived.entries()]
    .filter(([, rows]) => rows.length > 0)
    .map(([name, rows]) => `${name}=${rows.length}`)
    .join(' ')
  console.log(
    `[project] imported ${Object.values(result.imported).reduce((a, b) => a + b, 0)} unit rows; Soufflé ${ms(result.timings.souffleMs)}; ${sizes}`,
  )
  if (result.souffle.stderr) console.log(`[souffle] ${result.souffle.stderr}`)
  console.log(
    `[timing] units ${ms(result.timings.unitsMs)} + facts ${ms(result.timings.factsMs)} + souffle ${ms(result.timings.souffleMs)} + report ${ms(result.timings.reportMs)}`,
  )
  console.log(`[report] ${join(outDir, 'report.md')}`)
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))
  if (args.cmd === 'project') {
    await projectMain(args)
    return
  }
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
