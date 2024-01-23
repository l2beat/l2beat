import { Meta, StoryObj } from '@storybook/react'

import { RiskAnalysis as RiskAnalysisComponent } from './RiskAnalysis'

const meta: Meta<typeof RiskAnalysisComponent> = {
  component: RiskAnalysisComponent,
  a,
  args: {
    id: 'risk-analysis',
    title: 'Risk analysis',
    sectionOrder: 1,
  },
}
export default meta
type Story = StoryObj<typeof RiskAnalysisComponent>

export const Configured: Story = {
  args: {
    riskValues: {
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
      exitWindow: {
        value: 'Exit window risk',
        sentiment: 'good',
        description: 'The exit window risk is good',
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
    },
  },
}

export const UnderReview: Story = {
  args: {
    riskValues: {
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
      exitWindow: {
        value: 'Exit window risk',
        sentiment: 'UnderReview',
        description: 'The exit window risk is good',
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
    },
  },
}
