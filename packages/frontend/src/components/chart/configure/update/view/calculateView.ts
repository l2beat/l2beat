import { State } from '../../state/State'
import { calculateActivityView } from './calculateActivityView'
import { calculateRegularTvlView } from './calculateRegularTvlView'
import { calculateTokenTvlView } from './calculateTokenTvlView'

export function calculateView(
  responses: State['responses'],
  controls: State['controls'],
): State['view'] | undefined {
  if (controls.view === 'tvl') {
    if (controls.token) {
      return calculateTokenTvlView(responses, controls)
    } else {
      return calculateRegularTvlView(responses, controls)
    }
  } else {
    return calculateActivityView(responses, controls)
  }
}
