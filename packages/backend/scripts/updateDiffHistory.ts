/*
  This file is a quick prototype and will be refactored if it's proven useful.
  
  Do not INCLUDE this file - it immediately runs `updateDiffHistoryFile()`
*/

import {
  ConfigReader,
  diffDiscovery,
  discover,
  DiscoveryDiff,
  getChainConfig,
} from '@l2beat/discovery'
// eslint-disable-next-line import/no-extraneous-dependencies
import { DiscoveryOutput } from '@l2beat/discovery-types'
import { assert } from '@l2beat/shared-pure'
import { execSync } from 'child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs'
import { toUpper } from 'lodash'
import { rimraf } from 'rimraf'

import { updateDiffHistoryHash } from '../src/modules/update-monitor/utils/hashing'

const FIRST_SECTION_PREFIX = '# Diff at'

// This is a CLI tool. Run logic immediately.
void updateDiffHistoryFile()

async function updateDiffHistoryFile() {
  if (process.argv.filter((v) => v.startsWith('-')).length > 0) {
    console.log(
      'Discovery run with non-default configuration, skipping updating the diff history file...',
    )
    process.exit(0)
  }

  console.log('Updating diff history file...')
  const params = process.argv.filter((v) => !v.startsWith('-'))
  const [_node, _sourcefile, chain, projectName] = params
  if (!chain || !projectName) {
    console.error('Pass parameters: <chainName> <projectName>')
    process.exit(1)
  }

  // Get discovered.json from main branch and compare to current
  console.log(`Project: ${projectName}`)
  const configReader = new ConfigReader()
  const curDiscovery = await configReader.readDiscovery(projectName, chain)
  const config = await configReader.readConfig(projectName, chain)
  const discoveryFolder = `./discovery/${projectName}/${chain}`
  const { content: discoveryJsonFromMainBranch, mainBranchHash } =
    getFileVersionOnMainBranch(`${discoveryFolder}/discovered.json`)
  const discoveryFromMainBranch =
    discoveryJsonFromMainBranch === ''
      ? undefined
      : (JSON.parse(discoveryJsonFromMainBranch) as DiscoveryOutput)

  const { prevDiscovery, codeDiff } = await performDiscoveryOnPreviousBlock(
    discoveryFromMainBranch,
    projectName,
    chain,
  )

  const diff = diffDiscovery(
    prevDiscovery?.contracts ?? [],
    curDiscovery.contracts,
    config,
  )

  let configRelatedDiff = diffDiscovery(
    discoveryFromMainBranch?.contracts ?? [],
    prevDiscovery?.contracts ?? [],
    config,
  )
  removeIgnoredFields(configRelatedDiff)
  configRelatedDiff = filterOutEmptyDiffs(configRelatedDiff)

  const diffHistoryPath = `${discoveryFolder}/diffHistory.md`
  const { content: historyFileFromMainBranch } =
    getFileVersionOnMainBranch(diffHistoryPath)

  if (diff.length > 0 || configRelatedDiff.length > 0) {
    let description = undefined
    if (existsSync(diffHistoryPath) && statSync(diffHistoryPath).isFile()) {
      const diskDiffHistory = readFileSync(diffHistoryPath, 'utf-8')
      description = findDescription(diskDiffHistory, historyFileFromMainBranch)
    }

    const newHistoryEntry = generateDiffHistoryMarkdown(
      discoveryFromMainBranch?.blockNumber,
      curDiscovery.blockNumber,
      diff,
      configRelatedDiff,
      mainBranchHash,
      codeDiff,
      description,
    )

    const diffHistory =
      historyFileFromMainBranch === ''
        ? newHistoryEntry
        : newHistoryEntry.concat('\n' + historyFileFromMainBranch)

    writeFileSync(diffHistoryPath, diffHistory)
  } else {
    console.log('No changes found.')
    await revertDiffHistory(diffHistoryPath, historyFileFromMainBranch)
  }

  await updateDiffHistoryHash(diffHistoryPath, projectName, chain)
}

