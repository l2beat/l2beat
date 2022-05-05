import { UnixTime } from '@l2beat/common'

import { asNumber } from '../../../utils/asNumber'
import { OutputEntry } from './aggregateReportsDaily'

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

export function generateReportOutput(entries: OutputEntry[]): ReportOutput {
  const report: ReportOutput = {
    aggregate: {
      types: ['date', 'usd', 'eth'],
      data: [],
    },
    byProject: {},
  }

  for (const entry of entries) {
    const date = timestampToDate(entry.timestamp)
    report.aggregate.data.push([
      date,
      asNumber(entry.value.usd, 2),
      asNumber(entry.value.eth, 6),
    ])

    for (const [name, projectEntry] of entry.projects) {
      let project = report.byProject[name]
      if (!project) {
        project = {
          aggregate: {
            types: ['date', 'usd', 'eth'],
            data: [],
          },
          byToken: {},
        }
        report.byProject[name] = project
      }

      project.aggregate.data.push([
        date,
        asNumber(projectEntry.value.usd, 2),
        asNumber(projectEntry.value.eth, 6),
      ])

      for (const [symbol, tokenValue] of projectEntry.tokens) {
        let token = project.byToken[symbol]
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
