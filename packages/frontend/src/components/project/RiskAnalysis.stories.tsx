import { Story } from '@storybook/react'
import React from 'react'

import { RiskValues } from '../../utils/risks/types'
import { RiskAnalysis as RiskAnalysisComponent } from './RiskAnalysis'

export default {
  title: 'Components/Project/RiskAnalysisSection',
}

function Template(riskValues: RiskValues) {
  return (
    <div className="p-4">
      <RiskAnalysisComponent
        id="risk-analysis"
        title="Risk analysis"
        riskValues={riskValues}
      />
    </div>
  )
}

export const Configured: Story<RiskValues> = Template.bind({})
Configured.args = {
  stateValidation: {
    value: 'State validation risk',
    sentiment: 'bad',
    description: 'The state validation risk is bad',
  },
  dataAvailability: {
    value: 'Data availability risk',
    sentiment: 'warning',
    description: 'The data availability risk is warning',
  },
  upgradeability: {
    value: 'Upgradeability risk',
    sentiment: 'good',
    description: 'The upgradeability risk is good',
  },
  sequencerFailure: {
    value: 'Sequencer failure risk',
    sentiment: 'neutral',
    description: 'The sequencer failure risk is neutral',
  },
  proposerFailure: {
    value: 'Under review',
    sentiment: 'UnderReview',
    description: 'The proposer failure risk is under review',
  },
}

export const UnderReview: Story<RiskValues> = Template.bind({})
UnderReview.args = {
  stateValidation: {
    value: 'State validation risk',
    sentiment: 'UnderReview',
    description: 'The state validation risk is bad',
  },
  dataAvailability: {
    value: 'Data availability risk',
    sentiment: 'UnderReview',
    description: 'The data availability risk is warning',
  },
  upgradeability: {
    value: 'Upgradeability risk',
    sentiment: 'UnderReview',
    description: 'The upgradeability risk is good',
  },
  sequencerFailure: {
    value: 'Sequencer failure risk',
    sentiment: 'UnderReview',
    description: 'The sequencer failure risk is neutral',
  },
  proposerFailure: {
    value: 'Proposer failure risk',
    sentiment: 'UnderReview',
    description: 'The proposer failure risk is under review',
  },
}
