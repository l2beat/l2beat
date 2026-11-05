import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ApiAgentContext } from '../types'
import { type CodeSource, lineAt, matchAt } from './codeAnchor'
import { excerptAt } from './excerpt'
import { type AgentEntry, describeEntry } from './resolveRef'

// What the tab sent, in words: the tab names only addresses and offsets, and
// names and code come from the discovery on disk, like show's.
export function describeContext(
  context: ApiAgentContext & { project: string },
  entries: readonly AgentEntry[],
  readSources: (address: ChainSpecificAddress) => CodeSource[],
): string[] {
  const lines = [`DiscoUI shows ${context.project}.`]
  const selected = context.selected.map((address) =>
    describeAddress(entries, address),
  )
  lines.push(`  selected: ${selected.join(', ') || 'nothing'}`)
  if (context.code !== undefined) {
    lines.push(...describeCode(entries, readSources, context.code))
  }
  if (context.note !== undefined) {
    const { index, stepCount } = context.note
    lines.push(`  note: step ${index + 1} of ${stepCount} of your last show`)
  }
  return lines
}

function describeAddress(entries: readonly AgentEntry[], address: string) {
  const entry = entries.find((e) => e.address === address)
  return entry === undefined
    ? `${address} (not in the project)`
    : describeEntry(entry)
}

function describeCode(
  entries: readonly AgentEntry[],
  readSources: (address: ChainSpecificAddress) => CodeSource[],
  code: NonNullable<ApiAgentContext['code']>,
): string[] {
  const entry = entries.find((e) => e.address === code.address)
  if (entry === undefined) {
    return [`  code: ${code.sourceName} of a contract not in the project`]
  }
  const contract = entry.name ?? entry.address
  let sources: CodeSource[]
  try {
    sources = readSources(entry.address)
  } catch {
    return [`  code: ${code.sourceName} of ${contract}, source not readable`]
  }
  const sourceIndex = sources.findIndex((s) => s.name === code.sourceName)
  const source = sources[sourceIndex]
  // The tab loaded the code before discovery changed it on disk.
  if (source === undefined || code.to > source.code.length) {
    return [`  code: ${code.sourceName} of ${contract}, changed since shown`]
  }
  const first = lineAt(source.code, code.from)
  const last = lineAt(source.code, Math.max(code.from, code.to - 1))
  const place =
    code.from === code.to
      ? `cursor at ${code.sourceName}:${first}`
      : `selected ${code.sourceName}:${first}-${last}`
  const match = matchAt(source, sourceIndex, code.from)
  const excerpt = excerptAt(source.code, match, code.to - code.from)
  const lines = [`  code: ${place} in ${contract}`, '```', excerpt.text, '```']
  if (excerpt.isCut) {
    lines.push('  (excerpt cut, read the rest in the source)')
  }
  return lines
}
