import React, { useEffect } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { testConfigureTooltipsAndShow } from '../../scripts/configureTooltips'
import { Tooltip as TooltipComponent } from '../Tooltip'
import { RosetteTooltipPopup, RosetteTooltipProps } from './TooltipPopup'

export default {
  title: 'Components/Tooltip',
  parameters: {
    screenshot: {
      delay: 200,
    },
  },
}

export function RosetteTooltip() {
  useEffect(() => {
    testConfigureTooltipsAndShow()
  }, [])

  const project: RosetteTooltipProps = {
    riskSentiments: {
      proposerFailure: 'bad',
      upgradeability: 'bad',
      sequencerFailure: 'good',
      dataAvailability: 'warning',
      stateValidation: 'good',
    },
    riskValues: {
      stateValidation: {
        value: 'Fraud proofs',
        sentiment: 'good',
      },
      proposerFailure: {
        value: 'No mechanism',
        sentiment: 'bad',
      },
      upgradeability: {
        value: 'Yes',
        sentiment: 'bad',
      },
      sequencerFailure: {
        value: 'Transact using L1',
        sentiment: 'good',
      },
      dataAvailability: {
        value: 'Optimistic',
        sentiment: 'warning',
      },
    },
  }

  return (
    <div className="m-4 ml-32">
      <span
        className="Tooltip inline-block"
        title={renderToStaticMarkup(
          <RosetteTooltipPopup
            riskSentiments={project.riskSentiments}
            riskValues={project.riskValues}
          />,
        )}
        data-tooltip-big
      >
        <span>Element with tooltip</span>
      </span>
      <TooltipComponent />
    </div>
  )
}
