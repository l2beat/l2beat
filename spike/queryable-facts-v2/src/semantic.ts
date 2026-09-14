// Semantic tests, three kinds:
//
//   1. contracts/*.sol fixtures: the unit relations a person has checked, row by row: one
//      expected/<Fixture>/<relation>.tsv per relation under test.
//   2. projects/pg-*: synthetic projects with an expected.json saying who can change one state
//      variable of one deployed contract. They run through every stage and the verdict relations
//      (canChange / cannotChange / unknownChange / indirectlyCanChange) must say exactly that; see
//      PLAN2.md for the fixture family and what each verdict means.
//   3. --run <dir>: the expected tuples of promoted rules (expected/proposed/*.tsv) against that run.
//
//   tsx src/semantic.ts                 # 1 + 2
//   tsx src/semantic.ts --run <dir>     # 1 + 2 + 3
//   tsx src/semantic.ts pg-04           # only the fixtures whose name contains the argument

import { existsSync, readdirSync, readFileSync } from 'fs'
import { basename, join, resolve } from 'path'
import {
  CACHE_DIR,
  FIXTURES_DIR,
  LOCAL_PROJECTS_DIR,
  ROOT,
  RULES_DIR,
} from './paths'
import { readRelation, runAll, unitDir } from './pipeline'
import { listQueries } from './query'

/** projects/<id>/expected.json: the answer to "who can change <variable> of <address>?". */
interface Expected {
  case?: string
  target: { address: string; variable: string }
  /** Admitted senders; `"anyone"` when the write is proven open to every address. */
  can: string[]
  /** Excluded on every path; "all-others" = every discovered address not in `can` or `unknown`. */
  cannot: string[] | 'all-others'
  /** Neither admitted nor excluded, because of a residual; "all-others" as above. */
  unknown: string[] | 'all-others'
  /** Residual kinds that must be reported (and no others). */
  residuals: string[]
  /** Who can change the storage the guards read (the closure), if anyone. */
  indirect?: Array<{ actor: string; address: string; variable: string }>
}

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

function short(text: string): string {
  return text.replace(
    /(?:[a-z0-9]+:)?0x([0-9a-fA-F]{4})[0-9a-fA-F]{32}([0-9a-fA-F]{4})/g,
    '0x$1…$2',
  )
}

function setText(s: Iterable<string>): string {
  const items = [...s].sort().map(short)
  return items.length === 0 ? '∅' : `{${items.join(', ')}}`
}

function compareSets(
  name: string,
  expected: Set<string>,
  actual: Set<string>,
): string[] {
  const missing = [...expected].filter((x) => !actual.has(x))
  const extra = [...actual].filter((x) => !expected.has(x))
  if (missing.length === 0 && extra.length === 0) return []
  const parts = [`    ${name.padEnd(9)} expected ${setText(expected)}`]
  if (missing.length > 0) parts.push(`missing ${setText(missing)}`)
  if (extra.length > 0) parts.push(`unexpected ${setText(extra)}`)
  return [parts.join(', ')]
}

