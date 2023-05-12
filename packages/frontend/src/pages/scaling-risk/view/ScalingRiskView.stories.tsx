import { ProjectRiskViewEntry } from '@l2beat/config'
import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../../../components/PageContent'
import { Tooltip } from '../../../components/Tooltip'
import { configureTabs } from '../../../scripts/configureTabs'
import { configureTooltips } from '../../../scripts/configureTooltips'
import { click } from '../../../utils/storybook/click'
import { ScalingRiskView } from './ScalingRiskView'

const meta = {
  title: 'Pages/Scaling/RiskView',
  component: ScalingRiskView,
  args: {
    items: [
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
    ],
  },
  decorators: [
    (Story) => (
      <>
        <PageContent>
          <Story />
        </PageContent>
        <Tooltip />
      </>
    ),
  ],
} satisfies Meta<typeof ScalingRiskView>
export default meta

type Story = StoryObj<typeof ScalingRiskView>

export const Active: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#active')
      }, [])
      return <Story />
    },
  ],
}

export const Archived: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#archived')
      }, [])
      return <Story />
    },
  ],
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
