import { ProjectRiskViewEntry } from '@l2beat/config'
import React, { useEffect } from 'react'

import { PageContent } from '../../../components/PageContent'
import { Tooltip } from '../../../components/Tooltip'
import { configureFilters } from '../../../scripts/configureFilters'
import { configureTooltips } from '../../../scripts/configureTooltips'
import { ScalingRiskView } from './ScalingRiskView'

export default {
  title: 'Pages/Scaling/RiskView',
}

export function RiskView() {
  useEffect(() => {
    configureTooltips()
    configureFilters()
  }, [])
  return (
    <>
      <PageContent>
        <ScalingRiskView
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
              isVerified: false,
            },
            {
              name: 'Arbitrage',
              slug: 'arbitrum',
              stateValidation: risk('long'),
              dataAvailability: risk('medium'),
              upgradeability: risk('short', 'bad'),
              sequencerFailure: risk('short'),
              validatorFailure: risk('long', 'warning'),
              isVerified: true,
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
              isVerified: false,
            },
            {
              name: 'zk.download',
              provider: 'zkSync',
              slug: 'zksync-lite',
              stateValidation: risk('medium', 'bad'),
              dataAvailability: risk('medium'),
              upgradeability: risk('long'),
              sequencerFailure: risk('long', 'warning'),
              validatorFailure: risk('short'),
              isVerified: true,
            },
            {
              name: 'zk.archived',
              provider: 'StarkEx',
              slug: 'layer2financezk',
              stateValidation: risk('medium', 'bad'),
              dataAvailability: risk('medium'),
              upgradeability: risk('long'),
              sequencerFailure: risk('long', 'warning'),
              validatorFailure: risk('short'),
              isArchived: true,
              isVerified: true,
            },
          ]}
        />
      </PageContent>
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
