import { assert, DiffHistoryApiResponse, DiscoveryDiff, ProjectId, UnixTime } from '@l2beat/shared-pure'
import toUpper from 'lodash/toUpper'
import React from 'react'

import { Config } from '../../../build/config'
import { Markdown } from '../../../components/Markdown'
import { PagesData } from '../../Page'

function getProjectSlug(config: Config, project: string) {
  const l2 = config.layer2s.find((layer2) => layer2.id === ProjectId(project))
  assert(l2 !== undefined)
  return l2.display.slug
}

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

function diffHistoryToMarkdown(
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

export function getDiffHistoryPages(config: Config, diffHistory: DiffHistoryApiResponse) {
  return diffHistory.map((entry) => {
    return {
      slug: `/scaling/projects/${getProjectSlug(
        config,
        entry.project,
      )}/changelog`,
      page: <Markdown>{diffHistoryToMarkdown(entry.changes)}</Markdown>,
    }
  })
}
