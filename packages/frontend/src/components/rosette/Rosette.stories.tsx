import { Story } from '@storybook/react'
import React from 'react'

import {
  BigRosette as BigRosetteComponent,
  RisksSummary,
  SmallRosette as SmallRosetteComponent,
} from '.'

export default {
  title: 'Components/Rosette',
  argTypes: {
    sequencerFailure: {
      options: ['bad', 'warning', 'fine'],
      control: { type: 'select' },
    },
    stateValidation: {
      options: ['bad', 'warning', 'fine'],
      control: { type: 'select' },
    },
    dataAvailability: {
      options: ['bad', 'warning', 'fine'],
      control: { type: 'select' },
    },
    upgradeability: {
      options: ['bad', 'warning', 'fine'],
      control: { type: 'select' },
    },
    validatorFailure: {
      options: ['bad', 'warning', 'fine'],
      control: { type: 'select' },
    },
  },
}

function SmallTemplate(risks: RisksSummary) {
  return <SmallRosetteComponent risks={risks} />
}

export const SmallRosette: Story<RisksSummary> = SmallTemplate.bind({})
SmallRosette.args = {
  sequencerFailure: 'bad',
  stateValidation: 'warning',
  dataAvailability: 'fine',
  upgradeability: 'bad',
  validatorFailure: 'warning',
}

function BigTemplate(risks: RisksSummary) {
  return <BigRosetteComponent risks={risks} />
}

export const BigRosette: Story<RisksSummary> = BigTemplate.bind({})
BigRosette.args = {
  sequencerFailure: 'bad',
  stateValidation: 'warning',
  dataAvailability: 'fine',
  upgradeability: 'bad',
  validatorFailure: 'warning',
}
