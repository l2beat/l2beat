import { UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../../model'
import { OutputEntry } from './aggregateReportsDaily'
import { asNumber } from './asNumber'

export interface ReportOutput {
  aggregate: Chart
  byProject: Record<string, ProjectData>
  byTechnologyType: Record<string, Chart>
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
  const projectToTechnologyMapping: Map<string,string>  = new Map();
  const byTechnologyTypeMappingToDates = new Map<
    string,
    Map<string, [string, number, number]>
  >()

  const report: ReportOutput = {
    aggregate: {
      types: ['date', 'usd', 'eth'],
      data: [],
    },
    byTechnologyType: {},
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
    report.byTechnologyType[p.technology] = {
        types: ['date', 'usd', 'eth'],
        data: [],
    }

    projectToTechnologyMapping.set(p.name, p.technology)
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
      const technology = projectToTechnologyMapping.get(name)
      if (!technology) {
        throw new Error('Programmer error: name to technology not mapped correctly')
      }
      
      const project = report.byProject[name]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!project) {
        throw new Error('Programmer error: Reports not filtered correctly')
      }


      const entryUSDValue = asNumber(projectEntry.value.usd, 2)
      const entryETHValue = asNumber(projectEntry.value.eth, 6)

      const datesForTechnology = byTechnologyTypeMappingToDates.get(technology)
      if (datesForTechnology) {
        const hasEntryForDate = datesForTechnology.get(date)
        datesForTechnology.set(date, [
          date,
          hasEntryForDate ?  entryUSDValue + hasEntryForDate[1] : entryUSDValue,
          hasEntryForDate ?  entryETHValue + hasEntryForDate[2] : entryETHValue,
        ])
      } else {
        const dateMap = new Map()
        dateMap.set(date, [date, entryUSDValue, entryETHValue,])
        byTechnologyTypeMappingToDates.set(technology, dateMap)
      }
   
      project.aggregate.data.push([
        date,
        entryUSDValue,
        entryETHValue,
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


  for (const [technology, projectEntry] of byTechnologyTypeMappingToDates) {
    report.byTechnologyType[technology].data.push(...Array.from(projectEntry.values()))
  }
  return report
}

function timestampToDate(timestamp: UnixTime) {
  return timestamp.toDate().toISOString().slice(0, 10)
}
