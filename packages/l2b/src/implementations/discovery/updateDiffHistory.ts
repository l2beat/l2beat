/*
  This file is a quick prototype and will be refactored if it's proven useful.

  Do not INCLUDE this file - it immediately runs `updateDiffHistoryFile()`
*/

import type { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  combinePermissionsIntoDiscovery,
  type DiscoveryDiff,
  type DiscoveryOutput,
  DiscoveryRegistry,
  diffDiscovery,
  discoveryDiffToMarkdown,
  getDiscoveryPaths,
  modelPermissions,
  TemplateService,
} from '@l2beat/discovery'
import {
  assert,
  formatAsciiBorder,
  withoutUndefinedKeys,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { execSync } from 'child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs'
import path, { relative } from 'path'
import { rimraf } from 'rimraf'
import { getPlainLogger } from '../common/getPlainLogger'
import { updateDiffHistoryHash } from './hashing'
import {
  rediscoverStructureOnBlock,
  type Timing,
} from './rediscoverStructureOnBlock'

const FIRST_SECTION_PREFIX = '# Diff at'

export async function updateDiffHistory(
  projectName: string,
  description?: string,
  overwriteCache = false,
  logger: Logger = getPlainLogger(),
) {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  await updateDiffHistoryForChain(
    configReader,
    projectName,
    description,
    overwriteCache,
    logger,
  )
}

export async function updateDiffHistoryForChain(
  configReader: ConfigReader,
  projectName: string,
  description?: string,
  overwriteCache = false,
  logger: Logger = getPlainLogger(),
) {
  // Get discovered.json from main branch and compare to current
  logger.info(`Updating diffHistory for: ${projectName}`)
  const curDiscovery = configReader.readDiscovery(projectName)
  const discoveryFolder =
    '.' +
    path.sep +
    relative(process.cwd(), configReader.getProjectPath(projectName))

  const { content: discoveryJsonFromMainBranch, mainBranchHash } =
    getFileVersionOnMainBranch(`${discoveryFolder}/discovered.json`, logger)
  const discoveryFromMainBranch =
    discoveryJsonFromMainBranch === ''
      ? undefined
      : (JSON.parse(discoveryJsonFromMainBranch) as DiscoveryOutput)

  const saveSources = process.argv.some((a) => a === '--save-sources')

  let diff: DiscoveryDiff[] = []
  let codeDiff
  let configRelatedDiff

  // TODO(radomski): Use timestamp after the merge
  if ((discoveryFromMainBranch?.timestamp ?? 0) > curDiscovery.timestamp) {
    throw new Error(
      `Main branch discovery timestamp (${discoveryFromMainBranch?.timestamp}) is higher than current discovery timestamp (${curDiscovery.timestamp})`,
    )
  }

  // TODO(radomski): Use timestamp after the merge
  if ((discoveryFromMainBranch?.timestamp ?? 0) < curDiscovery.timestamp) {
    const rerun = await performDiscoveryOnPreviousBlockButWithCurrentConfigs(
      discoveryFolder,
      discoveryFromMainBranch,
      projectName,
      saveSources,
      overwriteCache,
      configReader,
      logger,
    )
    codeDiff = rerun.codeDiff

    diff = diffDiscovery(
      rerun.prevDiscovery?.entries ?? [],
      curDiscovery.entries,
    )
    configRelatedDiff = diffDiscovery(
      discoveryFromMainBranch?.entries ?? [],
      rerun.prevDiscovery?.entries ?? [],
    )
  } else {
    logger.info(
      'Discovery was run on the same block as main branch, skipping rerun.',
    )
    configRelatedDiff = diffDiscovery(
      discoveryFromMainBranch?.entries ?? [],
      curDiscovery?.entries ?? [],
    )
  }

  removeIgnoredFields(configRelatedDiff)
  configRelatedDiff = filterOutEmptyDiffs(configRelatedDiff)

  const diffHistoryPath = `${discoveryFolder}/diffHistory.md`
  const { content: historyFileFromMainBranch } = getFileVersionOnMainBranch(
    diffHistoryPath,
    logger,
  )

  let previousDescription = undefined
  const diffHistoryExists =
    existsSync(diffHistoryPath) && statSync(diffHistoryPath).isFile()
  if (diffHistoryExists) {
    const diskDiffHistory = readFileSync(diffHistoryPath, 'utf-8')
    previousDescription = findDescription(
      diffHistoryPath,
      diskDiffHistory,
      historyFileFromMainBranch,
      logger,
    )
  }

  const anyDiffs = diff.length > 0 || configRelatedDiff.length > 0
  if (!diffHistoryExists || anyDiffs) {
    const newHistoryEntry = generateDiffHistoryMarkdown(
      discoveryFromMainBranch?.timestamp,
      curDiscovery.timestamp,
      diff,
      configRelatedDiff,
      mainBranchHash,
      logger,
      codeDiff,
      description ?? previousDescription,
    )

    const diffHistory =
      historyFileFromMainBranch === ''
        ? newHistoryEntry
        : newHistoryEntry.concat('\n' + historyFileFromMainBranch)

    writeFileSync(diffHistoryPath, diffHistory)
  } else {
    logger.info('No changes found.')
    await revertDiffHistory(diffHistoryPath, historyFileFromMainBranch)
  }

  const diffHistoryExistsAfterRevert =
    existsSync(diffHistoryPath) && statSync(diffHistoryPath).isFile()
  if (diffHistoryExistsAfterRevert) {
    updateDiffHistoryHash(configReader, diffHistoryPath, projectName)
  }
}

function removeIgnoredFields(diffs: DiscoveryDiff[]) {
  const ignoredFields = [
    'derivedName',
    'implementationNames', // we don't want changes to derivedName or implementationNames to trigger diff
  ]
  for (const diff of diffs) {
    diff.diff = diff.diff?.filter(
      (d) => d.key === undefined || !ignoredFields.includes(d.key),
    )
  }
}

function filterOutEmptyDiffs(diffs: DiscoveryDiff[]): DiscoveryDiff[] {
  return diffs.filter(
    (d) => d.type !== undefined || (d.diff !== undefined && d.diff.length > 0),
  )
}

async function revertDiffHistory(
  diffHistoryPath: string,
  historyFileFromMainBranch: string,
) {
  if (historyFileFromMainBranch.trim() !== '') {
    writeFileSync(diffHistoryPath, historyFileFromMainBranch)
  } else {
    await rimraf(diffHistoryPath)
  }
}

async function performDiscoveryOnPreviousBlockButWithCurrentConfigs(
  discoveryFolder: string,
  discoveryFromMainBranch: DiscoveryOutput | undefined,
  projectName: string,
  saveSources: boolean,
  overwriteCache: boolean,
  configReader: ConfigReader,
  logger: Logger,
) {
  if (discoveryFromMainBranch === undefined) {
    logger.info(`No previous discovery found for ${projectName}`)
    return { prevDiscovery: undefined, codeDiff: undefined }
  }

  const discoveries = new DiscoveryRegistry()
  // We rediscover on the past block number, but with current configs and dependencies
  const dependencies: string[] = [projectName]

  for (const dependency of dependencies) {
    // TODO(radomski): Remove the duplication after the PR containing this code is merged
    let timestamp =
      discoveryFromMainBranch.dependentDiscoveries?.[dependency]?.timestamp

    if (dependency === projectName) {
      timestamp = discoveryFromMainBranch.timestamp
    }

    if (timestamp === undefined) {
      // We rediscover on the past block number, but with current configs and dependencies.
      // Those dependencies might not have been referenced in the old discovery.
      // In that case we don't fail - the diff will show all those "added".
      logger.info(
        `No block number found for dependency ${dependency}, skipping its rediscovery.`,
      )
      continue
    }

    const prevStructure = await rediscoverStructureOnBlock(
      dependency,
      { blockNumber: undefined, timestamp } as Timing,
      saveSources,
      overwriteCache,
    )
    discoveries.set(prevStructure.name, prevStructure)
  }

  const discoveryPaths = getDiscoveryPaths()
  const templateService = new TemplateService(discoveryPaths.discovery)
  const permissionsOutput = await modelPermissions(
    projectName,
    discoveries,
    configReader,
    templateService,
    discoveryPaths,
    { debug: false },
  )

  const targetDiscovery = discoveries.get(projectName)
  combinePermissionsIntoDiscovery(
    targetDiscovery.discoveryOutput,
    permissionsOutput,
  )
  const prevDiscovery = withoutUndefinedKeys(targetDiscovery.discoveryOutput)

  // get code diff with main branch
  // (we only diff code for target discovery, not dependencies)
  const flatDiff = compareFolders(
    `${discoveryFolder}/.flat@${discoveryFromMainBranch.timestamp}`,
    `${discoveryFolder}/.flat`,
    logger,
  )

  return { prevDiscovery, codeDiff: flatDiff === '' ? undefined : flatDiff }
}

function getMainBranchName(): 'main' | 'master' {
  try {
    execSync('git show-ref --verify refs/heads/master', {
      stdio: 'ignore',
    })
    return 'master'
  } catch {
    // If error, it means 'master' doesn't exist, so we'll stick with 'main'
    return 'main'
  }
}

function shellQuote(p: string): string {
  return `'${p.replaceAll("'", "'\\''")}'`
}

function compareFolders(path1: string, path2: string, logger: Logger): string {
  try {
    const quoted1 = shellQuote(path1)
    const quoted2 = shellQuote(path2)
    return execSync(
      `git diff --no-index --stat ${quoted1} ${quoted2}`,
    ).toString()
  } catch (error) {
    // When difference is found, git diff returns non-zero exit code
    // so execSync throws and error, which we handle here
    const execSyncError = error as {
      code?: number
      stdout?: Buffer
      stderr?: Buffer
    }
    if (execSyncError.stderr && execSyncError.stderr.toString().trim() !== '') {
      const errorMessage = `Error with git diff: ${execSyncError.stderr.toString()}`
      logger.info(errorMessage)
      return errorMessage
    }
    if (execSyncError.stdout) {
      return execSyncError.stdout.toString().trim()
    }
    return 'Error with git diff: no stderr or stdout found'
  }
}

function getFileVersionOnMainBranch(
  filePath: string,
  logger: Logger,
): {
  content: string
  mainBranchHash: string
} {
  const mainBranch = getMainBranchName()
  try {
    // NOTE(radomski): Node when starting a process reserves a buffer of around
    // 200KB for STDIO output. This is not enough in cases where the
    // discovered.json is really big (e.g. transporter). In that case the git
    // command fails with "ENOBUFS" and we assume that there no old
    // discovered.json. Which in turn always causes the diffHistory.md to
    // include "all" the contracts as being created. To solve this problem we
    // allocate a 10MB buffer upfront so all the data can be stored. At the
    // time of writing this (21.10.2024) discovered.json of transporter is
    // around 1.2MB.
    const BUFFER_SIZE = 10 * 1024 * 1024
    // Wrap the path in single quotes to avoid the shell interpreting
    // characters like parentheses or spaces. We also escape any single quotes
    // inside the path (extremely unlikely in our repo layout).
    const quotedPath = shellQuote(filePath)
    const content = execSync(
      `git show ${mainBranch}:${quotedPath} 2>/dev/null`,
      { maxBuffer: BUFFER_SIZE },
    ).toString()
    const mainBranchHash = execSync(`git rev-parse ${mainBranch}`)
      .toString()
      .trim()
    return { content, mainBranchHash }
  } catch {
    logger.info(`No previous version of ${filePath} found`)
    return { content: '', mainBranchHash: '' }
  }
}

function getGitUser(logger: Logger): { name: string; email: string } {
  try {
    const name = execSync('git config user.name').toString().trim()
    const email = execSync('git config user.email').toString().trim()
    return { name, email }
  } catch {
    logger.info('No git user found')
    return { name: 'unknown', email: 'unknown' }
  }
}

function generateDiffHistoryMarkdown(
  timestampFromMainBranchDiscovery: number | undefined,
  timestamp: number,
  diffs: DiscoveryDiff[],
  configRelatedDiff: DiscoveryDiff[],
  mainBranchHash: string,
  logger: Logger,
  codeDiff?: string,
  description?: string,
): string {
  const result = []
  const mainBranch = getMainBranchName()

  const now = new Date().toUTCString()
  result.push(`${FIRST_SECTION_PREFIX} ${now}:`)
  result.push('')
  const { name, email } = getGitUser(logger)
  result.push(`- author: ${name} (<${email}>)`)
  if (timestampFromMainBranchDiscovery !== undefined) {
    result.push(
      `- comparing to: ${mainBranch}@${mainBranchHash} block: ${timestampFromMainBranchDiscovery}`,
    )
  }
  result.push(`- current timestamp: ${timestamp}`)
  result.push('')
  result.push('## Description')
  if (description) {
    result.push('')
    result.push(description.trim())
    result.push('')
  } else {
    result.push('')
    if ((timestampFromMainBranchDiscovery ?? timestamp) !== timestamp) {
      result.push(
        'Provide description of changes. This section will be preserved.',
      )
    } else {
      result.push(
        'Discovery rerun on the same block number with only config-related changes.',
      )
    }
    result.push('')
  }

  if (diffs.length > 0) {
    if (timestampFromMainBranchDiscovery === undefined) {
      result.push('## Initial discovery')
    } else {
      result.push('## Watched changes')
    }
    result.push('')
    result.push(discoveryDiffToMarkdown(diffs))
    result.push('')
  }

  if (codeDiff !== undefined) {
    result.push('## Source code changes')
    result.push('')
    result.push('```diff')
    result.push(codeDiff)
    result.push('```')
    result.push('')
  }

  if (configRelatedDiff.length > 0) {
    assert(timestampFromMainBranchDiscovery !== undefined)
    result.push('## Config/verification related changes')
    result.push('')
    result.push(
      `Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block ${timestampFromMainBranchDiscovery} (main branch discovery), not current.`,
    )
    result.push('')
    result.push(discoveryDiffToMarkdown(configRelatedDiff))
    result.push('')
  }

  return result.join('\n')
}

function findDescription(
  diskDiffHistoryPath: string,
  diskDiffHistory: string,
  masterDiffHistory: string,
  logger: Logger,
): string | undefined {
  const masterDiffLines = masterDiffHistory.split('\n')
  const latestSectionIndex = masterDiffLines.findIndex((l) =>
    l.startsWith(FIRST_SECTION_PREFIX),
  )
  let lines: string[] = []
  if (latestSectionIndex >= 0) {
    const lastCommitted = masterDiffLines[latestSectionIndex]
    const diskLines = diskDiffHistory.split('\n')
    const lastCommittedIndex = diskLines.findIndex((l) => l === lastCommitted)
    if (lastCommittedIndex === -1) {
      const errorMessage = formatAsciiBorder([
        'A mismatch has been detected between your local diffHistory.md and the main branch version.',
        '',
        'WHAT HAPPENED?',
        '• Your local diffHistory.md file is outdated or conflicts with the latest version on main.',
        '• This typically occurs when working with an old branch or after merge/rebase conflicts.',
        '',
        'HOW TO FIX IT:',
        '1. Back up any unsaved changes (this action will overwrite your current file).',
        '2. Run this command to synchronize with the main branch:',
        `    [${chalk.green(`git checkout origin/main ${diskDiffHistoryPath}`)}]`,
        '',
        chalk.redBright('CRUCIAL WARNING:'),
        chalk.redBright('• This action will ') +
          chalk.bold.redBright('PERMANENTLY REMOVE') +
          chalk.redBright(' any uncommitted changes in diffHistory.md.'),
        chalk.redBright(
          "• Make sure you've saved or stashed important work before proceeding.",
        ),
      ])

      logger.info(errorMessage)
      throw new Error()
    }
    lines = diskLines.slice(0, lastCommittedIndex)
  } else {
    lines = diskDiffHistory.split('\n')
  }

  const index = lines.findIndex((l) => l === '## Description')
  if (index < 0) {
    return undefined
  }

  const followingLines = lines.slice(index + 1)
  const lastIndex = followingLines.findIndex((l) => l.startsWith('## '))
  if (lastIndex < 0) {
    return followingLines.join('\n')
  }

  return followingLines.slice(0, lastIndex).join('\n')
}
