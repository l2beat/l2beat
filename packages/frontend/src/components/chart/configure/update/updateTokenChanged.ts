import { Effect } from '../effects/effects'
import { TokenChangedMessage } from '../messages'
import { getTokenTvlKey } from '../state/getTokenTvlKey'
import { State } from '../state/State'
import { calculateView } from './view/calculateView'

export function updateTokenChanged(
  state: State,
  message: TokenChangedMessage,
): [State, Effect[]] {
  const controls: State['controls'] = {
    ...state.controls,
    token: message.token,
    assetType: message.assetType,
  }

  const request: State['request'] = { ...state.request }
  const effects: Effect[] = []

  const key = getTokenTvlKey(message.token, message.assetType)
  if (state.data.tokenTvl[key] === undefined) {
    request.isFetching = true
    request.lastId++
    effects.push({
      type: 'FetchTokenTvl',
      requestId: request.lastId,
      token: message.token,
      assetType: message.assetType,
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
