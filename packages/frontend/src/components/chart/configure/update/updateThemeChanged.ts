import { Effect } from '../effects/effects'
import { ThemeChangedMessage } from '../messages'
import { State } from '../state/State'

export function updateThemeChanged(
  state: State,
  message: ThemeChangedMessage,
): [State, Effect[]] {
  const newState: State = {
    ...state,
    controls: {
      ...state.controls,
      theme: message.isDarkMode ? 'dark' : 'light',
    },
  }

  return [newState, []]
}
