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

  const responses: State['responses'] = { ...state.responses }
  if (message.type === 'AggregateTvlLoaded') {
    responses.aggregateTvl = message.data
  }
  if (message.type === 'AlternativeTvlLoaded') {
    responses.alternativeTvl = message.data
  }
  if (message.type === 'TokenTvlLoaded') {
    responses.tokenTvl = {
      ...state.responses.tokenTvl,
      [message.token]: message.data,
    }
  }
  if (message.type === 'ActivityLoaded') {
    responses.activity = message.data
  }

  const newState: State = {
    ...state,
    request: updateRequest(state.request, message),
    responses,
    view: calculateView(responses, state.controls) ?? state.view,
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
