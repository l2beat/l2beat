import { Story } from '@storybook/react'
import React from 'react'

import {
  BigRosette as BigRosetteComponent,
  MediumRosette as MediumRosetteComponent,
  SmallRosette as SmallRosetteComponent,
} from './Rosette'
import { RiskSentiments } from './types'

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
  return <SmallRosetteComponent risks={risks} />
}

export const SmallRosette: Story<RiskSentiments> = SmallTemplate.bind({})
SmallRosette.args = args

function MediumTemplate(risks: RiskSentiments) {
  return <MediumRosetteComponent risks={risks} />
}

export const MediumRosette: Story<RiskSentiments> = MediumTemplate.bind({})
MediumRosette.args = args

function BigTemplate(risks: RiskSentiments) {
  return <BigRosetteComponent risks={risks} />
}

export const BigRosette: Story<RiskSentiments> = BigTemplate.bind({})
BigRosette.args = args
