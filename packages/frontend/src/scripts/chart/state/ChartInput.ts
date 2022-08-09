export interface ChartInput {
  types: ['timestamp', string, string]
  data: [number, number, number][]
}

export interface Charts {
  hourly: ChartInput
  sixHourly: ChartInput
  daily: ChartInput
}
