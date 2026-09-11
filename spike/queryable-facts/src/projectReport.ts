// Renders the project relations as report.md: the deployed contracts and their code, the actors, who can
// change which variable of which contract (with the paths through Safes, modules and admins), the
// cross-contract calls, discovery's permissions against the derived ones, and the gaps.

import type { Project } from './discovery'
import type { Facts } from './emit'
import type { UnitRunSummary } from './project'

export interface ProjectReportInput {
  project: Project
  units: UnitRunSummary[]
  derived: Map<string, string[][]>
  discovery: Facts
}

function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

/** `<unit>:Contract.f(uint256)` → `Contract.f(uint256)`, given the unit names in play. */
export function makeLabel(units: string[]) {
  const prefixes = [...units].sort((a, b) => b.length - a.length)
  return (id: string): string => {
    for (const u of prefixes)
      if (id.startsWith(`${u}:`)) return id.slice(u.length + 1)
    return id
  }
}

export function shortAddress(a: string): string {
  const m = /^(?:[a-z0-9]+:)?(0x[0-9a-fA-F]{40})$/.exec(a)
  if (!m?.[1]) return a
  return `${m[1].slice(0, 6)}…${m[1].slice(-4)}`
}

export interface PathPrinter {
  /** Human name of an address: discovery's name, or a short address. */
  who: (a: string) => string
  /** Every `eth:0x…` in a text replaced by its name. */
  named: (text: string) => string
  /** Complete paths from actors to (T, H), one per line, most direct first. */
  paths: (T: string, H: string, limit?: number) => string[]
}

/**
 * Walks `hop` backwards from an entry point to the actors that can reach it, then forwards from each
 * actor through the Safes whose signer it is. A path reads left to right:
 *   actor → (how it drives the next) → … → Contract.function [the check at the end, resolved].
 * EOA signers of one Safe are folded into one line ("k of n signers"); contract signers are followed.
 */
