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
import { calculateView } from './calculateView'

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

  const responses: State['responses'] = {
    aggregateTvl:
      message.type === 'AggregateTvlLoaded'
        ? message.data
        : state.responses.aggregateTvl,
    alternativeTvl:
      message.type === 'AlternativeTvlLoaded'
        ? message.data
        : state.responses.alternativeTvl,
    tokenTvl:
      message.type === 'TokenTvlLoaded'
        ? { ...state.responses.tokenTvl, [message.token]: message.data }
        : state.responses.tokenTvl,
    activity:
      message.type === 'ActivityLoaded'
        ? message.data
        : state.responses.activity,
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
      oldRequest.lastId < message.requestId ? false : oldRequest.isFetching,
    showLoader:
      oldRequest.lastId < message.requestId ? false : oldRequest.isFetching,
    lastId: Math.max(oldRequest.lastId, message.requestId),
  }
}
