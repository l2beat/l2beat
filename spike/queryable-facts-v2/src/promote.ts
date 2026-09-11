// Promotion: a query an agent wrote becomes part of the library. The rules are appended to the
// proposed-rules file of the right stage (composition → project stage, interpretation → unit stage)
// under a comment that says what they mean and which ask they came from, and the rows the query
// derived on that run are kept as expected tuples (expected/proposed/<relation>.tsv) so a later run
// can tell when the rule's meaning drifts.

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { join } from 'path'
import { ROOT, RULES_DIR, runDirOf } from './paths'
import { parseProgram } from './program'
import { listQueries } from './query'

export const PROPOSED_UNIT = '2-proposed-unit.dl'
export const PROPOSED_PROJECT = '4-proposed.dl'

export interface PromoteResult {
  file: string
  relation: string
  expected: string
  rows: number
}

export function promote(req: {
  id: string
  ask: string
  query: string
  relation: string
  description: string
}): PromoteResult {
  if (!/^\d+$/.test(req.ask)) throw new Error('bad ask')
  if (!/^[\w.-]+$/.test(req.query)) throw new Error('bad query name')
  if (!/^\w+$/.test(req.relation)) throw new Error('bad relation')
  const runDir = runDirOf(req.id)
  const askDir = join(runDir, 'asks', req.ask)
  const q = listQueries(askDir).find((x) => x.name === req.query)
  if (!q) throw new Error(`unknown query ${req.query}`)
  if (!q.declared.some((d) => d.name === req.relation))
    throw new Error(`${req.query} does not declare ${req.relation}`)
  const text = readFileSync(join(q.dir, 'query.dl'), 'utf8')
  const program = parseProgram(text)
  const file = q.level === 'unit' ? PROPOSED_UNIT : PROPOSED_PROJECT
  const path = join(RULES_DIR, file)
  const existing = existsSync(path) ? readFileSync(path, 'utf8') : ''
  const already = new Set(
    [...existing.matchAll(/^\.decl\s+(\w+)\s*\(/gm)].map((m) => m[1] ?? ''),
  )
  const clash = q.declared.filter((d) => already.has(d.name))
  if (clash.length > 0)
    throw new Error(
      `already in the library: ${clash.map((d) => d.name).join(', ')} (rename the relation first)`,
    )
  const body = program.items
    .filter((i) => i.kind === 'decl' || i.kind === 'clause')
    .map((i) =>
      i.kind === 'decl'
        ? `.decl ${i.relation}(${i.columns.map((c) => `${c.name}: ${c.type}`).join(', ')})`
        : i.text,
    )
    .join('\n')
  const description = req.description
    .trim()
    .split('\n')
    .map((l) => `// ${l}`)
    .join('\n')
  appendFileSync(
    path,
    `\n${description}\n// Promoted from run ${req.id}, ask ${req.ask}, query ${req.query} (${q.classification}).\n${body}\n`,
  )
  const expectedDir = join(ROOT, 'expected', 'proposed')
  mkdirSync(expectedDir, { recursive: true })
  const rows = (q.rows[req.relation] ?? []).map((r) => r.join('\t')).sort()
  const expected = join(expectedDir, `${req.relation}.tsv`)
  writeFileSync(
    expected,
    `# ${req.relation}: rows derived on run ${req.id} when the rule was promoted; a later run of the same input should derive them too\n${rows.join('\n')}${rows.length > 0 ? '\n' : ''}`,
  )
  return {
    file,
    relation: req.relation,
    expected: `expected/proposed/${req.relation}.tsv`,
    rows: rows.length,
  }
}
