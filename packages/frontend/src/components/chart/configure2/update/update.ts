import { Effect } from '../effects/effects'
import { Message } from '../messages'
import { State } from '../state/State'
import { updateInit } from './updateInit'
import { updateLoadedOrFailed } from './updateLoadedOrFailed'

export function update(state: State, message: Message): [State, Effect[]] {
  if (message.type === 'Init') {
    return updateInit(message)
  } else if (
    message.type === 'AggregateTvlLoaded' ||
    message.type === 'AggregateTvlFailed' ||
    message.type === 'AlternativeTvlLoaded' ||
    message.type === 'AlternativeTvlFailed' ||
    message.type === 'TokenTvlLoaded' ||
    message.type === 'TokenTvlFailed' ||
    message.type === 'ActivityLoaded' ||
    message.type === 'ActivityFailed'
  ) {
    return updateLoadedOrFailed(state, message)
  }
  throw new Error('Unknown message type!')
}
