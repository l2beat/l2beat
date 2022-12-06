import { Effect } from '../effects/effects'
import {
  CurrencyChangedMessage,
  DaysChangedMessage,
  ScaleChangedMessage,
  ShowAlternativeTvlChangedMessage,
  ShowEthereumChangedMessage,
  TokenChangedMessage,
} from '../messages'
import { State } from '../state/State'
import { calculateView } from './view/calculateView'

export function updateControlsChanged(
  state: State,
  message:
    | DaysChangedMessage
    | CurrencyChangedMessage
    | TokenChangedMessage
    | ShowEthereumChangedMessage
    | ScaleChangedMessage
    | ShowAlternativeTvlChangedMessage,
): [State, Effect[]] {
  const controls: State['controls'] = { ...state.controls }
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
    view: calculateView(state.data, controls) ?? state.view,
  }

  return [newState, []]
}
