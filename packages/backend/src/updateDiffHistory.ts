import { ConfigReader, diffDiscovery,DiscoveryDiff } from "@l2beat/discovery"
// eslint-disable-next-line import/no-extraneous-dependencies
import { DiscoveryOutput } from "@l2beat/discovery-types";
import { ChainId } from "@l2beat/shared-pure"
import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { toUpper } from "lodash";

function getPreviousVersion(filePath: string): string {
  try {
    return execSync(`git show HEAD:${filePath} 2>/dev/null`).toString();
  } catch (e) {
    console.log(`No previous version of ${filePath} found`)
    return ''
  }
}

function getGitUser(): [string, string] {
  try {
    const name = execSync('git config user.name').toString().trim()
    const email = execSync('git config user.email').toString().trim()
    return [name, email]
  } catch (e) {
    console.log('No git user found')
    return ['unknown', 'unknown']
  }
}

function formatContractDiff(diff: DiscoveryDiff): string {
  const result = []
  result.push(`### ${diff.name} (${diff.address.toString()})`)
  // result.push(`Address: ${diff.address.toString()}`)
  if (diff.type) {
    result.push(`Status: ${toUpper(diff.type)}`)
  }
  if (diff.diff) {
    result.push('  ```diff')
    for (const valueDiff of diff.diff) {
      result.push(`  * ${valueDiff.key ?? 'unknown'}`)
      if (valueDiff.before) {
        result.push(`  -   ${valueDiff.before}`)
      }
      if (valueDiff.after) {
        result.push(`  +   ${valueDiff.after}`)
      }
      result.push('')
    }
    result.push('  ```')
  }
  return result.join('\n')
}

function formatFullDiff(diffs: DiscoveryDiff[]): string {
  const result = []
  for (const diff of diffs) {
    result.push(
      formatContractDiff(diff)
    )
  }
  return result.join('\n\n')
}

function generateReport(diffs: DiscoveryDiff[]): string {
  const result = []

  const now = new Date().toUTCString()
  result.push(`## Diff at ${now}:`)
  const [name, email] = getGitUser()
  result.push(`author: ${name} (<${email}>)\n`)
  result.push(formatFullDiff(diffs))
  result.push('\n------------------------------------------------------------\n')

  return result.join('\n')
}

export async function updateDiffHistory() {
  console.log('Generating report for discovery diff')
  const chainName = process.argv[2]
  const projectName = process.argv[3]
  // if projectName is undefined, it should show info and exit with error
  if (!chainName || !projectName) {
    console.error('Usage: yarn diff-report <chainName> <projectName>')
    process.exit(1)
  }
  const chainId = ChainId.fromName(chainName)

  console.log(`Project: ${projectName}`)
  const configReader = new ConfigReader()
  const curDiscovery = await configReader.readDiscovery(projectName, chainId)
  const config = await configReader.readConfig(projectName, chainId)
  const headDiscoveryJSON = getPreviousVersion(`./discovery/${projectName}/${chainName}/discovered.json`)
  const gitHeadDiscovery = JSON.parse(headDiscoveryJSON) as DiscoveryOutput
  const diff = diffDiscovery( gitHeadDiscovery.contracts, curDiscovery.contracts, config)
  
  const report = generateReport(diff)
  const diffHistoryPath = `./discovery/${projectName}/${chainName}/diffReport.md`
  let gitHeadReport = ''
  gitHeadReport = getPreviousVersion(diffHistoryPath)
  const diffHistory = report.concat(gitHeadReport)
  writeFileSync(diffHistoryPath, diffHistory)
}

void updateDiffHistory()