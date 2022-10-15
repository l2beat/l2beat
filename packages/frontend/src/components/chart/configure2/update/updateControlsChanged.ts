import { Effect } from '../effects/effects'
import {
  CurrencyChangedMessage,
  DaysChangedMessage,
  ScaleChangedMessage,
  ShowAlternativeTvlChangedMessage,
  ShowEthereumChangedMessage,
  TokenChangedMessage,
  ViewChangedMessage,
} from '../messages'
import { State } from '../state/State'
import { calculateView } from './calculateView'

export function updateControlsChanged(
  state: State,
  message:
    | ViewChangedMessage
    | DaysChangedMessage
    | CurrencyChangedMessage
    | TokenChangedMessage
    | ShowEthereumChangedMessage
    | ScaleChangedMessage
    | ShowAlternativeTvlChangedMessage,
): [State, Effect[]] {
  const controls: State['controls'] = { ...state.controls }
  if (message.type === 'ViewChanged') {
    controls.view = message.view
    if (controls.view === 'activity') {
      controls.days = Math.max(controls.days, 30)
    }
  }
  if (message.type === 'DaysChanged') {
    controls.days = message.days
  }
  if (message.type === 'CurrencyChanged') {
    controls.currency = message.currency
    controls.token = undefined
  }
  if (message.type === 'TokenChanged') {
    controls.token = message.token
  }
  if (message.type === 'ShowEthereumChanged') {
    controls.showEthereum = message.showEthereum
  }
  if (message.type === 'ScaleChanged') {
    controls.isLogScale = message.isLogScale
  }
  if (message.type === 'ShowAlternativeTvlChanged') {
    controls.showAlternativeTvl = message.showAlternativeTvl
  }

  const newState: State = {
    ...state,
    controls,
    view: calculateView(state.responses, controls) ?? state.view,
  }

  return [newState, []]
}
