import { Effect } from '../effects/effects'
import { Message } from '../messages'
import { State } from '../state/State'
import { updateControlsChanged } from './updateControlsChanged'
import { updateInit } from './updateInit'
import { updateLoadedOrFailed } from './updateLoadedOrFailed'

export function update(state: State, message: Message): [State, Effect[]] {
  switch (message.type) {
    case 'Init':
      return updateInit(message)
    case 'ViewChanged':
    case 'DaysChanged':
    case 'CurrencyChanged':
    case 'TokenChanged':
    case 'ShowEthereumChanged':
    case 'ScaleChanged':
    case 'ShowAlternativeTvlChanged':
      return updateControlsChanged(state, message)
    case 'AggregateTvlLoaded':
    case 'AggregateTvlFailed':
    case 'AlternativeTvlLoaded':
    case 'AlternativeTvlFailed':
    case 'TokenTvlLoaded':
    case 'TokenTvlFailed':
    case 'ActivityLoaded':
    case 'ActivityFailed':
      return updateLoadedOrFailed(state, message)
    default:
      throw new Error('Unknown message type!')
  }
}
