import { toDays } from '../../configure-old/toDays'
import { ChartElements } from '../elements'
import { Message } from '../messages'
import { onCheckboxChange } from './onCheckboxChange'
import { onRadioChange } from './onRadioChange'

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

  onRadioChange(elements.controls.scale, (control) => {
    dispatch({ type: 'ScaleChanged', isLogScale: control.value === 'LOG' })
  })

  onCheckboxChange(elements.controls.showCombined, (checked) => {
    dispatch({ type: 'ShowAlternativeTvlChanged', showAlternativeTvl: checked })
  })

  onCheckboxChange(elements.controls.showActivity, (checked) => {
    dispatch({ type: 'ViewChanged', view: checked ? 'activity' : 'tvl' })
  })

  onCheckboxChange(elements.controls.showEthereum, (checked) => {
    dispatch({ type: 'ShowEthereumChanged', showEthereum: checked })
  })
}
