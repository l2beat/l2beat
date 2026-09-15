// Reviewed expectations: expected/<example>/<relation>.tsv holds the rows a person checked by hand.
// `qf test` runs every example with such a folder at the top level and compares, row for row.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { join } from 'path'
import { maxLevel } from './levels'
import { EXPECTED_DIR } from './paths'
import { rowsOf, runExample } from './run'

export interface TestOutcome {
  example: string
  relation: string
  ok: boolean
  missing: string[]
  unexpected: string[]
}

function readExpected(path: string): string[] {
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((l) => l.length > 0)
    .sort()
}

export function expectedFile(example: string, relation: string): string {
  return join(EXPECTED_DIR, example, `${relation}.tsv`)
}

export function writeExpected(
  example: string,
  relation: string,
  rows: string[][],
): void {
  mkdirSync(join(EXPECTED_DIR, example), { recursive: true })
  const lines = rows.map((r) => r.join('\t')).sort()
  writeFileSync(
    expectedFile(example, relation),
    lines.length > 0 ? `${lines.join('\n')}\n` : '',
  )
}

export async function runTests(opts: {
  update?: boolean
  only?: string
}): Promise<TestOutcome[]> {
  if (!existsSync(EXPECTED_DIR)) return []
  const out: TestOutcome[] = []
  const level = maxLevel()
  for (const example of readdirSync(EXPECTED_DIR).sort()) {
    if (opts.only && example !== opts.only) continue
    const dir = join(EXPECTED_DIR, example)
    const files = readdirSync(dir).filter((f) => f.endsWith('.tsv'))
    if (files.length === 0) continue
    await runExample(example, level)
    for (const file of files.sort()) {
      const relation = file.replace(/\.tsv$/, '')
      const actual = rowsOf(example, level, relation)
      if (opts.update) writeExpected(example, relation, actual)
      const want = readExpected(join(dir, file))
      const got = actual.map((r) => r.join('\t')).sort()
      const wantSet = new Set(want)
      const gotSet = new Set(got)
      const missing = want.filter((r) => !gotSet.has(r))
      const unexpected = got.filter((r) => !wantSet.has(r))
      out.push({
        example,
        relation,
        ok: missing.length === 0 && unexpected.length === 0,
        missing,
        unexpected,
      })
    }
  }
  return out
}
