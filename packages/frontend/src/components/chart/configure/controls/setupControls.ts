import { ChartElements } from '../elements'
import { Message, ViewChangedMessage } from '../messages'
import { onCheckboxChange } from './onCheckboxChange'
import { onMouseMove } from './onMouseMove'
import { onRadioChange } from './onRadioChange'
import { stopEventsPropagation } from './stopEventsPropagation'
import { toDays } from './toDays'

export function setupControls(
  elements: ChartElements,
  dispatch: (message: Message) => void,
) {
  onRadioChange(elements.controls.days, (control) => {
    dispatch({ type: 'DaysChanged', days: toDays(control.value) })
  })

  onRadioChange(elements.controls.currency, (control) => {
    dispatch({
      type: 'CurrencyChanged',
      currency: control.value === 'ETH' ? 'eth' : 'usd',
    })
  })

  onRadioChange(elements.controls.tokens, (control) => {
    if (control.dataset.tvlEndpoint) {
      if (elements.view.tokenModal && elements.controls.showTokenModal) {
        elements.view.tokenModal.classList.toggle('opacity-0')
        elements.view.tokenModal.classList.toggle('pointer-events-none')
        elements.controls.showTokenModal.checked = false;
      }

      dispatch({
        type: 'TokenChanged',
        token: control.value,
        tokenEndpoint: control.dataset.tvlEndpoint,
      })
    }
  })

  onRadioChange(elements.controls.scale, (control) => {
    dispatch({ type: 'ScaleChanged', isLogScale: control.value === 'LOG' })
  })

  onCheckboxChange(elements.controls.showCombined, (checked) => {
    dispatch({ type: 'ShowAlternativeTvlChanged', showAlternativeTvl: checked })
  })

  onRadioChange(elements.controls.chartType, (control) => {
    let view: ViewChangedMessage['view'] = 'tvl'
    switch (control.value) {
      case 'detailedTvl':
        view = 'detailedTvl'
        break
      case 'activity':
        view = 'activity'
        break
    }

    dispatch({
      type: 'ViewChanged',
      view: view,
    })
  })

  onCheckboxChange(elements.controls.showEthereum, (checked) => {
    dispatch({ type: 'ShowEthereumChanged', showEthereum: checked })
  })

  if (elements.view.view) {
    onMouseMove(elements.view.view, dispatch)
  }

  stopEventsPropagation(elements)
}
