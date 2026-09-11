// Semantic tests: run each fixture in contracts/ through the pipeline and compare the answer
// relations with rows a person has checked (expected/<Fixture>/<relation>.tsv, from the first
// prototype). Also checks the expected tuples of promoted rules (expected/proposed/*.tsv) against a
// run given with --run <dir>.
//
//   tsx src/semantic.ts                 # fixtures
//   tsx src/semantic.ts --run <dir>     # fixtures + promoted rules against that run

import { existsSync, readdirSync, readFileSync } from 'fs'
import { basename, join, resolve } from 'path'
import { CACHE_DIR, FIXTURES_DIR, ROOT, RULES_DIR } from './paths'
import { runAll, unitDir } from './pipeline'
import { listQueries } from './query'

const RELATIONS = ['storageWriters', 'findings', 'opaqueWrites', 'unhandled']

function readRows(path: string): string[] {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .sort()
}

function compare(name: string, expected: string[], actual: string[]): string[] {
  const want = new Set(expected)
  const got = new Set(actual)
  const problems: string[] = []
  for (const row of expected)
    if (!got.has(row))
      problems.push(`    - ${name}: ${row.replace(/\t/g, ' ⇥ ')}`)
  for (const row of actual)
    if (!want.has(row))
      problems.push(`    + ${name}: ${row.replace(/\t/g, ' ⇥ ')}`)
  return problems
}

async function main(): Promise<void> {
  let failed = 0
  for (const file of readdirSync(FIXTURES_DIR)
    .filter((f) => f.endsWith('.sol'))
    .sort()) {
    const name = basename(file, '.sol')
    const expectedDir = join(ROOT, 'expected', name)
    if (!existsSync(expectedDir)) {
      console.log(`  ? ${name}: no expected/ folder, skipped`)
      continue
    }
    const outDir = join(ROOT, 'out', 'semantic', name)
    const meta = await runAll({
      input: {
        kind: 'file',
        name: file,
        source: readFileSync(join(FIXTURES_DIR, file), 'utf8'),
      },
      outDir,
      rulesDir: RULES_DIR,
      cacheDir: CACHE_DIR,
    })
    const slug = meta.units[0]?.slug ?? ''
    const problems: string[] = []
    let total = 0
    for (const relation of RELATIONS) {
      const expected = readRows(join(expectedDir, `${relation}.tsv`))
      total += expected.length
      problems.push(
        ...compare(
          relation,
          expected,
          readRows(join(unitDir(outDir, slug), 'derived', `${relation}.csv`)),
        ),
      )
    }
    if (problems.length === 0)
      console.log(`ok   ${name}: ${total} expected rows match`)
    else {
      failed++
      console.log(`FAIL ${name}: ${problems.length} difference(s)`)
      for (const p of problems) console.log(p)
    }
  }
  const runFlag = process.argv.indexOf('--run')
  const proposedDir = join(ROOT, 'expected', 'proposed')
  if (runFlag >= 0 && existsSync(proposedDir)) {
    const runDir = resolve(process.argv[runFlag + 1] ?? '')
    for (const f of readdirSync(proposedDir).filter((f) =>
      f.endsWith('.tsv'),
    )) {
      const relation = basename(f, '.tsv')
      const expected = readRows(join(proposedDir, f))
      const actual = readRows(join(runDir, 'derived', `${relation}.csv`))
      const problems = compare(relation, expected, actual)
      if (problems.length === 0)
        console.log(`ok   proposed ${relation}: ${expected.length} rows match`)
      else {
        failed++
        console.log(
          `FAIL proposed ${relation}: ${problems.length} difference(s)`,
        )
        for (const p of problems.slice(0, 20)) console.log(p)
      }
    }
  }
  // queries left in the run folder itself are not tests; mention them so nobody forgets them
  if (runFlag >= 0) {
    const stray = listQueries(resolve(process.argv[runFlag + 1] ?? ''))
    if (stray.length > 0)
      console.log(
        `  (${stray.length} ad-hoc queries in the run folder: ${stray.map((q) => q.name).join(', ')})`,
      )
  }
  process.exitCode = failed > 0 ? 1 : 0
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
