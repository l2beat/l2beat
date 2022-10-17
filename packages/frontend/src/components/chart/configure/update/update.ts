import { Effect } from '../effects/effects'
import { Message } from '../messages'
import { State } from '../state/State'
import { updateControlsChanged } from './updateControlsChanged'
import { updateInit } from './updateInit'
import { updateLoadedOrFailed } from './updateLoadedOrFailed'
import { updateLoaderTimedOut } from './updateLoaderTimedOut'
import { updateMoreTokensClicked } from './updateMoreTokensClicked'
import { updateMouseExited } from './updateMouseExited'
import { updateMouseMoved } from './updateMouseMoved'
import { updateShowAlternativeTvlChanged } from './updateShowAlternativeTvlChanged'
import { updateTokenChanged } from './updateTokenChanged'
import { updateViewChanged } from './updateViewChanged'

export function update(state: State, message: Message): [State, Effect[]] {
  switch (message.type) {
    case 'Init':
      return updateInit(message)
    case 'ViewChanged':
      return updateViewChanged(state, message)
    case 'TokenChanged':
      return updateTokenChanged(state, message)
    case 'ShowAlternativeTvlChanged':
      return updateShowAlternativeTvlChanged(state, message)
    case 'DaysChanged':
    case 'CurrencyChanged':
    case 'ShowEthereumChanged':
    case 'ScaleChanged':
      return updateControlsChanged(state, message)
    case 'MouseMoved':
      return updateMouseMoved(state, message)
    case 'MouseExited':
      return updateMouseExited(state)
    case 'MoreTokensClicked':
      return updateMoreTokensClicked(state)
    case 'AggregateTvlLoaded':
    case 'AggregateTvlFailed':
    case 'AlternativeTvlLoaded':
    case 'AlternativeTvlFailed':
    case 'TokenTvlLoaded':
    case 'TokenTvlFailed':
    case 'ActivityLoaded':
    case 'ActivityFailed':
      return updateLoadedOrFailed(state, message)
    case 'LoaderTimedOut':
      return updateLoaderTimedOut(state, message)
  }
}
