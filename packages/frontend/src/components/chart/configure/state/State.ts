export interface State {
  endpoints: {
    aggregateTvl: string | undefined
    alternativeTvl: string | undefined
    activity: string | undefined
  }
  request: {
    lastId: number
    isFetching: boolean
    showLoader: boolean
  }
  responses: {
    aggregateTvl: AggregateTvlResponse | undefined
    alternativeTvl: AggregateTvlResponse | undefined
    activity: ActivityResponse | undefined
    tokenTvl: Record<string, TokenTvlResponse | undefined>
  }
  controls: {
    view: 'tvl' | 'activity'
    days: number
    isLogScale: boolean
    currency: 'usd' | 'eth'
    token: string | undefined
    showEthereum: boolean
    showAlternativeTvl: boolean
    mouseX: number | undefined
    showMoreTokens: boolean
    labelCount: number
  }
  view: {
    dateRange: string | undefined
    labels: string[] | undefined
    showHoverAtIndex: number | undefined
    chart: AggregateTvlChart | TokenTvlChart | ActivityChart | undefined
  }
}

export interface AggregateTvlChart {
  type: 'AggregateTvlChart'
  points: {
    x: number
    y: number
    date: string
    usd: number
    eth: number
  }[]
}

export interface TokenTvlChart {
  type: 'TokenTvlChart'
  points: {
    x: number
    y: number
    date: string
    balance: number
    symbol: string
    usd: number
  }[]
}

export interface ActivityChart {
  type: 'ActivityChart'
  points: {
    x: number
    y: number
    y2: number
    date: string
    tps: number
    ethereumTps: number
  }[]
}

export interface AggregateTvlResponse {
  hourly: {
    types: ['timestamp', 'usd', 'eth']
    data: [number, number, number][]
  }
  sixHourly: {
    types: ['timestamp', 'usd', 'eth']
    data: [number, number, number][]
  }
  daily: {
    types: ['timestamp', 'usd', 'eth']
    data: [number, number, number][]
  }
}

export interface TokenTvlResponse {
  hourly: {
    types: ['timestamp', string, 'usd']
    data: [number, number, number][]
  }
  sixHourly: {
    types: ['timestamp', string, 'usd']
    data: [number, number, number][]
  }
  daily: {
    types: ['timestamp', string, 'usd']
    data: [number, number, number][]
  }
}

export interface ActivityResponse {
  daily: {
    types: ['timestamp', 'transactions', 'ethereumTransactions']
    data: [number, number, number][]
  }
}
