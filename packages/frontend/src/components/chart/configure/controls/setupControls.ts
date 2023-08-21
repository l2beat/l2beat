import { AssetType } from '@l2beat/shared-pure'

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

  elements.controls.tokenChosen.forEach((e) =>
    onCheckboxChange(e, () => {
      dispatch({ type: 'CurrencyChanged', currency: 'usd' })
    }),
  )

  onRadioChange(elements.controls.tokens, (control) => {
    let assetType: AssetType = 'CBV'
    switch (control.dataset.assetType) {
      case 'EBV':
        assetType = 'EBV'
        break
      case 'NMV':
        assetType = 'NMV'
        break
    }

    if (control.dataset.tvlEndpoint && control.dataset.assetType) {
      control.dispatchEvent(new Event('close-slidecard', { bubbles: true }))
      dispatch({
        type: 'TokenChanged',
        token: control.value,
        tokenEndpoint: control.dataset.tvlEndpoint,
        assetType,
      })
    }
  })

  elements.controls.showMoreTokensToBeRemoved?.addEventListener('click', () => {
    dispatch({ type: 'MoreTokensClicked' })
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
      view,
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
