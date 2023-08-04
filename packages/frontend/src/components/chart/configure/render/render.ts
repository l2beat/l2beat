import { toDays } from '../controls/toDays'
import { ChartElements } from '../elements'
import { State } from '../state/State'
import { renderChart } from './renderChart'
import { renderHover } from './renderHover'
import { renderMilestones } from './renderMilestones'

export function render(
  elements: ChartElements,
  previousState: State,
  state: State,
) {
  if (previousState === state) {
    // multiple renders must have happened in the same animation frame
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

  if (state.controls.isLogScale !== previousState.controls.isLogScale) {
    const scaleValue = state.controls.isLogScale ? 'LOG' : 'LIN'
    for (const input of elements.controls.scale) {
      input.checked = input.value === scaleValue
    }
  }

  if (state.controls.days !== previousState.controls.days) {
    for (const input of elements.controls.days) {
      input.checked = toDays(input.value) === state.controls.days
    }
  }

  if (state.controls.showEthereum !== previousState.controls.showEthereum) {
    if (elements.controls.showEthereum) {
      elements.controls.showEthereum.checked = state.controls.showEthereum
    }
  }

  if (state.controls.view !== previousState.controls.view) {
    const isTvl = state.controls.view === 'tvl'
    const isDetailedTvl = state.controls.view === 'detailedTvl'
    const sevenDayRadio = elements.controls.days.find(
      (x) => toDays(x.value) === 7,
    )?.parentElement
    const toggle = !isTvl && !isDetailedTvl

    sevenDayRadio?.classList.toggle('hidden', toggle)
    elements.view.currencyControlsWrapper?.classList.toggle('hidden', toggle)
    elements.view.tokenControlsWrapper?.classList.toggle('hidden', toggle)
    elements.controls.showEthereum?.parentElement?.classList.toggle(
      'hidden',
      !toggle,
    )
  }

  if (
    state.view !== previousState.view ||
    state.controls.theme !== previousState.controls.theme
  ) {
    if (elements.view.dateRange) {
      elements.view.dateRange.innerHTML = state.view.dateRange ?? '...'
    }

    const ctx = elements.view.canvas?.getContext('2d')
    if (elements.view.canvas && ctx) {
      const drawYAxis = elements.view.canvas.dataset.isMeta === 'false'
      renderChart(state, elements.view.canvas, ctx, drawYAxis)
    }

    if (elements.view.milestones) {
      if (
        previousState.controls.days !== state.controls.days ||
        previousState.view.chart?.type !== state.view.chart?.type ||
        !previousState.view.chart?.points
      ) {
        renderMilestones(state, elements.view.milestones)
      }
    }
  }

  if (state.controls.token !== previousState.controls.token) {
    if (state.controls.token) {
      if (elements.controls.showTokenModal) {
        elements.controls.showTokenModal.checked = false
      }

      elements.view.tokenModal?.classList.toggle('opacity-0', true)
      elements.view.tokenModal?.classList.toggle('pointer-events-none', true)
      elements.view.showTokenModalWrapper?.classList.toggle('hidden', true)
      elements.view.tokenChosenWrapper?.classList.toggle('hidden', false)
      const paragraph = elements.view.tokenChosenWrapper?.querySelector('p')
      if (paragraph) {
        paragraph.innerText = state.controls.token
      }
    } else {
      elements.view.showTokenModalWrapper?.classList.toggle('hidden')
      elements.view.tokenChosenWrapper?.classList.toggle('hidden')
    }
  }

  if (state.controls.showMoreTokens !== previousState.controls.showMoreTokens) {
    if (state.controls.showMoreTokens) {
      console.log(elements.controls.tokens)
      elements.controls.tokens.forEach((x) =>
        x.parentElement?.classList.remove('hidden'),
      )
      elements.controls.showMoreTokensToBeRemoved?.classList.add('hidden')
    }
  }

  renderHover(elements, previousState, state)
}
