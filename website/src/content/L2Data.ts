export interface L2Data {
  aggregate: ChartData
  byProject: Record<string, ProjectData>
  experimental: Record<string, ExperimentalData>
}

export interface ProjectData {
  aggregate: ChartData
  byToken: Record<string, ChartData>
}

export interface ChartData {
  types: ['date', string, string]
  data: [string, number, number][]
}

export interface ExperimentalData {
  usdIn7DayNoEth: number
  usdOut7DayNoEth: number
}
