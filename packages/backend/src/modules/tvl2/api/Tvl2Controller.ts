export interface Tvl2Result {
  projects: {
    [projectId: string]: Tvl2ProjectResult
  }
  ethereumPrices: Tvl2MultiIntervalSeries
}

export interface Tvl2MultiIntervalSeries {
  daily: Tvl2TimeSeries
  sixHourly: Tvl2TimeSeries
  hourly: Tvl2TimeSeries
}

export interface Tvl2TimeSeries {
  since: number
  offset: number
  values: number[]
}

export interface Tvl2ProjectResult {
  since: number // unix timestamp
}

export class Tvl2Controller {
  async getTvl() {}
}
