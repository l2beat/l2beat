import type { Logger } from '@l2beat/backend-tools'
import { DiffHistoryParser, type WatchDiff } from '@l2beat/discovery'
import { hashJson } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import {
  getFileVersionOnMainBranch,
  getGitUser,
  getMainBranchHash,
  toGitPath,
} from '../common/git'
import {
  findUnmergedEntry,
  revertDiffHistory,
} from '../discovery/updateDiffHistory'
import { watchDiffToMarkdown } from './watchDiffToMarkdown'

const HASH_LINE_PREFIX = 'Generated with discovered.json: '
const DESCRIPTION_PLACEHOLDER =
  'Provide description of changes. This section will be preserved.'

export interface WatchDiffHistoryEntry {
  date: string
  id: string
  author: { name: string; email: string }
  mainBranchHash: string
  timestamp: number
  description: string | undefined
  diff: WatchDiff[]
}

export async function updateWatchDiffHistory(
  diffHistoryPath: string,
  diff: WatchDiff[],
  timestamp: number,
  description: string | undefined,
  logger: Logger,
): Promise<void> {
  const { content: fromMain } = getFileVersionOnMainBranch(
    toGitPath(diffHistoryPath),
    logger,
  )
  await writeWatchDiffHistory(
    diffHistoryPath,
    fromMain,
    diff,
    timestamp,
    description,
    logger,
  )
}

// `fromMain` is the file's version on main, or '' when main has none.
export async function writeWatchDiffHistory(
  diffHistoryPath: string,
  fromMain: string,
  diff: WatchDiff[],
  timestamp: number,
  description: string | undefined,
  logger: Logger,
): Promise<void> {
  const onDisk = existsSync(diffHistoryPath)
    ? readFileSync(diffHistoryPath, 'utf-8')
    : undefined
  // Before the revert too: both paths rebuild the file from main.
  const unmerged =
    onDisk === undefined
      ? { id: undefined, description: undefined }
      : findUnmergedWatchEntry(diffHistoryPath, onDisk, fromMain, logger)
  if (onDisk !== undefined && diff.length === 0) {
    logger.info('No changes found.')
    await revertDiffHistory(diffHistoryPath, fromMain)
    return
  }
  const date = new Date().toUTCString()
  const entry = generateWatchDiffHistoryEntry({
    date,
    id: unmerged.id ?? hashJson([date, 'timestamp', timestamp]).slice(2, 10),
    author: getGitUser(logger),
    mainBranchHash: getMainBranchHash(),
    timestamp,
    description: description ?? unmerged.description,
    diff,
  })
  writeFileSync(diffHistoryPath, prependEntry(fromMain, entry))
}

export function generateWatchDiffHistoryEntry(
  entry: WatchDiffHistoryEntry,
): string {
  const lines = [
    `# Diff at ${entry.date}:`,
    '',
    `- id: ${entry.id}`,
    `- author: ${entry.author.name} (<${entry.author.email}>)`,
    `- comparing to: main@${entry.mainBranchHash}`,
    `- current timestamp: ${entry.timestamp}`,
    '',
    '## Description',
    '',
    entry.description?.trim() || DESCRIPTION_PLACEHOLDER,
    '',
  ]
  if (entry.diff.length > 0) {
    lines.push('## Offchain changes', '', watchDiffToMarkdown(entry.diff), '')
  }
  return lines.join('\n')
}

// The discovered.json hash line stays first, where readers look for it.
export function prependEntry(history: string, entry: string): string {
  if (history === '') {
    return entry
  }
  if (!history.startsWith(HASH_LINE_PREFIX)) {
    return `${entry}\n${history}`
  }
  const headLength = history.indexOf('\n\n') + 2
  assert(headLength > 2, 'Hash line without a blank line after it')
  return `${history.slice(0, headLength)}${entry}\n${history.slice(headLength)}`
}

// The entry is rebuilt from main on every run, so an unmerged discovery entry
// in the same file would be lost. Refuse instead.
export function findUnmergedWatchEntry(
  diffHistoryPath: string,
  onDisk: string,
  fromMain: string,
  logger: Logger,
): { id: string | undefined; description: string | undefined } {
  const parser = new DiffHistoryParser()
  const mainIds = new Set(parser.parse(fromMain).map((e) => e.id))
  for (const entry of parser.parse(onDisk)) {
    if (mainIds.has(entry.id)) {
      continue
    }
    const kinds = entry.sections.map((section) => section.kind)
    if (kinds.some((kind) => kind !== 'offchain-changes')) {
      throw new Error('Unmerged discovery entry in diffHistory.md', {
        cause: { diffHistoryPath, id: entry.id },
      })
    }
  }
  return findUnmergedEntry(diffHistoryPath, onDisk, fromMain, logger)
}
