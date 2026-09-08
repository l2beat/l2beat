// Renders Soufflé's output relations as report.md: the storage-writers table (in the shape of the
// Python analyzer's, so the two can be diffed), the unknown effects per contract, and the findings
// per entry point with their tier.

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

function readTsv(path: string): string[][] {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('\t'))
}

function cell(text: string): string {
  return text.replace(/\|/g, '\\|')
}

function code(items: string[]): string {
  if (items.length === 0) return '—'
  return items.map((i) => `\`${cell(i)}\``).join(', ')
}

export interface ReportInput {
  unit: string
  /** Soufflé's output folder: concept relations (stateVariable, function, storageSlot, ...) live there too. */
  derivedDir: string
}

export const TIER_LEGEND =
  'structural (read off the syntax tree) · may (over-approximation: paths that can never run are included) · ' +
  'guaranteed (every completing execution, under the model: structured control flow, internal calls resolved, ' +
  'no unknown effect on the path) · heuristic (pattern-based: path coverage from straight-line position, ' +
  '"no check" relative to what the rules recognise) · unknown (an effect the analysis cannot follow)'

export function renderReport({ unit, derivedDir }: ReportInput): string {
  const label = (id: string): string =>
    id.startsWith(`${unit}:`) ? id.slice(unit.length + 1) : id
  const derived = (name: string) => readTsv(join(derivedDir, `${name}.csv`))
  const entryLabel = (C: string, E: string): string =>
    E === 'constructor' ? `${label(C)}.constructor()` : label(E)

  const typeOf = new Map<string, string>()
  for (const [V, , , type] of derived('stateVariable'))
    typeOf.set(V ?? '', type ?? '?')
  const selectorOf = new Map<string, string>()
  for (const [F, , , , , , , sel] of derived('function'))
    selectorOf.set(F ?? '', sel ?? '')
  const lineOf = new Map<string, number>()
  for (const [id = '', , line = '0'] of derived('sourceLoc'))
    lineOf.set(id, Number(line))
  const principals = new Map<string, string[]>()
  for (const [X = '', P = ''] of derived('checkPrincipal')) {
    const list = principals.get(X) ?? []
    list.push(label(P))
    principals.set(X, list)
  }
  const targets = new Map<string, string[]>()
  for (const [K = '', V = ''] of derived('possibleTargets')) {
    const list = targets.get(K) ?? []
    list.push(label(V))
    targets.set(K, list)
  }

  // storageWriters(C, V, Slot, E)
  const writers = new Map<string, Map<string, Set<string>>>()
  for (const [C = '', V = '', , E = ''] of derived('storageWriters')) {
    let perVar = writers.get(C)
    if (!perVar) writers.set(C, (perVar = new Map()))
    let set = perVar.get(V)
    if (!set) perVar.set(V, (set = new Set()))
    set.add(E)
  }
  // storageSlot(C, V, Slot, Offset) — every storage variable of every deployable contract
  const deployable = new Set(derived('deployable').map((r) => r[0] ?? ''))
  const slots = new Map<string, Array<{ V: string; slot: number }>>()
  for (const [C = '', V = '', slot = '0'] of derived('storageSlot')) {
    if (!deployable.has(C)) continue
    let list = slots.get(C)
    if (!list) slots.set(C, (list = []))
    list.push({ V, slot: Number(slot) })
  }
  for (const C of deployable) if (!slots.has(C)) slots.set(C, [])

  // finding(C, E, V, Kind, Detail, Tier, Evidence)
  interface Finding {
    C: string
    E: string
    V: string
    kind: string
    detail: string
    tier: string
    evidence: string
  }
  const findings: Finding[] = derived('finding').map(
    ([
      C = '',
      E = '',
      V = '',
      kind = '',
      detail = '',
      tier = '',
      evidence = '',
    ]) => ({
      C,
      E,
      V,
      kind,
      detail,
      tier,
      evidence,
    }),
  )
  const unknownFindings = findings.filter((f) => f.tier === 'unknown')
  // assembly(A, F, HasYul): which function an assembly block sits in, for the grouped caveat rows
  const assemblyIn = new Map<string, string>()
  for (const [A = '', F = ''] of derived('assembly')) assemblyIn.set(A, F)

  const lines: string[] = [
    '# Storage writers (may write)',
    '',
    '_Entry points that may change each variable, through any chain of internal calls, modifiers and',
    'library calls (over-approximate by design: a path that can never run still counts). Effects the',
    'rules cannot follow are listed under each contract as unknown effects; they may touch any slot._',
    '',
  ]
  for (const C of [...slots.keys()].sort()) {
    const vars = (slots.get(C) ?? []).sort((a, b) => a.slot - b.slot)
    lines.push(`## ${label(C)} (${vars.length} storage vars)`, '')
    lines.push(
      '| Variable | Slot | Type | May be written by |',
      '| --- | --- | --- | --- |',
    )
    for (const { V, slot } of vars) {
      const set = writers.get(C)?.get(V) ?? new Set<string>()
      const list = [...set]
        .map((E) => entryLabel(C, E))
        .sort((a, b) => {
          const ca = a.endsWith('.constructor()') ? 0 : 1
          const cb = b.endsWith('.constructor()') ? 0 : 1
          return ca - cb || a.localeCompare(b)
        })
      lines.push(
        `| \`${label(V)}\` | ${slot} | \`${typeOf.get(V) ?? '?'}\` | ${list.length > 0 ? code(list) : '_no writers_'} |`,
      )
    }
    const mine = unknownFindings
      .filter((f) => f.C === C)
      .sort(
        (a, b) =>
          (lineOf.get(a.E) ?? 0) - (lineOf.get(b.E) ?? 0) ||
          a.E.localeCompare(b.E) ||
          (lineOf.get(a.evidence) ?? 0) - (lineOf.get(b.evidence) ?? 0),
      )
    if (mine.length > 0) {
      lines.push('', `### Unknown effects in ${label(C)}`, '')
      lines.push(
        '| Entry point | What | Line | Possible targets |',
        '| --- | --- | --- | --- |',
      )
      for (const f of mine.filter((f) => f.kind !== 'assembly')) {
        lines.push(
          `| \`${entryLabel(C, f.E)}\` | ${cell(f.detail)} | ${lineOf.get(f.evidence) ?? ''} | ${code(targets.get(f.evidence) ?? [])} |`,
        )
      }
      // one row per entry point for the assembly caveat, listing the blocks it reaches
      const asmByEntry = new Map<string, string[]>()
      for (const f of mine.filter((f) => f.kind === 'assembly')) {
        const list = asmByEntry.get(f.E) ?? []
        list.push(
          `\`${label(assemblyIn.get(f.evidence) ?? f.evidence)}\` L${lineOf.get(f.evidence) ?? '?'}`,
        )
        asmByEntry.set(f.E, list)
      }
      for (const [E, blocks] of asmByEntry) {
        lines.push(
          `| \`${entryLabel(C, E)}\` | reaches inline assembly that writes storage, in ${blocks.join(', ')}: its slots were named, but nothing universal is guaranteed past it | | — |`,
        )
      }
    }
    lines.push('')
  }

  const rest = findings.filter((f) => f.tier !== 'unknown')
  if (rest.length > 0) {
    lines.push(
      '# Findings per entry point',
      '',
      '_What the rules found on the way from each entry point to each variable it may write. The',
      'condition is quoted as written, so a `!=` is visible: naming what the sender is compared with is',
      'not a statement that the comparison grants access._',
      '',
      `_Tiers: ${TIER_LEGEND}._`,
      '',
    )
    lines.push(
      '| Entry point | Variable | Finding | Tier | Compares with | Line |',
      '| --- | --- | --- | --- | --- | --- |',
    )
    const sorted = rest.sort(
      (a, b) =>
        (lineOf.get(a.E) ?? 0) - (lineOf.get(b.E) ?? 0) ||
        a.E.localeCompare(b.E) ||
        a.V.localeCompare(b.V) ||
        (lineOf.get(a.evidence) ?? 0) - (lineOf.get(b.evidence) ?? 0) ||
        a.kind.localeCompare(b.kind),
    )
    for (const f of sorted) {
      const line = f.evidence === '' ? '' : String(lineOf.get(f.evidence) ?? '')
      const variable =
        f.V === '*' ? '_any (unknown effect)_' : `\`${label(f.V)}\``
      lines.push(
        `| \`${entryLabel(f.C, f.E)}\` | ${variable} | ${cell(f.detail)} | ${f.tier} | ${code(principals.get(f.evidence) ?? [])} | ${line} |`,
      )
    }
    lines.push('')
  }

  // entryPoint(C, F)
  const entries = derived('entryPoint')
  if (entries.length > 0) {
    lines.push('# Entry points', '')
    lines.push('| Contract | Function | Selector |', '| --- | --- | --- |')
    for (const [C = '', F = ''] of entries.sort()) {
      lines.push(
        `| ${label(C)} | \`${label(F)}\` | \`${selectorOf.get(F) ?? ''}\` |`,
      )
    }
    lines.push('')
  }

  const unhandled = derived('unhandled')
  const unknownSites = new Set(
    unknownFindings
      .filter((f) => f.kind === 'unknown-effect')
      .map((f) => f.evidence),
  ).size
  lines.push(
    `_Coverage — analysis: ${
      unknownSites === 0
        ? 'every call and write on the way from an entry point was followed'
        : `${unknownSites} unknown effect${unknownSites === 1 ? '' : 's'} the rules could not follow (listed above)`
    }. Extractor: ${
      unhandled.length === 0
        ? 'no unhandled AST constructs'
        : `${unhandled.length} unhandled construct(s) — see derived/unhandled.csv`
    }._`,
  )
  return `${lines.join('\n')}\n`
}
