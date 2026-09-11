// Differential check against a v1 run: for every exported unit relation and every project relation,
// the rows of a v2 run must equal the rows v1 derived (same rules, same ids). Prints the differences.
//
//   tsx src/compare.ts <v2 run dir> <v1 project run dir>

import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { loadRun, runLibrary } from './pipeline'

function rows(path: string): Set<string> {
  if (!existsSync(path)) return new Set()
  return new Set(
    readFileSync(path, 'utf8')
      .split('\n')
      .filter((l) => l.length > 0),
  )
}

function diff(name: string, a: Set<string>, b: Set<string>): number {
  const onlyA = [...a].filter((r) => !b.has(r))
  const onlyB = [...b].filter((r) => !a.has(r))
  if (onlyA.length === 0 && onlyB.length === 0) return 0
  console.log(
    `  ${name}: ${onlyA.length} only in v2, ${onlyB.length} only in v1`,
  )
  for (const r of onlyA.slice(0, 3))
    console.log(`    + ${r.replace(/\t/g, ' ⇥ ')}`)
  for (const r of onlyB.slice(0, 3))
    console.log(`    - ${r.replace(/\t/g, ' ⇥ ')}`)
  return onlyA.length + onlyB.length
}

const [v2, v1] = process.argv.slice(2)
if (!v2 || !v1) throw new Error('usage: compare <v2 run> <v1 run>')
const meta = loadRun(v2)
const lib = runLibrary(v2)
let problems = 0
let compared = 0
for (const u of meta.units) {
  if (u.status !== 'ok') continue
  const v1dir = join(v1, 'units', u.slug, 'derived')
  if (!existsSync(v1dir)) {
    console.log(`  ${u.slug}: no v1 unit run`)
    continue
  }
  for (const rel of lib.exported) {
    compared++
    problems += diff(
      `${u.slug}/${rel}`,
      rows(join(v2, 'units', u.slug, 'derived', `${rel}.csv`)),
      rows(join(v1dir, `${rel}.csv`)),
    )
  }
}
for (const f of readdirSync(join(v1, 'derived')).filter((f) =>
  f.endsWith('.csv'),
)) {
  compared++
  problems += diff(
    `project/${f}`,
    rows(join(v2, 'derived', f)),
    rows(join(v1, 'derived', f)),
  )
}
console.log(`${compared} relations compared, ${problems} differing rows`)
process.exitCode = problems > 0 ? 1 : 0
