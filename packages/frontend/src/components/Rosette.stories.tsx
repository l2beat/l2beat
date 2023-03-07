import { Story } from '@storybook/react'
import React from 'react'

import {
  BigRosette as BigRosetteComponent,
  RosetteProps,
  SmallRosette as SmallRosetteComponent,
} from './Rosette'

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

type TemplateProps = RosetteProps['risks']

function SmallTemplate(risks: TemplateProps) {
  return <SmallRosetteComponent risks={risks} />
}

export const SmallRosette: Story<TemplateProps> = SmallTemplate.bind({})
SmallRosette.args = {
  sequencerFailure: 'bad',
  stateValidation: 'warning',
  dataAvailability: 'fine',
  upgradeability: 'bad',
  validatorFailure: 'warning',
}

function BigTemplate(risks: TemplateProps) {
  return <BigRosetteComponent risks={risks} />
}

export const BigRosette: Story<TemplateProps> = BigTemplate.bind({})
BigRosette.args = {
  sequencerFailure: 'bad',
  stateValidation: 'warning',
  dataAvailability: 'fine',
  upgradeability: 'bad',
  validatorFailure: 'warning',
}
