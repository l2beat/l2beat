import { ProjectRiskViewEntry } from '@l2beat/config'
import React, { useEffect } from 'react'

import { Page } from '../../../components/Page'
import { Tooltip } from '../../../components/Tooltip'
import { RiskView as RiskViewComponent } from '../../../pages/home/view/RiskView/RiskView'
import { configureTooltips } from '../../../scripts/configureTooltips'

export default {
  title: 'Pages/Home/RiskView',
}

export function RiskView() {
  useEffect(() => {
    configureTooltips()
  }, [])
  return (
    <>
      <Page>
        <RiskViewComponent
          className="!block"
          items={[
            {
              name: 'Forktimism',
              provider: 'Optimism',
              slug: 'optimism',
              stateValidation: risk('short', 'warning'),
              dataAvailability: risk('medium', 'warning'),
              upgradeability: risk('medium', 'bad'),
              sequencerFailure: risk('long'),
              validatorFailure: risk('short', 'bad'),
            },
            {
              name: 'Arbitrage',
              slug: 'arbitrum',
              stateValidation: risk('long'),
              dataAvailability: risk('medium'),
              upgradeability: risk('short', 'bad'),
              sequencerFailure: risk('short'),
              validatorFailure: risk('long', 'warning'),
            },
            {
              name: 'StorkCommerce',
              provider: 'StarkEx',
              slug: 'starknet',
              stateValidation: risk('short'),
              dataAvailability: risk('medium'),
              upgradeability: risk('long'),
              sequencerFailure: risk('medium', 'bad'),
              validatorFailure: risk('long', 'warning'),
            },
            {
              name: 'zk.download',
              slug: 'zksync',
              stateValidation: risk('medium', 'bad'),
              dataAvailability: risk('medium'),
              upgradeability: risk('long'),
              sequencerFailure: risk('long', 'warning'),
              validatorFailure: risk('short'),
            },
          ]}
        />
      </Page>
      <Tooltip />
    </>
  )
}

function risk(
  length: 'short' | 'medium' | 'long',
  sentiment?: 'warning' | 'bad',
): ProjectRiskViewEntry {
  return {
    value:
      length === 'short'
        ? 'Some value'
        : length === 'medium'
        ? 'Medium text entry'
        : 'Quite a longer value',
    description: 'Some longer description of the thing',
    sentiment,
  }
}
