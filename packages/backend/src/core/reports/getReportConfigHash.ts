import { sortBy } from 'lodash'

import { Project } from '../../model'
import { hashJson } from '../../tools/hashJson'

// Increment this value to change the hash which in turn causes the system to
// recalculate reports
const REPORT_LOGIC_VERSION = 0

export type ReportProject = Pick<Project, 'projectId' | 'type' | 'escrows'>

export function getReportConfigHash(projects: ReportProject[]) {
  return hashJson([getEntries(projects), REPORT_LOGIC_VERSION])
}

export function getEntries(projects: ReportProject[]) {
  const entries = []
  for (const { projectId, escrows, type } of projects) {
    for (const { tokens, address, sinceTimestamp } of escrows) {
      for (const token of tokens) {
        entries.push({
          projectId: projectId.toString(),
          type,
          holder: address.toString(),
          holderSinceTimestamp: sinceTimestamp.toNumber(),
          assetId: token.id.toString(),
          assetSinceTimestamp: token.sinceTimestamp.toNumber(),
        })
      }
    }
  }
  return sortBy(entries, ['projectId', 'holder', 'assetId'])
}
