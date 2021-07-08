export interface L2Data {
  aggregate: ChartData
  byProject: Record<string, ProjectData>
}

export interface ProjectData {
  aggregate: ChartData
  byToken: Record<string, ChartData>
}

export interface ChartData {
  types: ['date', string, string]
  data: [string, number, number][]
}
