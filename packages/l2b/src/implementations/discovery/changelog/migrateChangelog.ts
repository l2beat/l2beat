/**
 * One-time migration of a project's existing diffHistory.md into
 * changelog.json. Discovery runs before the changelog existed left their
 * watched changes only as rendered markdown, so this is the single place that
 * reads diff blocks back. New entries never pass through here: l2b records
 * them from the DiscoveryDiff directly (changelogFromDiff.ts).
 *
 * Parsing is strict: a block whose header cannot be attributed to an address
 * throws instead of being dropped, because a silently missing block would
 * later read as "this contract never changed".
 */
import {
  createDiffHistoryEntryIdFactory,
  DiffHistoryParser,
  type DiscoveryChangelog,
  type DiscoveryChangelogContract,
  type DiscoveryChangelogEntry,
  type DiscoveryChangelogField,
  type DiscoveryChangelogSeverity,
  getDiffHistoryEntryTimestamp,
} from '@l2beat/shared'

const DIFF_BLOCK_RE = /```diff\n([\s\S]*?)```/g
/** Header line as written by discoveryDiffToMarkdown:
 *  `    contract <name> (<address>) [<template>] {`
 *  The name may itself contain parentheses and spaces, so the address is the
 *  LAST parenthesised token before the optional template label and brace.
 *  Deliberately not EVM-specific: non-EVM addresses (Starknet felts) must be
 *  attributable too. */
const HEADER_RE =
  /^[ \t]*(?:contract|eoa|reference)[ \t].*\(([^()\s]+)\)(?:[ \t]*\[[^\]\n]*\])?[ \t]*\{?[ \t]*$/i
const STATUS_RE = /^[+-]\s+Status: (CREATED|DELETED)\s*$/
const FIELD_LINE_RE = /^\s*((?:values|upgradeability)\.\S+):\s*$/
const SEVERITY_RE = /^\+\+\+ severity: (HIGH|MEDIUM|LOW)\b/

export function changelogFromDiffHistory(markdown: string): DiscoveryChangelog {
  const entries: DiscoveryChangelogEntry[] = []
  const idFor = createDiffHistoryEntryIdFactory()
  for (const entry of new DiffHistoryParser().parse(markdown)) {
    // ids are assigned to every entry (before filtering) so ordinals agree
    // with every other consumer of the same file
    const id = idFor(entry.date, entry.current)
    const changes = entry.sections
      .filter((section) => section.kind === 'watched-changes')
      .flatMap((section) => parseDiffBlocks(section.body))
    if (changes.length === 0) continue
    entries.push({
      id,
      timestamp: getDiffHistoryEntryTimestamp(entry.date, entry.current),
      changes,
    })
  }
  return { formatVersion: 1, entries }
}

function parseDiffBlocks(body: string): DiscoveryChangelogContract[] {
  return [...body.matchAll(DIFF_BLOCK_RE)].map((match) =>
    parseDiffBlock((match[1] ?? '').replace(/\n$/, '')),
  )
}

function parseDiffBlock(block: string): DiscoveryChangelogContract {
  const lines = block.split('\n')
  let status: DiscoveryChangelogContract['status']
  let address: string | undefined
  // status (optional) and header are the first lines; nothing else may
  // precede them
  for (const line of lines.slice(0, 2)) {
    const statusMatch = STATUS_RE.exec(line)
    if (statusMatch) {
      status = statusMatch[1] === 'CREATED' ? 'created' : 'deleted'
      continue
    }
    const header = HEADER_RE.exec(line)
    if (header?.[1]) {
      address = header[1].toLowerCase()
      break
    }
  }
  if (address === undefined) {
    throw new Error(
      `Cannot attribute diff block to an address:\n${lines.slice(0, 2).join('\n')}`,
    )
  }
  const fields = parseFieldChanges(lines)
  return {
    address,
    ...(status ? { status } : {}),
    ...(fields.length > 0 ? { fields } : {}),
  }
}

function parseFieldChanges(lines: string[]): DiscoveryChangelogField[] {
  const fields: DiscoveryChangelogField[] = []
  let pendingSeverity: DiscoveryChangelogSeverity | undefined
  let current: DiscoveryChangelogField | undefined
  for (const line of lines) {
    const severity = SEVERITY_RE.exec(line)?.[1]
    if (severity) {
      pendingSeverity = severity as DiscoveryChangelogSeverity
      continue
    }
    // other +++ annotations (description, type) keep the pending severity
    if (line.startsWith('+++')) continue

    const field = FIELD_LINE_RE.exec(line)?.[1]
    if (field) {
      current = {
        key: field,
        ...(pendingSeverity ? { severity: pendingSeverity } : {}),
      }
      fields.push(current)
      pendingSeverity = undefined
      continue
    }
    if (/^\s*-/.test(line)) {
      current && (current.removed ??= []).push(line.replace(/^\s*-\s*/, ''))
      continue
    }
    if (/^\s*\+/.test(line)) {
      current && (current.added ??= []).push(line.replace(/^\s*\+\s*/, ''))
      continue
    }
    if (line.trim() === '') continue
    current = undefined
    pendingSeverity = undefined
  }
  return fields
}
