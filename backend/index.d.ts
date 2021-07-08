interface OutputData {
  aggregate: Chart
  byProject: Record<string, ProjectData>
}

interface ProjectData {
  aggregate: Chart
  byToken: Record<string, Chart>
}

interface Chart {
  types: ['date', string, string]
  data: [string, number, number][]
}

declare const l2Data: OutputData
export = l2Data
