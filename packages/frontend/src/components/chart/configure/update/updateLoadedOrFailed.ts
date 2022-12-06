import { Effect } from '../effects/effects'
import {
  ActivityFailedMessage,
  ActivityLoadedMessage,
  AggregateTvlFailedMessage,
  AggregateTvlLoadedMessage,
  AlternativeTvlFailedMessage,
  AlternativeTvlLoadedMessage,
  TokenTvlFailedMessage,
  TokenTvlLoadedMessage,
} from '../messages'
import { State } from '../state/State'
import { calculateView } from './view/calculateView'

export function updateLoadedOrFailed(
  state: State,
  message:
    | AggregateTvlLoadedMessage
    | AggregateTvlFailedMessage
    | AlternativeTvlLoadedMessage
    | AlternativeTvlFailedMessage
    | TokenTvlLoadedMessage
    | TokenTvlFailedMessage
    | ActivityLoadedMessage
    | ActivityFailedMessage,
): [State, Effect[]] {
  if (
    message.type === 'AggregateTvlFailed' ||
    message.type === 'AlternativeTvlFailed' ||
    message.type === 'TokenTvlFailed' ||
    message.type === 'ActivityFailed'
  ) {
    const newState: State = {
      ...state,
      request: updateRequest(state.request, message),
    }
    return [newState, []]
  }

  const data: State['data'] = { ...state.data }
  if (message.type === 'AggregateTvlLoaded') {
    data.aggregateTvl = message.data
  }
  if (message.type === 'AlternativeTvlLoaded') {
    data.alternativeTvl = message.data
  }
  if (message.type === 'TokenTvlLoaded') {
    data.tokenTvl = {
      ...state.data.tokenTvl,
      [message.token]: message.data,
    }
  }
  if (message.type === 'ActivityLoaded') {
    data.activity = message.data
  }

  const newState: State = {
    ...state,
    request: updateRequest(state.request, message),
    data,
    view: calculateView(data, state.controls) ?? state.view,
  }

  return [newState, []]
}

function updateRequest(
  oldRequest: State['request'],
  message: { requestId: number },
): State['request'] {
  return {
    isFetching:
      message.requestId === oldRequest.lastId ? false : oldRequest.isFetching,
    showLoader:
      message.requestId === oldRequest.lastId ? false : oldRequest.showLoader,
    lastId: oldRequest.lastId,
  }
}
