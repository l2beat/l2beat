import { Layer2Maturity } from '@l2beat/config'
import React, { useEffect } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { configureTooltips } from '../../scripts/configureTooltips'
import { hoverOver } from '../../utils/storybook/hoverOver'
import { Tooltip as TooltipComponent } from '../Tooltip'
import { MaturityTooltipPopup } from './TooltipPopup'

export default {
  title: 'Components/Tooltip',
}

export function MaturityTooltip() {
  useEffect(() => {
    configureTooltips()
    hoverOver('.Tooltip')
  }, [])

  const item: Layer2Maturity = {
    category: {
      score: 'B',
      requirements: ['There is an existing fraud proof system'],
    },
    modifier: {
      score: '-',
      items: ['Validators are behind a whitelist'],
    },
    thingsToImprove: {
      improvedScore: 'A',
      requirements: ['There should be no instant upgradeability'],
    },
  }

  return (
    <div className="m-4 ml-32">
      <span
        className="Tooltip inline-block"
        title={renderToStaticMarkup(<MaturityTooltipPopup item={item} />)}
        data-tooltip-big
      >
        <span>Element with tooltip</span>
      </span>
      <TooltipComponent />
    </div>
  )
}
