import { Effect } from '../effects'
import { InitMessage } from '../messages'
import { State } from '../State'

export function updateInit(message: InitMessage): [State, Effect[]] {
  let effect: Effect
  if (message.initialView === 'tvl') {
    if (!message.tvlEndpoint) {
      throw new Error('Invalid init message, missing tvl endpoint!')
    }
    effect = {
      type: 'FetchAggregateTvlEffect',
      url: message.tvlEndpoint,
      requestId: 1,
    }
  } else {
    if (!message.activityEndpoint) {
      throw new Error('Invalid init message, missing activity endpoint!')
    }
    effect = {
      type: 'FetchActivityEffect',
      url: message.activityEndpoint,
      requestId: 1,
    }
  }

  return [
    {
      tvlEndpoint: message.tvlEndpoint,
      tvlResponse: undefined,
      activityEndpoint: message.activityEndpoint,
      activityResponse: undefined,
      tokenTvlResponses: {},

      labels: undefined,
      chart: undefined,
      days: message.days,
      isLogScale: false,
      dateRange: undefined,
      showHoverAtIndex: undefined,

      lastRequestId: 0,
      isFetching: true,
      showLoader: false,
    },
    [effect, { type: 'LoaderTimeoutEffect', requestId: 1 }],
  ]
}
