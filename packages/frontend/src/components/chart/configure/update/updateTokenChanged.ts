import { Effect } from '../effects/effects'
import { TokenChangedMessage } from '../messages'
import { State } from '../state/State'
import { calculateView } from './view/calculateView'

export function updateTokenChanged(
  state: State,
  message: TokenChangedMessage,
): [State, Effect[]] {
  const controls: State['controls'] = {
    ...state.controls,
    token: message.token,
  }

  const request: State['request'] = { ...state.request }
  const effects: Effect[] = []

  if (state.data.tokenTvl[message.token] === undefined) {
    request.isFetching = true
    request.lastId++
    effects.push({
      type: 'FetchTokenTvl',
      requestId: request.lastId,
      token: message.token,
      url: message.tokenEndpoint,
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
