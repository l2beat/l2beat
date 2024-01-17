import {
  DiffHistoryApiResponse,
  DiscoveryDiff,
  UnixTime,
} from '@l2beat/shared-pure'
import toUpper from 'lodash/toUpper'

// TODO(radomski): Would be nice this in discovery package or in shared-pure,
// this is duplicated here and updateDiffHistory.ts
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

export function diffHistoryToMarkdown(
  changes: DiffHistoryApiResponse[0]['changes'],
): string {
  return changes
    .map((change) => {
      return `## ${new UnixTime(
        +change.timestamp,
      ).toYYYYMMDD()}\n\n${discoveryDiffToMarkdown(change.diffs)}\n\n`
    })
    .reverse()
    .join('\n')
}
