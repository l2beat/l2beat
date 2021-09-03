interface OutputData {
  aggregate: Chart
  byProject: Record<string, ProjectData>
  experimental: Record<string, ExperimentalData>
}

interface ProjectData {
  aggregate: Chart
  byToken: Record<string, Chart>
}

interface Chart {
  types: ['date', string, string]
  data: [string, number, number][]
}

interface ExperimentalData {
  usdIn7DayNoEth: number
  usdOut7DayNoEth: number
  batchCount7d?: number
  messageCount7d?: number
}

declare const l2Data: OutputData
export = l2Data
