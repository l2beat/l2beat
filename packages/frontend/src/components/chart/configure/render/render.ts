import { toDays } from '../controls/toDays'
import { ChartElements } from '../elements'
import { State } from '../state/State'
import { renderChart } from './renderChart'

export function render(
  elements: ChartElements,
  previousState: State,
  state: State,
) {
  if (previousState === state) {
    return
  }

  if (state.request.showLoader !== previousState.request.showLoader) {
    elements.view.loader?.classList.toggle('hidden', !state.request.showLoader)
  }

  if (
    state.controls.currency !== previousState.controls.currency ||
    state.controls.token !== previousState.controls.token
  ) {
    for (const input of elements.controls.currency) {
      input.checked =
        !state.controls.token &&
        state.controls.currency === input.value.toLowerCase()
    }
    for (const input of elements.controls.tokens) {
      input.checked = input.value === state.controls.token
    }
  }

  if (state.controls.days !== previousState.controls.days) {
    for (const input of elements.controls.days) {
      input.checked = toDays(input.value) === state.controls.days
    }
  }

  if (state.controls.view !== previousState.controls.view) {
    const isTvl = state.controls.view === 'tvl'
    elements.view.currencyControlsWrapper?.classList.toggle('hidden', !isTvl)
    elements.view.tokenControlsWrapper?.classList.toggle('hidden', !isTvl)
    elements.view.showElementControlWrapper?.classList.toggle('hidden', isTvl)
  }

  if (state.view !== previousState.view) {
    const labels = elements.view.labels
    for (let i = 0; i < 5; i++) {
      labels[i].innerHTML = state.view.labels?.[4 - i] ?? '...'
    }

    const ctx = elements.view.canvas?.getContext('2d')
    if (elements.view.canvas && ctx) {
      renderChart(state, elements.view.canvas, ctx)
    }
  }
}
