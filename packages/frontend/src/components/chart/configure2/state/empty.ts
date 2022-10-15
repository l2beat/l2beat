import { State } from './State'

export const EMPTY_STATE: State = {
  endpoints: {
    aggregateTvl: undefined,
    activity: undefined,
  },
  request: {
    lastId: 0,
    isFetching: false,
    showLoader: false,
  },
  responses: {
    aggregateTvl: undefined,
    activity: undefined,
    tokenTvl: {},
  },
  controls: {
    view: 'tvl',
    days: 0,
    isLogScale: false,
    currency: 'USD',
    token: undefined,
    showEthereum: false,
    mouseX: undefined,
  },
  view: {
    dateRange: undefined,
    labels: undefined,
    showHoverAtIndex: undefined,
    chart: undefined,
  },
}
