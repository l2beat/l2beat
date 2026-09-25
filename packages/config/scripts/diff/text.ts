import { type Difference, diff } from '@l2beat/shared'
import { formatJson } from '@l2beat/shared-pure'
import { diffWords } from 'diff'
import type { Project } from './types'

export function diffsToText(props: {
  projectsBefore: Project[]
  projectsAfter: Project[]
  commitBefore: string
  commitAfter: string
}) {
  const reports = pairProjects(props.projectsBefore, props.projectsAfter)
    .map(reportProject)
    .filter((report) => report.lines.length > 0)

  const added = reports.filter((r) => r.type === 'added').length
  const removed = reports.filter((r) => r.type === 'removed').length
  const modified = reports.length - added - removed

  return [
    `# Config diff: ${props.commitBefore.slice(0, 8)} (main) -> ${props.commitAfter.slice(0, 8)} (PR)`,
    '',
    'Every project row of the config database is compared structurally.',
    'Paths are dotted JSON paths; array elements are addressed by a key like [name=X] when one exists, else by index.',
    '"~ path: old -> new" is a changed value, "+ path: value" was added, "- path: value" was removed.',
    'Long strings show only changed words: [-removed-] {+added+}, with "..." for skipped words.',
    '',
    `## Summary: ${plural(reports.length, 'project')} (${added} added, ${removed} removed, ${modified} modified)`,
    '',
    '| project | change | what changed |',
    '| --- | --- | --- |',
    ...reports.map((r) => `| ${r.id} | ${r.type} | ${r.summary} |`),
    '',
    ...reports.flatMap((r) => [
      `## ${r.id} [${r.type.toUpperCase()}]`,
      '',
      ...r.lines,
    ]),
  ].join('\n')
}

interface ProjectPair {
  id: string
  before: Project | undefined
  after: Project | undefined
}

interface ProjectReport {
  id: string
  type: 'added' | 'removed' | 'modified'
  summary: string
  lines: string[]
}

function pairProjects(before: Project[], after: Project[]): ProjectPair[] {
  const beforeMap = new Map(before.map((p) => [p.id, p]))
  const afterMap = new Map(after.map((p) => [p.id, p]))
  const ids = [...new Set([...beforeMap.keys(), ...afterMap.keys()])].sort()
  return ids.map((id) => ({
    id,
    before: beforeMap.get(id),
    after: afterMap.get(id),
  }))
}

function reportProject(pair: ProjectPair): ProjectReport {
  if (pair.before === undefined) {
    assertDefined(pair.after)
    return wholeProject(pair.after, 'added')
  }
  if (pair.after === undefined) {
    return wholeProject(pair.before, 'removed')
  }

  const summary: string[] = []
  const lines: string[] = []

  const rediscovered = rediscoveredLine(pair.before, pair.after)
  if (rediscovered !== undefined) {
    summary.push('rediscovered')
    lines.push(rediscovered, '')
  }

  const updates = discoveryUpdateLines(pair.before, pair.after)
  if (updates.length > 0) {
    summary.push(`${plural(updates.length, 'discovery update')}`)
    lines.push('### discoveryUpdates', '', ...updates, '')
  }

  const fields = new Set([
    ...Object.keys(pair.before),
    ...Object.keys(pair.after),
  ])
  for (const field of [...fields].sort()) {
    const changes = fieldChanges(
      field,
      pair.before[field],
      pair.after[field],
      rediscovered !== undefined,
    )
    if (changes.length === 0) {
      continue
    }
    summary.push(`${field} (${changes.length})`)
    lines.push(`### ${field} (${plural(changes.length, 'change')})`, '')
    for (const change of changes) {
      lines.push(
        ...renderChange(field, change, pair.before[field], pair.after[field]),
      )
    }
    lines.push('')
  }

  return { id: pair.id, type: 'modified', summary: summary.join(', '), lines }
}

function wholeProject(
  project: Project,
  type: 'added' | 'removed',
): ProjectReport {
  const fields = Object.entries(project).filter(
    ([field, value]) => field !== 'id' && value !== null,
  )
  const prefix = type === 'added' ? '+' : '-'
  const lines = fields.flatMap(([field, value]) => [
    `${prefix} ${field}:`,
    ...indent(formatJson(value, { indentSize: 2, lineSize: 100 })),
    '',
  ])
  return {
    id: project.id,
    type,
    summary: fields.map(([field]) => field).join(', '),
    lines,
  }
}

function fieldChanges(
  field: string,
  before: unknown,
  after: unknown,
  rediscovered: boolean,
): Difference[] {
  if (field === 'discoveryUpdates') {
    return []
  }
  return diff(before, after).filter((change) => {
    const path = `${field}.${change.path.join('.')}`
    return !(rediscovered && path === 'discoveryInfo.baseTimestamp')
  })
}

function rediscoveredLine(before: Project, after: Project) {
  const stampBefore = getPath(before, ['discoveryInfo', 'baseTimestamp'])
  const stampAfter = getPath(after, ['discoveryInfo', 'baseTimestamp'])
  if (stampBefore === stampAfter) {
    return undefined
  }
  if (typeof stampBefore !== 'number' || typeof stampAfter !== 'number') {
    return undefined
  }
  return `Rediscovered: ${isoDate(stampBefore)} -> ${isoDate(stampAfter)}`
}

interface DiscoveryUpdate {
  id: string
  timestamp: number | null
  description: string
  isHighSeverity: boolean
  changeCount: number
  raw: Record<string, unknown>
}