export function pathPrinter(
  derived: Map<string, string[][]>,
  label: (id: string) => string,
): PathPrinter {
  const names = new Map<string, string>()
  for (const [a = '', n = ''] of derived.get('deployed') ?? []) names.set(a, n)
  for (const [a = '', n = ''] of derived.get('eoa') ?? [])
    if (n) names.set(a, n)
  const eoas = new Set((derived.get('eoa') ?? []).map((r) => r[0] ?? ''))
  const who = (a: string) => {
    if (a === 'anyone') return 'anyone'
    const n = names.get(a)
    return n ? `${n} (${shortAddress(a)})` : shortAddress(a)
  }
  const named = (text: string) =>
    text.replace(/(?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}/g, (m) => who(m))
  // hop(A, T, H, Via, ViaEntry, How): the hops that end at (T, H)
  const hops = new Map<string, string[][]>()
  for (const row of derived.get('hop') ?? []) {
    const key = `${row[1]}\t${row[2]}`
    const list = hops.get(key) ?? []
    list.push(row)
    hops.set(key, list)
  }
  // acts(A, S, How, Tier): who drives a Safe
  const drivers = new Map<string, string[][]>()
  for (const row of derived.get('acts') ?? []) {
    const list = drivers.get(row[1] ?? '') ?? []
    list.push(row)
    drivers.set(row[1] ?? '', list)
  }

  /** Lines for "A passes (t, h) with How", expanded through the Safes A is a signer of. */
  const expandActor = (
    A: string,
    tail: string,
    seen: Set<string>,
    out: string[],
    limit: number,
  ) => {
    if (out.length >= limit) return
    const ds = drivers.get(A) ?? []
    if (ds.length === 0 || seen.has(A)) {
      out.push(`${who(A)}${tail}`)
      return
    }
    const eoaSigners = ds.filter(
      (d) => eoas.has(d[0] ?? '') || !names.has(d[0] ?? ''),
    )
    const contractSigners = ds.filter(
      (d) => !eoas.has(d[0] ?? '') && names.has(d[0] ?? ''),
    )
    const how = named(ds[0]?.[2] ?? 'signer')
    const threshold = /\((\d+) of (\d+)/.exec(how)
    const next = new Set(seen)
    next.add(A)
    if (eoaSigners.length > 0) {
      const k = threshold?.[1] ?? '?'
      out.push(
        `${k} of ${ds.length} signers of ${who(A)} (${eoaSigners.length} EOA${eoaSigners.length === 1 ? '' : 's'}${contractSigners.length > 0 ? `, ${contractSigners.length} contract${contractSigners.length === 1 ? '' : 's'}` : ''}) → ${who(A)}${tail}`,
      )
    }
    for (const d of contractSigners)
      expandActor(
        d[0] ?? '',
        ` → (${named(d[2] ?? '')}) → ${who(A)}${tail}`,
        next,
        out,
        limit,
      )
  }

  const paths = (T: string, H: string, limit = 12): string[] => {
    const out: string[] = []
    const seenLines = new Set<string>()
    const push = (line: string) => {
      if (!seenLines.has(line)) {
        seenLines.add(line)
        out.push(line)
      }
    }
    const walk = (
      t: string,
      h: string,
      suffix: string,
      visited: Set<string>,
    ) => {
      if (out.length >= limit) return
      const here = ` → ${who(t)}.${label(h)}`
      const rows = hops.get(`${t}\t${h}`) ?? []
      // Direct hops that differ only in the address (13 owners passing `owners[msg.sender] != 0`) fold into one line.
      const groups = new Map<string, string[]>()
      for (const [A = '', , , Via = '', , How = ''] of rows) {
        if (Via !== '') continue
        const key = How.replace(/(?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}/g, '*')
        const list = groups.get(key) ?? []
        list.push(A)
        groups.set(key, list)
      }
      for (const [A = '', , , Via = '', ViaEntry = '', How = ''] of rows) {
        if (Via === '') {
          const key = How.replace(/(?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}/g, '*')
          const group = groups.get(key) ?? []
          const plain = group.filter((a) => !drivers.get(a)?.length)
          if (group.length > 3 && plain.includes(A)) {
            if (plain[0] === A)
              push(
                `${plain.length} addresses (${plain.map((a) => who(a)).join(', ')})${here} [${How.replace(/= (?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}/, '= each of them')}]${suffix}`,
              )
            continue
          }
          const lines: string[] = []
          expandActor(
            A,
            `${here} [${named(How)}]${suffix}`,
            new Set(),
            lines,
            limit,
          )
          for (const l of lines) push(l)
          continue
        }
        if (ViaEntry === '') continue // signer hops: folded into expandActor above
        const key = `${Via}\t${ViaEntry}`
        if (visited.has(key)) continue
        const v = new Set(visited)
        v.add(key)
        walk(Via, ViaEntry, ` → (${named(How)})${here}${suffix}`, v)
      }
    }
    walk(T, H, '', new Set([`${T}\t${H}`]))
    return out.slice(0, limit)
  }
  return { who, named, paths }
}

export function renderProjectReport({
  project,
  units,
  derived,
  discovery,
}: ProjectReportInput): string {
  const rel = (name: string) => derived.get(name) ?? []
  const unitNames = units.map((u) => u.unit)
  const label = makeLabel(unitNames)
  const { who, paths } = pathPrinter(derived, label)
  const name = (a: string) => {
    const d = rel('deployed').find((r) => r[0] === a)
    if (d) return d[1] ?? a
    const e = rel('eoa').find((r) => r[0] === a)
    return e?.[1] || shortAddress(a)
  }
  const code = (items: string[]) =>
    items.length === 0 ? '—' : items.map((i) => `\`${cell(i)}\``).join(', ')

  const lines: string[] = []
  const contracts = rel('deployed').sort((a, b) =>
    (a[1] ?? '').localeCompare(b[1] ?? ''),
  )
  const ok = units.filter((u) => u.status === 'ok').length
  lines.push(
    `# Project ${project.name}: ${contracts.length} contracts, ${rel('eoa').length} EOAs, ${units.length} flattened files (${ok} compiled)`,
    '',
    '_The unit pipeline ran once per flattened file; this report is what rules/project.dl derived from those',
    'results plus discovery\'s snapshot of the values (discovered.json). Every "who" below rests on a discovered',
    'value at one block and on a unit finding with its own tier; the tier of each hop is quoted._',
    '',
    '# Contracts and their code',
    '',
    '| Contract | Address | Proxy type | Code (unit) | Storage vars | Entry points |',
    '| --- | --- | --- | --- | --- | --- |',
  )
  for (const [addr = '', cname = '', ptype = ''] of contracts) {
    const codes = rel('codeOf')
      .filter((r) => r[0] === addr)
      .map(([, role = '', c = '']) => `${role}: ${label(c)}`)
    const vars = new Set(
      rel('storageAt')
        .filter((r) => r[0] === addr)
        .map((r) => r[1]),
    )
    const entries = new Set(
      rel('entryAt')
        .filter((r) => r[0] === addr)
        .map((r) => r[1]),
    )
    const gaps = rel('codeGap')
      .filter((r) => r[0] === addr)
      .map((r) => r[3] ?? '')
    lines.push(
      `| ${cell(cname)} | \`${addr}\` | ${cell(ptype)} | ${code(codes)}${gaps.length > 0 ? ` ⚠ ${cell(gaps.join('; '))}` : ''} | ${vars.size} | ${entries.size} |`,
    )
  }
  lines.push('')

  // actors
  lines.push('# Actors', '')
  const safes = rel('safe').map((r) => r[0] ?? '')
  if (safes.length > 0) {
    lines.push(
      '| Safe | Threshold | Signers | Modules |',
      '| --- | --- | --- | --- |',
    )
    for (const s of safes.sort((a, b) => name(a).localeCompare(name(b)))) {
      const members = rel('safeMember')
        .filter((r) => r[0] === s)
        .map((r) => who(r[1] ?? ''))
      const modules = rel('safeModule')
        .filter((r) => r[0] === s)
        .map((r) => who(r[1] ?? ''))
      const threshold =
        discovery
          .entries('dValue')
          .find((r) => r[0] === s && r[1] === '$threshold')?.[4] ?? '?'
      lines.push(
        `| ${cell(name(s))} | ${threshold} of ${members.length} | ${cell(members.join(', ')) || '—'} | ${cell(modules.join(', ')) || '—'} |`,
      )
    }
    lines.push('')
  }
  const eoas = rel('eoa').filter((r) => r[1] !== '')
  if (eoas.length > 0)
    lines.push(
      `Named EOAs: ${eoas.map(([a = '', n = '']) => `${n} (\`${a}\`)`).join(', ')}.`,
      '',
    )

  // who can change what
  lines.push(
    '# Who can change what',
    '',
    '_For each storage variable of each deployed contract: the entry points that may write it (from the unit',
    'pipeline, over-approximate), and for each entry point every path the rules found from an actor to it. A path',
    'reads left to right: the actor, the hops it goes through, the entry point, and in brackets the check at the end',
    'with the discovered value it resolved to. "anyone" means no sender or signature check was recognised._',
    '',
  )
  const writers = rel('mayWrite')
  const byContract = new Map<string, string[][]>()
  for (const r of writers) {
    const list = byContract.get(r[0] ?? '') ?? []
    list.push(r)
    byContract.set(r[0] ?? '', list)
  }
  for (const [addr = '', cname = ''] of contracts) {
    const rows = byContract.get(addr) ?? []
    const vars = [...new Set(rows.map((r) => r[1] ?? ''))].sort()
    if (vars.length === 0) continue
    lines.push(`## ${cname} (\`${shortAddress(addr)}\`)`, '')
    for (const v of vars) {
      const valueRows = rel('valueOf').filter(
        (r) => r[0] === addr && r[1] === v,
      )
      const value =
        valueRows.length === 0
          ? ''
          : valueRows.length === 1
            ? ` = \`${cell(valueRows[0]?.[3] ?? '')}\`${valueRows[0]?.[2] === 'address' ? ` (${cell(name(valueRows[0]?.[3] ?? ''))})` : ''}`
            : ` (${valueRows.length} values)`
      lines.push(`**\`${label(v)}\`**${value}`, '')
      const entries = [
        ...new Set(rows.filter((r) => r[1] === v).map((r) => r[2] ?? '')),
      ].sort()
      for (const h of entries) {
        const found = paths(addr, h, 8)
        const unreached = rel('writerUnreached').some(
          (r) => r[0] === addr && r[1] === v && r[2] === h,
        )
        lines.push(`- \`${label(h)}\``)
        if (found.length === 0) {
          const why = rel('unresolvedCheck')
            .filter((r) => r[0] === addr && r[1] === h)
            .map((r) => r[3] ?? '')
          lines.push(
            `  - _no known actor reaches it${unreached ? '' : ' directly'}_${why.length > 0 ? `: ${cell([...new Set(why)].join('; '))}` : ''}`,
          )
        }
        for (const p of found) lines.push(`  - ${cell(p)}`)
      }
      lines.push('')
    }
    const unknown = rel('unknownAt').filter((r) => r[0] === addr)
    if (unknown.length > 0) {
      lines.push('Unknown effects in this code (may touch any slot):', '')
      for (const [, e = '', , detail = ''] of unknown.slice(0, 12))
        lines.push(`- \`${label(e)}\`: ${cell(detail)}`)
      if (unknown.length > 12)
        lines.push(`- … ${unknown.length - 12} more (\`./qf rows unknownAt\`)`)
      lines.push('')
    }
  }

  // upgrades: the proxies' own administrative functions
  const upgrades = rel('proxyAdminFunction')
  if (upgrades.length > 0) {
    lines.push(
      '# Upgrades and proxy administration',
      '',
      "_The proxies' own functions change the implementation and admin slots, which the unit pipeline reports as",
      'stores to unresolved slots rather than as named variables. Discovery read those slots (`$admin`,',
      '`$implementation`); the proxy admits its admin, and the paths to the admin come from the rules._',
      '',
    )
    for (const [addr = '', cname = ''] of contracts) {
      const mine = upgrades
        .filter((r) => r[0] === addr)
        .map((r) => r[1] ?? '')
        .sort()
      if (mine.length === 0) continue
      lines.push(`## ${cname} (\`${shortAddress(addr)}\`)`, '')
      for (const h of mine) {
        const found = paths(addr, h, 6)
        lines.push(`- \`${label(h)}\``)
        if (found.length === 0) lines.push('  - _no known actor reaches it_')
        for (const p of found) lines.push(`  - ${cell(p)}`)
      }
      lines.push('')
    }
  }

  // cross-contract calls
  const calls = rel('crossCall')
  if (calls.length > 0) {
    lines.push(
      '# Calls between contracts',
      '',
      '_External calls whose receiver the rules could tie to a discovered address: state variables and getters holding',
      'another contract of the project ("resolved"), or a parameter where the caller picks the target and some contract',
      'admits this caller ("caller-chosen"). One row per (caller, entry point, target function)._',
      '',
      '| From | Entry point | To | Function | How |',
      '| --- | --- | --- | --- | --- |',
    )
    const seen = new Set<string>()
    for (const [from = '', e = '', to = '', h = '', , tier = ''] of calls.sort(
      (a, b) =>
        name(a[0] ?? '').localeCompare(name(b[0] ?? '')) ||
        (a[1] ?? '').localeCompare(b[1] ?? ''),
    )) {
      const key = `${from}\t${e}\t${to}\t${h}\t${tier}`
      if (seen.has(key)) continue
      seen.add(key)
      lines.push(
        `| ${cell(name(from))} | \`${label(e)}\` | ${cell(name(to))} | \`${label(h)}\` | ${tier} |`,
      )
    }
    lines.push('')
  }
  const relayed = rel('relayed')
  if (relayed.length > 0) {
    lines.push('Calls relayed through a Safe by a module:', '')
    for (const [mod = '', e = '', s = '', t = '', h = ''] of relayed)
      lines.push(
        `- ${cell(name(mod))}.\`${label(e)}\` makes ${cell(name(s))} call ${cell(name(t))}.\`${label(h)}\``,
      )
    lines.push('')
  }

  // discovery's permissions vs derived
  const checks = rel('permissionCheck')
  if (checks.length > 0) {
    const derivedCount = checks.filter((r) => r[4] === 'derived').length
    lines.push(
      "# Discovery's permission model, checked",
      '',
      `_discovered.json lists ${checks.length} received permissions (from templates and handlers). For ${derivedCount} of them the rules derive some call from the receiver to the granting contract; the rest are listed._`,
      '',
    )
    const rest = checks.filter((r) => r[4] !== 'derived')
    if (rest.length > 0) {
      lines.push(
        '| Receiver | Permission | Granted by | Role | Status |',
        '| --- | --- | --- | --- | --- |',
      )
      for (const [to = '', from = '', p = '', role = '', status = ''] of rest)
        lines.push(
          `| ${cell(name(to))} | ${p} | ${cell(name(from))} | ${cell(role)} | ${status} |`,
        )
      lines.push('')
    }
  }

  // gaps
  lines.push('# Gaps', '')
  const failed = units.filter((u) => u.status === 'failed')
  if (failed.length > 0) {
    lines.push(
      `- ${failed.length} unit(s) failed: ${failed.map((u) => `\`${u.unit}\` (${cell((u.error ?? '').split('\n')[0] ?? '')})`).join(', ')}`,
    )
  }
  if (project.missing.length > 0)
    lines.push(
      `- ${project.missing.length} code(s) without a flattened file: ${project.missing.map((m) => `${m.entryName} → ${m.contractName} (${m.expectedPath})`).join(', ')}`,
    )
  const unresolved = rel('unresolvedCheck')
  lines.push(
    `- ${unresolved.length} check(s) whose principal has no discovered value (\`./qf rows unresolvedCheck\`)`,
  )
  const callGaps = rel('crossCallGap')
  lines.push(
    `- ${callGaps.length} external call(s) whose target could not be resolved (\`./qf rows crossCallGap\`)`,
  )
  const unmatched = rel('unmatchedValue')
  lines.push(
    `- ${unmatched.length} discovered value(s) that match no state variable or getter of the code (handlers, events; \`./qf rows unmatchedValue\`)`,
  )
  const unknown = rel('unknownAt')
  lines.push(
    `- ${unknown.length} unknown effect(s) in the code, proxy forwarding excluded (\`./qf rows unknownAt\`)`,
  )
  lines.push('')
  return `${lines.join('\n')}\n`
}
