import React, { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { configureTooltips } from '../../scripts/configureTooltips'
import { Tooltip as TooltipComponent } from '../Tooltip'
import { RosetteTooltipPopup, RosetteTooltipProps } from './TooltipPopup'

export default {
  title: 'Components/Tooltip',
}

export function RosetteTooltip() {
  const tooltipRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    configureTooltips()
    // show tooltip
    tooltipRef.current?.dispatchEvent(new MouseEvent('mouseenter'))
    // remove all event listeners, leaving them will cause reg-viz to remove tooltip
    document.body.replaceWith(document.body.cloneNode(true))
    tooltipRef.current?.replaceWith(tooltipRef.current.cloneNode(true))
  }, [])

  const project: RosetteTooltipProps = {
    riskSentiments: {
      validatorFailure: 'bad',
      upgradeability: 'bad',
      sequencerFailure: undefined,
      dataAvailability: 'warning',
      stateValidation: undefined,
    },
    riskValues: {
      stateValidation: {
        value: 'Fraud proofs',
        sentiment: undefined,
      },
      validatorFailure: {
        value: 'No mechanism',
        sentiment: 'bad',
      },
      upgradeability: {
        value: 'Yes',
        sentiment: 'bad',
      },
      sequencerFailure: {
        value: 'Transact using L1',
        sentiment: undefined,
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
        ref={tooltipRef}
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
