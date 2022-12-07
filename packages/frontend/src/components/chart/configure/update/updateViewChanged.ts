import { Effect } from '../effects/effects'
import { ViewChangedMessage } from '../messages'
import { State } from '../state/State'
import { calculateView } from './view/calculateView'

export function updateViewChanged(
  state: State,
  message: ViewChangedMessage,
): [State, Effect[]] {
  const controls: State['controls'] = {
    ...state.controls,
    view: message.view,
    days: Math.max(state.controls.days, message.view === 'activity' ? 30 : 0),
  }

  const request: State['request'] = { ...state.request }
  const effects: Effect[] = []

  if (message.view === 'activity' && state.data.activity === undefined) {
    if (!state.endpoints.activity) {
      throw new Error('Invalid state: activity endpoint missing')
    }
    request.isFetching = true
    request.lastId++
    effects.push({
      type: 'FetchActivity',
      requestId: request.lastId,
      url: state.endpoints.activity,
    })
  }

  if (
    message.view === 'tvl' &&
    state.controls.showAlternativeTvl &&
    state.data.alternativeTvl === undefined
  ) {
    if (!state.endpoints.alternativeTvl) {
      throw new Error('Invalid state: alternative tvl endpoint missing')
    }
    request.isFetching = true
    request.lastId++
    effects.push({
      type: 'FetchAlternativeTvl',
      requestId: request.lastId,
      url: state.endpoints.alternativeTvl,
    })
  }

  if (
    message.view === 'tvl' &&
    !state.controls.showAlternativeTvl &&
    state.data.aggregateTvl === undefined
  ) {
    if (!state.endpoints.aggregateTvl) {
      throw new Error('Invalid state: aggregate tvl endpoint missing')
    }
    request.isFetching = true
    request.lastId++
    effects.push({
      type: 'FetchAggregateTvl',
      requestId: request.lastId,
      url: state.endpoints.aggregateTvl,
    })
  }

  // we do not check token tvl because it is impossible for it to be selected
  // without making an appropriate request first

  const newState: State = {
    ...state,
    request,
    controls,
    view: calculateView(state.data, controls) ?? state.view,
  }

  return [newState, effects]
}
