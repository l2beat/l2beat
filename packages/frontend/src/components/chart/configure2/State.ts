export interface State {
  tvlEndpoint: string | undefined
  tvlResponse: AggregateTvlResponse | undefined
  activityEndpoint: string | undefined
  activityResponse: ActivityResponse | undefined
  tokenTvlResponses: Record<string, TokenTvlResponse | undefined>

  labels: string[] | undefined
  chart: AggregateTvlChart | TokenTvlChart | ActivityChart | undefined
  days: number
  isLogScale: boolean
  dateRange: string | undefined
  showHoverAtIndex: number | undefined

  lastRequestId: number
  isFetching: boolean
  showLoader: boolean
}

export interface AggregateTvlChart {
  type: 'AggregateTvlChart'
  currency: 'USD' | 'ETH'
  points: {
    x: number
    y: number
    date: string
    usd: string
    eth: string
  }[]
}

export interface TokenTvlChart {
  type: 'TokenTvlChart'
  token: string
  points: {
    x: number
    y: number
    date: string
    balance: string
    usd: string
  }[]
}

export interface ActivityChart {
  type: 'ActivityChart'
  showEthereum: boolean
  points: {
    x: number
    y1: number
    y2: number
    date: string
    tps: string
    ethereumTps: string
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
