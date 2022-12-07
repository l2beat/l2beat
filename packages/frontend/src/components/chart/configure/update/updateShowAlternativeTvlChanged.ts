import { Effect } from '../effects/effects'
import { ShowAlternativeTvlChangedMessage } from '../messages'
import { State } from '../state/State'
import { calculateView } from './view/calculateView'

export function updateShowAlternativeTvlChanged(
  state: State,
  message: ShowAlternativeTvlChangedMessage,
): [State, Effect[]] {
  const controls: State['controls'] = {
    ...state.controls,
    showAlternativeTvl: message.showAlternativeTvl,
  }

  const request: State['request'] = { ...state.request }
  const effects: Effect[] = []

  if (message.showAlternativeTvl && state.data.alternativeTvl === undefined) {
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

  const newState: State = {
    ...state,
    request,
    controls,
    view: calculateView(state.data, controls) ?? state.view,
  }

  return [newState, effects]
}
