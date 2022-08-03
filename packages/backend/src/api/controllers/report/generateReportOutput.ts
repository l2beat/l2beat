import { UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../../model'
import { OutputEntry } from './aggregateReportsDaily'
import { asNumber } from './asNumber'

export interface ReportOutput {
  aggregate: Chart
  byProject: Record<string, ProjectData>
}

export interface ProjectData {
  aggregate: Chart
  byToken: Record<string, Chart>
}

export interface Chart {
  types: ['date', string, string]
  data: [string, number, number][]
}

export function generateReportOutput(
  entries: OutputEntry[],
  projects: ProjectInfo[],
): ReportOutput {
  const report: ReportOutput = {
    aggregate: {
      types: ['date', 'usd', 'eth'],
      data: [],
    },
    byProject: {},
  }

  for (const p of projects) {
    const project: ProjectData = {
      aggregate: {
        types: ['date', 'usd', 'eth'],
        data: [],
      },
      byToken: {},
    }
    report.byProject[p.name] = project
  }

  for (const entry of entries) {
    // we subtract a day so that the date represents the end of that day
    const date = timestampToDate(entry.timestamp.add(-1, 'days'))
    report.aggregate.data.push([
      date,
      asNumber(entry.value.usd, 2),
      asNumber(entry.value.eth, 6),
    ])

    for (const [name, projectEntry] of entry.projects) {
      const project = report.byProject[name]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!project) {
        throw new Error('Programmer error: Reports not filtered correctly')
      }

      project.aggregate.data.push([
        date,
        asNumber(projectEntry.value.usd, 2),
        asNumber(projectEntry.value.eth, 6),
      ])

      for (const [symbol, tokenValue] of projectEntry.tokens) {
        let token = project.byToken[symbol]
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!token) {
          token = {
            types: ['date', symbol.toLocaleLowerCase(), 'usd'],
            data: [],
          }
          project.byToken[symbol] = token
        }

        token.data.push([
          date,
          +asNumber(tokenValue.balance, tokenValue.decimals).toFixed(6),
          asNumber(tokenValue.usd, 2),
        ])
      }
    }
  }

  return report
}

function timestampToDate(timestamp: UnixTime) {
  return timestamp.toDate().toISOString().slice(0, 10)
}
