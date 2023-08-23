import { State } from '../../state/State'
import { calculateActivityView } from './calculateActivityView'
import { calculateRegularDetailedTvlView } from './calculateDetailedTvlView'
import { calculateRegularTvlView } from './calculateRegularTvlView'
import { calculateTokenDetailedTvlView } from './calculateTokenDetailedTvlView'
import { calculateTokenTvlView } from './calculateTokenTvlView'

export function calculateView(
  data: State['data'],
  controls: State['controls'],
): State['view'] | undefined {
  if (controls.view === 'tvl') {
    if (controls.token) {
      return calculateTokenTvlView(data, controls)
    } else {
      return calculateRegularTvlView(data, controls)
    }
  } else if (controls.view === 'detailedTvl') {
    if (controls.token) {
      return calculateTokenDetailedTvlView(data, controls)
    } else {
      return calculateRegularDetailedTvlView(data, controls)
    }
  } else {
    return calculateActivityView(data, controls)
  }
}
