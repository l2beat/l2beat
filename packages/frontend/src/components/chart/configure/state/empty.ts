import { State } from './State'

export const EMPTY_STATE: State = {
  endpoints: {
    aggregateTvl: undefined,
    alternativeTvl: undefined,
    activity: undefined,
  },
  request: {
    lastId: 0,
    isFetching: false,
    showLoader: false,
  },
  data: {
    aggregateTvl: undefined,
    alternativeTvl: undefined,
    activity: undefined,
    tokenTvl: {},
    milestones: {},
  },
  controls: {
    view: 'tvl',
    pagePathname: '',
    days: 0,
    isLogScale: false,
    currency: 'usd',
    token: undefined,
    showEthereum: false,
    showAlternativeTvl: false,
    mouseX: undefined,
    showMoreTokens: false,
    labelCount: 0,
  },
  view: {
    dateRange: undefined,
    labels: undefined,
    showHoverAtIndex: undefined,
    showMilestoneHover: undefined,
    chart: undefined,
  },
}
