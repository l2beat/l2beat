import { StageConfig } from '@l2beat/config'
import React, { useEffect } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { configureTooltips } from '../../scripts/configureTooltips'
import { hoverOver } from '../../utils/storybook/hoverOver'
import { Tooltip as TooltipComponent } from '../Tooltip'
import { StageTooltip as StageTooltipComponent } from './StageTooltip'

export default {
  title: 'Components/Stages',
}

export function Tooltip() {
  useEffect(() => {
    configureTooltips()
    hoverOver('.Tooltip')
  }, [])

  const item: StageConfig = {
    stage: 'Stage 1',
    missing: {
      nextStage: 'Stage 2',
      requirements: ['A requirement'],
    },
    summary: [],
  }

  return (
    <div className="m-4 ml-32">
      <span
        className="Tooltip inline-block"
        title={renderToStaticMarkup(<StageTooltipComponent item={item} />)}
        data-tooltip-big
      >
        <span>Element with tooltip</span>
      </span>
      <TooltipComponent />
    </div>
  )
}