function removeIgnoredFields(diffs: DiscoveryDiff[]) {
  const ignoredFields = [
    'derivedName', // we don't want changes to derivedName to trigger diff
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

async function performDiscoveryOnPreviousBlock(
  discoveryFromMainBranch: DiscoveryOutput | undefined,
  projectName: string,
  chain: string,
) {
  if (discoveryFromMainBranch === undefined) {
    return { prevDiscovery: undefined, codeDiff: undefined }
  }

  // To check for changes to source code,
  // download sources for block number from main branch
  const root = `discovery/${projectName}/${chain}`
  // Remove any old sources we fetched before, so that their count doesn't grow
  await rimraf(`${root}/.code@*`, { glob: true })
  await rimraf(`${root}/.flat@*`, { glob: true })

  const blockNumberFromMainBranch = discoveryFromMainBranch.blockNumber

  await discover({
    project: projectName,
    chain: getChainConfig(chain),
    blockNumber: blockNumberFromMainBranch,
    sourcesFolder: `.code@${blockNumberFromMainBranch}`,
    flatSourcesFolder: `.flat@${blockNumberFromMainBranch}`,
    discoveryFilename: `discovered@${blockNumberFromMainBranch}.json`,
  })

  const prevDiscoveryFile = readFileSync(
    `${root}/discovered@${blockNumberFromMainBranch}.json`,
    'utf-8',
  )
  const prevDiscovery = JSON.parse(prevDiscoveryFile) as DiscoveryOutput

  // Remove discovered@... file, we don't need it
  await rimraf(`${root}/discovered@${blockNumberFromMainBranch}.json`)

  // get code diff with main branch
  const codeDiff = compareFolders(
    `${root}/.code@${blockNumberFromMainBranch}`,
    `${root}/.code`,
  )

  return { prevDiscovery, codeDiff: codeDiff === '' ? undefined : codeDiff }
}

function getMainBranchName(): 'main' | 'master' {
  try {
    execSync('git show-ref --verify refs/heads/master', {
      stdio: 'ignore',
    })
    return 'master'
  } catch (error) {
    // If error, it means 'master' doesn't exist, so we'll stick with 'main'
    return 'main'
  }
}

function compareFolders(path1: string, path2: string): string {
  try {
    return execSync(`git diff --no-index --stat ${path1} ${path2}`).toString()
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
      console.log(errorMessage)
      return errorMessage
    }
    if (execSyncError.stdout) {
      return execSyncError.stdout.toString().trim()
    }
    return 'Error with git diff: no stderr or stdout found'
  }
}

function getFileVersionOnMainBranch(filePath: string): {
  content: string
  mainBranchHash: string
} {
  const mainBranch = getMainBranchName()
  try {
    const content = execSync(
      `git show ${mainBranch}:${filePath} 2>/dev/null`,
    ).toString()
    const mainBranchHash = execSync(`git rev-parse ${mainBranch}`)
      .toString()
      .trim()
    return {
      content,
      mainBranchHash,
    }
  } catch (e) {
    console.log(`No previous version of ${filePath} found`)
    return {
      content: '',
      mainBranchHash: '',
    }
  }
}

function getGitUser(): { name: string; email: string } {
  try {
    const name = execSync('git config user.name').toString().trim()
    const email = execSync('git config user.email').toString().trim()
    return { name, email }
  } catch (e) {
    console.log('No git user found')
    return { name: 'unknown', email: 'unknown' }
  }
}

function contractDiffToMarkdown(diff: DiscoveryDiff): string {
  const result = []
  result.push('```diff')
  if (diff.type) {
    const marker = diff.type === 'created' ? '+' : '-'
    result.push(`${marker}   Status: ${toUpper(diff.type)}`)
  }
  result.push(`    contract ${diff.name} (${diff.address.toString()}) {`)
  if (diff.diff) {
    for (const valueDiff of diff.diff) {
      const varName = valueDiff.key ?? 'unknown'
      result.push(`      ${varName}:`)
      if (valueDiff.before) {
        result.push(`-        ${valueDiff.before}`)
      }
      if (valueDiff.after) {
        result.push(`+        ${valueDiff.after}`)
      }
    }
  }
  result.push('    }')
  result.push('```')
  return result.join('\n')
}

function discoveryDiffToMarkdown(diffs: DiscoveryDiff[]): string {
  const result = []
  for (const diff of diffs) {
    result.push(contractDiffToMarkdown(diff))
  }
  return result.join('\n\n')
}

function generateDiffHistoryMarkdown(
  blockNumberFromMainBranchDiscovery: number | undefined,
  curBlockNumber: number,
  diffs: DiscoveryDiff[],
  configRelatedDiff: DiscoveryDiff[],
  mainBranchHash: string,
  codeDiff?: string,
  description?: string,
): string {
  const result = []
  const mainBranch = getMainBranchName()

  const now = new Date().toUTCString()
  result.push(`${FIRST_SECTION_PREFIX} ${now}:`)
  result.push('')
  const { name, email } = getGitUser()
  result.push(`- author: ${name} (<${email}>)`)
  if (blockNumberFromMainBranchDiscovery !== undefined) {
    result.push(
      `- comparing to: ${mainBranch}@${mainBranchHash} block: ${blockNumberFromMainBranchDiscovery}`,
    )
  }
  result.push(`- current block number: ${curBlockNumber}`)
  result.push('')
  result.push('## Description')
  if (description) {
    result.push(description)
  } else {
    result.push('')
    result.push(
      'Provide description of changes. This section will be preserved.',
    )
    result.push('')
  }

  if (diffs.length > 0) {
    if (blockNumberFromMainBranchDiscovery === undefined) {
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
    assert(blockNumberFromMainBranchDiscovery !== undefined)
    result.push('## Config/verification related changes')
    result.push('')
    result.push(
      `Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block ${blockNumberFromMainBranchDiscovery} (main branch discovery), not current.`,
    )
    result.push('')
    result.push(discoveryDiffToMarkdown(configRelatedDiff))
    result.push('')
  }

  return result.join('\n')
}

function findDescription(
  diskDiffHistory: string,
  masterDiffHistory: string,
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
    assert(
      lastCommittedIndex >= 0,
      'Unexpected difference between master and disk file',
    )
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
