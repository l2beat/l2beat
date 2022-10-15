import { State } from '../state/State'

export function calculateView(
  responses: State['responses'],
  controls: State['controls'],
): State['view'] | undefined {
  return {
    chart: undefined,
    dateRange: undefined,
    labels: undefined,
    showHoverAtIndex: undefined,
  }
}
