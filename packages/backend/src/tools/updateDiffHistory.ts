/*
  This file is a quick prototype and will be refactored if it's proven useful.
  
  Do not INCLUDE this file - it immediately runs `updateDiffHistoryFile()`
*/

import { ConfigReader, diffDiscovery, DiscoveryDiff } from '@l2beat/discovery'
// eslint-disable-next-line import/no-extraneous-dependencies
import { DiscoveryOutput } from '@l2beat/discovery-types'
import { assert, ChainId } from '@l2beat/shared-pure'
import { execSync } from 'child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs'
import { toUpper } from 'lodash'
import { rimraf } from 'rimraf'

// This is a CLI tool. Run logic immediately.
void updateDiffHistoryFile()

async function updateDiffHistoryFile() {
  console.log('Updating diff history file...')
  const params = process.argv.filter((v) => !v.startsWith('-'))
  const chainName = params[2]
  const projectName = params[3]
  if (!chainName || !projectName) {
    console.error('Pass parameters: <chainName> <projectName>')
    process.exit(1)
  }
  const chainId = ChainId.fromName(chainName)

  // Get discovered.json from main branch and compare to current
  console.log(`Project: ${projectName}`)
  const configReader = new ConfigReader()
  const curDiscovery = await configReader.readDiscovery(projectName, chainId)
  const config = await configReader.readConfig(projectName, chainId)
  const discoveryFolder = `./discovery/${projectName}/${chainName}`
  const { content: DiscoveryJsonFromMainBranch, mainBranchHash } =
    getFileVersionOnMainBranch(`${discoveryFolder}/discovered.json`)
  const discoveryFromMainBranch =
    DiscoveryJsonFromMainBranch === ''
      ? undefined
      : (JSON.parse(DiscoveryJsonFromMainBranch) as DiscoveryOutput)

  const { prevDiscovery, codeDiff } = await performDiscoveryOnPreviousBlock(
    discoveryFromMainBranch,
    projectName,
    chainName,
  )

  const diff = diffDiscovery(
    prevDiscovery?.contracts ?? [],
    curDiscovery.contracts,
    config,
  )

  if (diff.length > 0) {
    const diffHistoryPath = `${discoveryFolder}/diffHistory.md`
    const { content: historyFileFromMainBranch } =
      getFileVersionOnMainBranch(diffHistoryPath)

    let description = undefined
    if (existsSync(diffHistoryPath) && statSync(diffHistoryPath).isFile()) {
      const diskDiffHistory = readFileSync(diffHistoryPath, 'utf-8')
      description = findDescription(diskDiffHistory, historyFileFromMainBranch)
    }

    const newHistoryEntry = generateDiffHistoryMarkdown(
      diff,
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
    console.log('No changes found')
  }
}

async function performDiscoveryOnPreviousBlock(
  discoveryFromMainBranch: DiscoveryOutput | undefined,
  projectName: string,
  chainName: string,
) {
  if (discoveryFromMainBranch === undefined) {
    return { prevDiscovery: undefined, codeDiff: undefined }
  }

  // To check for changes to source code,
  // download sources for block number from main branch
  const root = `discovery/${projectName}/${chainName}`
  // Remove any old sources we fetched before, so that their count doesn't grow
  await rimraf(`${root}/.code@*`, { glob: true })

  const blockNumberFromMainBranch = discoveryFromMainBranch.blockNumber
  const cli = [
    `yarn discover:raw ${chainName} ${projectName}`,
    `--block-number=${blockNumberFromMainBranch}`,
    `--sources-folder=.code@${blockNumberFromMainBranch}`,
    `--discovery-filename=discovered@${blockNumberFromMainBranch}.json`, // we don't need discovered.json
  ].join(' ')
  console.log('Downloading sources from main branch:')
  console.log(cli)
  execSync(cli, { stdio: 'inherit' })

  const prevDiscovery = readFileSync(
    `${root}/discovered@${blockNumberFromMainBranch}.json`,
  ) as unknown as DiscoveryOutput
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
    if (execSync('git show-ref --verify refs/heads/master').toString().trim()) {
      return 'master'
    }
  } catch (error) {
    // If error, it means 'master' doesn't exist, so we'll stick with 'main'
  }
  return 'main'
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
  diffs: DiscoveryDiff[],
  mainBranchHash: string,
  codeDiff?: string,
  description?: string,
): string {
  const result = []
  const mainBranch = getMainBranchName()

  const now = new Date().toUTCString()
  result.push(`# Diff at ${now}:`)
  result.push('')
  const { name, email } = getGitUser()
  result.push(`- author: ${name} (<${email}>)`)
  result.push(`- comparing to: ${mainBranch}@${mainBranchHash}`)
  result.push('')
  if (description) {
    result.push(description)
  } else {
    result.push('## Description')
    result.push('')
    result.push(
      'Provide description of changes. This section will be preserved.',
    )
    result.push('')
  }

  result.push('## Watched changes')
  result.push('')
  result.push(discoveryDiffToMarkdown(diffs))
  result.push('')

  if (codeDiff !== undefined) {
    result.push('## Source code changes')
    result.push('')
    result.push('```diff')
    result.push(codeDiff)
    result.push('```')
    result.push('')
  }

  return result.join('\n')
}

function findDescription(
  diskDiffHistory: string,
  masterDiffHistory: string,
): string | undefined {
  const lastCommitted = masterDiffHistory.split('\n').at(0)
  let lines: string[] = []
  if (lastCommitted) {
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

  const lastIndex = lines.findIndex((l) => l.startsWith('## Watched changes'))
  if (lastIndex < 0) {
    return lines.slice(index).join('\n')
  }

  if (lastIndex < index) {
    return undefined
  }

  return lines.slice(index, lastIndex).join('\n')
}
