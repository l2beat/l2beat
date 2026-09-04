// Renders Soufflé's output relations the way the storage-writers analyzer prints its
// report, so the two can be diffed by eye, plus the claim table for the playground contract.

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

function readTsv(path: string): string[][] {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('\t'))
}

function code(items: string[]): string {
  if (items.length === 0) return '—'
  return items.map((i) => `\`${i.replace(/\|/g, '\\|')}\``).join(', ')
}

export interface ReportInput {
  unit: string
  factsDir: string
  derivedDir: string
}

export function renderReport({
  unit,
  factsDir,
  derivedDir,
}: ReportInput): string {
  const label = (id: string): string =>
    id.startsWith(`${unit}:`) ? id.slice(unit.length + 1) : id
  const fact = (name: string) => readTsv(join(factsDir, `${name}.facts`))
  const derived = (name: string) => readTsv(join(derivedDir, `${name}.csv`))

  const typeOf = new Map<string, string>()
  for (const [V, , , type] of fact('stateVariable'))
    typeOf.set(V ?? '', type ?? '?')
  const selectorOf = new Map<string, string>()
  for (const [F, , , , , , , sel] of fact('function'))
    selectorOf.set(F ?? '', sel ?? '')

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
  for (const [C = '', V = '', slot = '0'] of fact('storageSlot')) {
    if (!deployable.has(C)) continue
    let list = slots.get(C)
    if (!list) slots.set(C, (list = []))
    list.push({ V, slot: Number(slot) })
  }
  // opaqueWrites(C, E, F, Kind, Detail, Line)
  const opaque = derived('opaqueWrites')
  const targets = new Map<string, string[]>()
  for (const [K = '', V = ''] of derived('possibleTargets')) {
    const list = targets.get(K) ?? []
    list.push(label(V))
    targets.set(K, list)
  }

  for (const C of deployable) if (!slots.has(C)) slots.set(C, [])

  const lines: string[] = ['# Storage writers (Soufflé)', '']
  for (const C of [...slots.keys()].sort()) {
    const vars = (slots.get(C) ?? []).sort((a, b) => a.slot - b.slot)
    lines.push(`## ${label(C)} (${vars.length} storage vars)`, '')
    lines.push(
      '| Variable | Slot | Type | Writers |',
      '| --- | --- | --- | --- |',
    )
    for (const { V, slot } of vars) {
      const set = writers.get(C)?.get(V) ?? new Set<string>()
      const list = [...set]
        .map((E) =>
          E === 'constructor' ? `${label(C)}.constructor()` : label(E),
        )
        .sort((a, b) => {
          const ca = a.endsWith('.constructor()') ? 0 : 1
          const cb = b.endsWith('.constructor()') ? 0 : 1
          return ca - cb || a.localeCompare(b)
        })
      lines.push(
        `| \`${label(V)}\` | ${slot} | \`${typeOf.get(V) ?? '?'}\` | ${list.length > 0 ? code(list) : '_no writers_'} |`,
      )
    }
    const mine = opaque.filter((r) => r[0] === C)
    if (mine.length > 0) {
      lines.push('', `### Unnamed/opaque writes in ${label(C)}`, '')
      lines.push(
        '| Function | Detail | Location | Possible targets |',
        '| --- | --- | --- | --- |',
      )
      for (const [
        ,
        E = '',
        F = '',
        kind = '',
        detail = '',
        line = '',
        K = '',
      ] of mine.sort()) {
        const entry =
          E === 'constructor' ? `${label(C)}.constructor()` : label(E)
        const what =
          kind === 'assembly' && detail.startsWith('assembly without')
            ? detail
            : kind === 'assembly'
              ? `sstore to an unresolved slot (${detail})`
              : kind === 'storageRef'
                ? `write through a storage reference that resolves to no variable (${label(detail)})`
                : `${kind} may write arbitrary storage`
        lines.push(
          `| \`${entry}\` | ${what} | \`${label(F)}:${line}\` | ${code(targets.get(K) ?? [])} |`,
        )
      }
    }
    lines.push('')
  }

  // writeClaims(C, E, V, Claim, Trust, Line)
  const lineOf = new Map<string, number>()
  for (const [id = '', , line = '0'] of fact('sourceLoc'))
    lineOf.set(id, Number(line))
  const claims = derived('writeClaims')
  if (claims.length > 0) {
    lines.push(
      '# Write claims per entry point (syntactic v1 of `guardedBy`)',
      '',
    )
    lines.push(
      '| Contract | Entry point | Variable | Claim | Trust | Line |',
      '| --- | --- | --- | --- | --- | --- |',
    )
    const sorted = claims.sort((a, b) => {
      const la = lineOf.get(a[1] ?? '') ?? 0
      const lb = lineOf.get(b[1] ?? '') ?? 0
      return (
        la - lb ||
        (a[2] ?? '').localeCompare(b[2] ?? '') ||
        (a[3] ?? '').localeCompare(b[3] ?? '')
      )
    })
    for (const [
      C = '',
      E = '',
      V = '',
      claim = '',
      trust = '',
      line = '',
    ] of sorted) {
      lines.push(
        `| ${label(C)} | \`${label(E)}\` | \`${label(V)}\` | ${claim.replace(/\|/g, '\\|')} | ${trust} | ${line === '0' ? '' : line} |`,
      )
    }
    lines.push('')
  }

  // entryPoints(C, F)
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

  const unhandled = fact('unhandled')
  lines.push(
    unhandled.length === 0
      ? '_Extractor coverage: no unhandled AST constructs._'
      : `_Extractor coverage: ${unhandled.length} unhandled construct(s) — see facts/unhandled.facts._`,
  )
  return `${lines.join('\n')}\n`
}
