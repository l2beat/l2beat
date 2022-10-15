import { Effect } from '../effects/effects'
import { LoaderTimedOutMessage } from '../messages'
import { State } from '../state/State'

export function updateLoaderTimedOut(
  state: State,
  message: LoaderTimedOutMessage,
): [State, Effect[]] {
  const newState: State = {
    ...state,
    request: {
      ...state.request,
      showLoader:
        state.request.isFetching && state.request.lastId === message.requestId,
    },
  }
  return [newState, []]
}