/** Runs one synthetic project and checks its verdicts against expected.json. */
async function checkProject(dir: string): Promise<string[]> {
  const expected = JSON.parse(
    readFileSync(join(dir, 'expected.json'), 'utf8'),
  ) as Expected
  const outDir = join(ROOT, 'out', 'semantic', basename(dir))
  const meta = await runAll({
    input: { kind: 'project', dir },
    outDir,
    rulesDir: RULES_DIR,
    cacheDir: CACHE_DIR,
  })
  const failedUnits = meta.units.filter((u) => u.status !== 'ok')
  if (failedUnits.length > 0)
    return failedUnits.map(
      (u) => `    unit ${u.unit} failed: ${(u.error ?? '').split('\n')[0]}`,
    )
  const { address, variable } = expected.target
  // the variable may be given bare ("score") or as its symbol ("Playground.sol:Playground.score")
  const at = (row: string[], i: number, j: number) =>
    row[i] === address &&
    (row[j] === variable || (row[j] ?? '').endsWith(`.${variable}`))

  // every discovered address is an actor, and "outsider" stands for every other address
  const universe = new Set([
    ...readRelation(outDir, 'dEntry').map((r) => r[0] ?? ''),
    'outsider',
  ])
  const can = new Set(
    readRelation(outDir, 'canChange')
      .filter((r) => at(r, 1, 2))
      .map((r) => r[0] ?? ''),
  )
  const cannot = new Set(
    readRelation(outDir, 'cannotChange')
      .filter((r) => at(r, 1, 2))
      .map((r) => r[0] ?? ''),
  )
  const residuals = new Set(
    readRelation(outDir, 'unknownChange')
      .filter((r) => at(r, 0, 1))
      .map((r) => r[5] ?? ''),
  )
  const bare = (v: string) => v.replace(/^[^:]*:/, '').replace(/^[^.]*\./, '')
  const indirect = new Set(
    readRelation(outDir, 'indirectlyCanChange')
      .filter((r) => at(r, 1, 2))
      .map((r) => `${r[0]} ${r[3]} ${bare(r[4] ?? '')}`),
  )
  // every discovered address is an actor; what is neither admitted nor excluded is unknown
  const unknown = new Set(
    [...universe].filter((a) => !can.has(a) && !cannot.has(a)),
  )

  const wantCan = new Set(expected.can)
  const others = (explicit: string[] | 'all-others') =>
    new Set(
      [...universe].filter(
        (a) =>
          !wantCan.has(a) &&
          (explicit === 'all-others' || !explicit.includes(a)),
      ),
    )
  if (expected.cannot === 'all-others' && expected.unknown === 'all-others')
    return ['    expected.json: cannot and unknown cannot both be "all-others"']
  const wantCannot =
    expected.cannot === 'all-others'
      ? others(expected.unknown)
      : new Set(expected.cannot)
  const wantUnknown =
    expected.unknown === 'all-others'
      ? others(expected.cannot)
      : new Set(expected.unknown)
  const wantIndirect = new Set(
    (expected.indirect ?? []).map(
      (i) => `${i.actor} ${i.address} ${i.variable}`,
    ),
  )

  const problems: string[] = []
  if (
    !existsSync(join(outDir, 'derived', 'canChange.csv')) &&
    !existsSync(join(outDir, 'facts', 'canChange.facts'))
  )
    problems.push('    no verdict stage: derived/canChange.csv is missing')
  if (wantCan.has('anyone')) {
    // an open write: the concrete admits next to "anyone" are not prescribed
    if (!can.has('anyone'))
      problems.push(`    can       expected anyone, got ${setText(can)}`)
    problems.push(...compareSets('cannot', new Set(), cannot))
  } else {
    problems.push(...compareSets('can', wantCan, can))
    problems.push(...compareSets('cannot', wantCannot, cannot))
    problems.push(...compareSets('unknown', wantUnknown, unknown))
  }
  problems.push(
    ...compareSets('residuals', new Set(expected.residuals), residuals),
  )
  problems.push(...compareSets('indirect', wantIndirect, indirect))
  return problems
}

function listFixtureProjects(): string[] {
  if (!existsSync(LOCAL_PROJECTS_DIR)) return []
  return readdirSync(LOCAL_PROJECTS_DIR)
    .map((d) => join(LOCAL_PROJECTS_DIR, d))
    .filter(
      (d) =>
        existsSync(join(d, 'expected.json')) &&
        existsSync(join(d, 'discovered.json')),
    )
    .sort()
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const runFlag = args.indexOf('--run')
  const runDir = runFlag >= 0 ? resolve(args[runFlag + 1] ?? '') : undefined
  const filters = args.filter(
    (a, i) => !a.startsWith('--') && (runFlag < 0 || i !== runFlag + 1),
  )
  const selected = (name: string) =>
    filters.length === 0 || filters.some((f) => name.includes(f))
  let failed = 0

  // 1. unit fixtures
  for (const file of readdirSync(FIXTURES_DIR)
    .filter((f) => f.endsWith('.sol'))
    .sort()) {
    const name = basename(file, '.sol')
    if (!selected(name)) continue
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
    const relations = readdirSync(expectedDir)
      .filter((f) => f.endsWith('.tsv'))
      .map((f) => basename(f, '.tsv'))
      .sort()
    for (const relation of relations) {
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

  // 2. synthetic projects with an expected verdict
  for (const dir of listFixtureProjects()) {
    const name = basename(dir)
    if (!selected(name)) continue
    const problems = await checkProject(dir)
    if (problems.length === 0) console.log(`ok   ${name}: verdicts as expected`)
    else {
      failed++
      console.log(`FAIL ${name}: ${problems.length} difference(s)`)
      for (const p of problems) console.log(p)
    }
  }

  // 3. promoted rules against a run
  const proposedDir = join(ROOT, 'expected', 'proposed')
  if (runDir && existsSync(proposedDir)) {
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
  if (runDir) {
    const stray = listQueries(runDir)
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
