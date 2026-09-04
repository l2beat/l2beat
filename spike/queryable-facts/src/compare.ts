// Diffs two storage-writers reports: the Python analyzer's Markdown and this spike's report.md.
// Both use the same table shape, so the comparison is mechanical.
//
//   tsx src/compare.ts <analyzer.md> <report.md>

import { readFileSync } from 'fs'

interface Section {
  vars: Map<string, { slot: string; writers: Set<string> }>
  opaque: Set<string>
}

// Markdown cells escape "|" as "\|"; swap it for a placeholder before splitting on "|".
const ESCAPED_PIPE = '<<PIPE>>'
const strip = (cell: string): string => cell.replace(/`/g, '').trim()
const kindOf = (detail: string): string =>
  detail.includes('delegatecall')
    ? 'delegatecall'
    : detail.includes('sstore')
      ? 'sstore'
      : detail

function parse(markdown: string): Map<string, Section> {
  const out = new Map<string, Section>()
  let contract: string | undefined
  let mode: 'vars' | 'opaque' | undefined
  for (const raw of markdown.split('\n')) {
    const line = raw.replace(/\\\|/g, ESCAPED_PIPE)
    const heading = /^## (\S+) \((\d+) storage vars\)/.exec(line)
    if (heading?.[1]) {
      contract = heading[1]
      mode = 'vars'
      out.set(contract, { vars: new Map(), opaque: new Set() })
      continue
    }
    if (/^### Unnamed\/opaque writes in /.test(line)) {
      mode = 'opaque'
      continue
    }
    if (/^# /.test(line)) {
      contract = undefined
      mode = undefined
      continue
    }
    if (!contract || !mode || !line.startsWith('|')) continue
    if (/^\| (---|Variable|Function)/.test(line)) continue
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.split(ESCAPED_PIPE).join('|').trim())
    const section = out.get(contract)
    if (!section) continue
    if (mode === 'vars') {
      const [variable = '', slot = '', , writers = ''] = cells
      const set = new Set(
        writers === '_no writers_'
          ? []
          : [...writers.matchAll(/`([^`]+)`/g)].map((m) => m[1] ?? ''),
      )
      section.vars.set(strip(variable), { slot, writers: set })
    } else {
      const [fn = '', detail = '', location = ''] = cells
      section.opaque.add(
        `${strip(fn)} | ${kindOf(detail)} | ${strip(location)}`,
      )
    }
  }
  return out
}

function diffSets(
  a: Set<string>,
  b: Set<string>,
): { onlyA: string[]; onlyB: string[] } {
  return {
    onlyA: [...a].filter((x) => !b.has(x)).sort(),
    onlyB: [...b].filter((x) => !a.has(x)).sort(),
  }
}

function main(): void {
  const [analyzerPath, reportPath] = process.argv.slice(2)
  if (!analyzerPath || !reportPath) {
    throw new Error('usage: compare.ts <analyzer.md> <report.md>')
  }
  const analyzer = parse(readFileSync(analyzerPath, 'utf8'))
  const report = parse(readFileSync(reportPath, 'utf8'))
  const contracts = new Set([...analyzer.keys(), ...report.keys()])
  let differences = 0
  let vars = 0
  let opaque = 0
  const say = (msg: string) => {
    differences++
    console.log(`DIFF ${msg}`)
  }
  for (const C of [...contracts].sort()) {
    const a = analyzer.get(C)
    const b = report.get(C)
    if (!a || !b) {
      const present = a ?? b
      if (present && present.vars.size === 0 && present.opaque.size === 0) {
        // An empty section makes no claims (e.g. an abstract contract the analyzer lists, or a proxy without storage).
        console.log(
          `NOTE ${C}: empty section only in ${a ? 'analyzer' : 'souffle'}`,
        )
      } else {
        say(`${C}: only in ${a ? 'analyzer' : 'souffle'}`)
      }
      continue
    }
    for (const V of new Set([...a.vars.keys(), ...b.vars.keys()])) {
      const va = a.vars.get(V)
      const vb = b.vars.get(V)
      if (!va || !vb) {
        say(`${C} ${V}: only in ${va ? 'analyzer' : 'souffle'}`)
        continue
      }
      vars++
      if (va.slot !== vb.slot) {
        say(`${C} ${V}: slot analyzer=${va.slot} souffle=${vb.slot}`)
      }
      const { onlyA, onlyB } = diffSets(va.writers, vb.writers)
      if (onlyA.length > 0 || onlyB.length > 0) {
        say(
          `${C} ${V}: writers only-analyzer=[${onlyA.join(', ')}] only-souffle=[${onlyB.join(', ')}]`,
        )
      }
    }
    const { onlyA, onlyB } = diffSets(a.opaque, b.opaque)
    opaque += a.opaque.size
    for (const o of onlyA) say(`${C} opaque only-analyzer: ${o}`)
    for (const o of onlyB) say(`${C} opaque only-souffle: ${o}`)
  }
  console.log(
    differences === 0
      ? `MATCH: ${contracts.size} contract(s), ${vars} storage variables, ${opaque} opaque sites agree`
      : `${differences} DIFFERENCE(S) across ${contracts.size} contract(s)`,
  )
}

main()
