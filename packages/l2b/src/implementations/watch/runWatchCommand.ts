import type { Logger } from '@l2beat/backend-tools'
import {
  countPendingItems,
  diffWatched,
  getDiscoveryPaths,
  parseWatched,
  runWatch,
  stripPendingItems,
  WATCH_TEMPLATES,
  WATCHED_FILE,
  type WatchDiff,
  type Watched,
  WatchReader,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { assert, formatJson } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { writeFileSync } from 'fs'
import path from 'path'
import { getFileVersionOnMainBranch, toGitPath } from '../common/git'
import { summarizeWatched } from './summarizeWatched'
import { updateWatchDiffHistory } from './updateWatchDiffHistory'
import { watchDiffToMarkdown } from './watchDiffToMarkdown'

export interface WatchCommandOptions {
  dry: boolean
  description: string | undefined
}

export async function runWatchCommand(
  name: string,
  options: WatchCommandOptions,
  logger: Logger,
): Promise<void> {
  const reader = new WatchReader(getDiscoveryPaths(), WATCH_TEMPLATES)
  const location = reader.findWatch(name)
  if (location === undefined) {
    const known = reader.readAllWatches().map((watch) => watch.name)
    throw new Error('Watch not found', { cause: { name, known } })
  }
  logger.info(`Running ${chalk.blue(name)} (${location.kind} watch)`)

  const run = await runWatch(reader.readWatchConfig(name), {
    http: new HttpClient(),
    githubToken: process.env.GITHUB_TOKEN,
  })
  const accepted = stripPendingItems(run.values)
  const pending = diffWatched(accepted, run.values)
  assert(
    countChanges(pending) === countPendingItems(run.values),
    'Every pending item is one added path',
  )

  const watchedPath = path.join(location.path, WATCHED_FILE)
  const committed = readWatchedOnMain(watchedPath, logger)
  const diff = diffWatched(committed?.values ?? {}, accepted)

  logger.info(summarizeWatched(run.values, diff).join('\n'))
  logger.info(formatPending(pending, 'Pending'))
  logger.info(
    diff.length > 0 ? watchDiffToMarkdown(diff) : 'No changes against main.',
  )
  if (options.dry) {
    return
  }

  writeFileSync(
    watchedPath,
    formatJson({ timestamp: run.timestamp, values: accepted }),
  )
  await updateWatchDiffHistory(
    path.join(location.path, 'diffHistory.md'),
    diff,
    run.timestamp,
    options.description,
    logger,
  )
  logger.info(formatPending(pending, 'Still open, not accepted'))
}

function readWatchedOnMain(
  watchedPath: string,
  logger: Logger,
): Watched | undefined {
  const { content } = getFileVersionOnMainBranch(toGitPath(watchedPath), logger)
  if (content === '') {
    return undefined
  }
  return parseWatched(content)
}

function formatPending(pending: WatchDiff[], title: string): string {
  const paths = pending.flatMap(({ key, changes }) =>
    changes.map((change) => [key, ...change.path].join('.')),
  )
  return [`${title} (${paths.length}):`, ...paths.map((p) => `  ${p}`)].join(
    '\n',
  )
}

function countChanges(diff: WatchDiff[]): number {
  return diff.reduce((sum, { changes }) => sum + changes.length, 0)
}