function discoveryUpdateLines(before: Project, after: Project): string[] {
  const entriesBefore = discoveryUpdates(before)
  const entriesAfter = discoveryUpdates(after)
  const byIdBefore = new Map(entriesBefore.map((e) => [e.id, e]))
  const byIdAfter = new Map(entriesAfter.map((e) => [e.id, e]))

  const lines: string[] = []
  for (const entry of entriesAfter) {
    const previous = byIdBefore.get(entry.id)
    if (previous === undefined) {
      lines.push(discoveryUpdateLine('+', entry))
    } else {
      lines.push(...editedDiscoveryUpdateLines(previous, entry))
    }
  }
  for (const entry of entriesBefore) {
    if (!byIdAfter.has(entry.id)) {
      lines.push(discoveryUpdateLine('-', entry))
    }
  }
  return lines
}

function editedDiscoveryUpdateLines(
  before: DiscoveryUpdate,
  after: DiscoveryUpdate,
): string[] {
  const field = `discoveryUpdates[id=${after.id}]`
  return diff(before.raw, after.raw).flatMap((change) =>
    renderChange(field, change, before.raw, after.raw),
  )
}

function discoveryUpdateLine(prefix: string, entry: DiscoveryUpdate) {
  const date =
    entry.timestamp === null ? 'unknown date' : isoDate(entry.timestamp)
  const severity = entry.isHighSeverity ? ' [HIGH SEVERITY]' : ''
  const count = plural(entry.changeCount, 'change')
  const description = entry.description.split('\n').filter(Boolean).join(' ')
  return `${prefix} ${date}${severity} (${count}): ${description}`
}

function discoveryUpdates(project: Project): DiscoveryUpdate[] {
  const value = project.discoveryUpdates
  if (!Array.isArray(value)) {
    return []
  }
  return value.map((entry) => {
    assertRecord(entry)
    return {
      id: String(entry.id),
      timestamp: typeof entry.timestamp === 'number' ? entry.timestamp : null,
      description: String(entry.description),
      isHighSeverity: entry.isHighSeverity === true,
      changeCount: Number(entry.changeCount),
      raw: entry,
    }
  })
}

function renderChange(
  field: string,
  change: Difference,
  before: unknown,
  after: unknown,
): string[] {
  const root = change.kind === 'create' ? after : before
  const path = field + renderPath(change.path, root)
  if (change.kind === 'create') {
    return renderValueLine('+', path, change.rhs)
  }
  if (change.kind === 'remove') {
    return renderValueLine('-', path, change.lhs)
  }
  if (isLongString(change.lhs) && isLongString(change.rhs)) {
    return [`~ ${path}:`, ...indent(wordDiff(change.lhs, change.rhs))]
  }
  const lhs = compact(change.lhs)
  const rhs = compact(change.rhs)
  if (lhs.length + rhs.length < 120) {
    return [`~ ${path}: ${lhs} -> ${rhs}`]
  }
  return [`~ ${path}:`, ...indent([`- ${lhs}`, `+ ${rhs}`])]
}

function renderValueLine(prefix: string, path: string, value: unknown) {
  const single = compact(value)
  if (single.length < 120) {
    return [`${prefix} ${path}: ${single}`]
  }
  const pretty = formatJson(value, { indentSize: 2, lineSize: 100 })
  return [`${prefix} ${path}:`, ...indent(pretty)]
}

const ARRAY_KEYS = ['id', 'name', 'title', 'address', 'chain', 'slug']

function renderPath(path: (string | number)[], root: unknown): string {
  let rendered = ''
  let cursor = root
  for (const segment of path) {
    if (typeof segment === 'number') {
      assertDefined(cursor)
      const element = Reflect.get(cursor as object, segment)
      rendered += `[${arrayKey(element) ?? segment}]`
      cursor = element
    } else {
      rendered += `.${segment}`
      cursor = getPath(cursor, [segment])
    }
  }
  return rendered
}

function arrayKey(element: unknown): string | undefined {
  if (typeof element !== 'object' || element === null) {
    return undefined
  }
  for (const key of ARRAY_KEYS) {
    const value = Reflect.get(element, key)
    if (typeof value === 'string') {
      return `${key}=${value}`
    }
  }
  return undefined
}

const WORD_CONTEXT = 6

function wordDiff(before: string, after: string): string {
  const parts = diffWords(before, after)
  const out: string[] = []
  for (const [i, part] of parts.entries()) {
    if (part.added) {
      out.push(`{+${part.value}+}`)
    } else if (part.removed) {
      out.push(`[-${part.value}-]`)
    } else {
      out.push(contextWindow(part.value, i === 0, i === parts.length - 1))
    }
  }
  return out.join('').replaceAll('\n', '\\n')
}

function contextWindow(text: string, isFirst: boolean, isLast: boolean) {
  const words = text.split(' ')
  if (words.length <= WORD_CONTEXT * 2) {
    return text
  }
  const head = isFirst ? [] : words.slice(0, WORD_CONTEXT)
  const tail = isLast ? [] : words.slice(-WORD_CONTEXT)
  return [...head, '...', ...tail].join(' ')
}

function isLongString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 80
}

function compact(value: unknown): string {
  return JSON.stringify(value) ?? 'null'
}

function indent(text: string | string[]): string[] {
  const lines = Array.isArray(text) ? text : text.trimEnd().split('\n')
  return lines.map((line) => `    ${line}`)
}

function getPath(root: unknown, path: string[]): unknown {
  let cursor = root
  for (const segment of path) {
    if (typeof cursor !== 'object' || cursor === null) {
      return undefined
    }
    cursor = Reflect.get(cursor, segment)
  }
  return cursor
}

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

function isoDate(timestamp: number) {
  return new Date(timestamp * 1000).toISOString().slice(0, 10)
}

function assertDefined<T>(value: T | undefined): asserts value is T {
  if (value === undefined) {
    throw new Error('Expected value to be defined')
  }
}

function assertRecord(
  value: unknown,
): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Expected an object')
  }
}
