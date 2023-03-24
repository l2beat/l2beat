import { Story } from '@storybook/react'
import React from 'react'

import { RiskSentiments, RiskValues } from '../../utils/risks/types'
import {
  BigRosette as BigRosetteComponent,
  MediumRosette as MediumRosetteComponent,
  SmallRosette as SmallRosetteComponent,
} from './Rosette'

export default {
  title: 'Components/Rosette',
  argTypes: {
    sequencerFailure: {
      options: ['bad', 'warning', undefined],
      control: { type: 'select' },
    },
    stateValidation: {
      options: ['bad', 'warning', undefined],
      control: { type: 'select' },
    },
    dataAvailability: {
      options: ['bad', 'warning', undefined],
      control: { type: 'select' },
    },
    upgradeability: {
      options: ['bad', 'warning', undefined],
      control: { type: 'select' },
    },
    validatorFailure: {
      options: ['bad', 'warning', undefined],
      control: { type: 'select' },
    },
  },
}

const args: RiskSentiments = {
  sequencerFailure: 'bad',
  stateValidation: 'warning',
  dataAvailability: undefined,
  upgradeability: 'bad',
  validatorFailure: 'warning',
}

function SmallTemplate(risks: RiskSentiments) {
  return (
    <div className="p-4">
      <SmallRosetteComponent risks={risks} />
    </div>
  )
}

export const SmallRosette: Story<RiskSentiments> = SmallTemplate.bind({})
SmallRosette.args = args

function MediumTemplate(risks: RiskSentiments) {
  return (
    <div className="p-4">
      <MediumRosetteComponent risks={risks} />
    </div>
  )
}

export const MediumRosette: Story<RiskSentiments> = MediumTemplate.bind({})
MediumRosette.args = args

function BigTemplate(risks: RiskSentiments) {
  const riskValues: RiskValues = {
    sequencerFailure: {
      sentiment: risks.sequencerFailure,
      value: 'Sequencer failure',
      description: 'If the sequencer fails, the network will halt.',
    },
    dataAvailability: {
      sentiment: risks.dataAvailability,
      value: 'Data availability',
      description: 'If the sequencer fails, the network will halt.',
    },
    upgradeability: {
      sentiment: risks.upgradeability,
      value: 'Upgradeability',
      description: 'If the sequencer fails, the network will halt.',
    },
    stateValidation: {
      sentiment: risks.stateValidation,
      value: 'State validation',
      description: 'If the sequencer fails, the network will halt.',
    },
    validatorFailure: {
      sentiment: risks.validatorFailure,
      value: 'Validator failure',
      description: 'If the sequencer fails, the network will halt.',
    },
  }

  return (
    <div className="p-4">
      <BigRosetteComponent risks={riskValues} />
    </div>
  )
}

export const BigRosette: Story<RiskSentiments> = BigTemplate.bind({})
BigRosette.args = args

function UpcomingTemplate(risks: RiskValues) {
  return (
    <div className="p-4">
      <BigRosetteComponent risks={risks} isUpcoming={true} />
    </div>
  )
}

export const UpcomingRosette: Story<RiskValues> = UpcomingTemplate.bind({})
UpcomingRosette.args = {
  sequencerFailure: {
    value: 'Sequencer failure',
  },
  dataAvailability: {
    value: 'Data availability',
  },
  upgradeability: {
    value: 'Upgradeability',
  },
  stateValidation: {
    value: 'State validation',
  },
  validatorFailure: {
    value: 'Validator failure',
  },
}
