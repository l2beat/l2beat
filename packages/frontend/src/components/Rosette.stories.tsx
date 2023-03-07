import { Story } from '@storybook/react'
import React from 'react'

import { RosetteProps, SmallRosette } from './Rosette'

export default {
  title: 'Components/Rosette',
}

type TemplateProps = RosetteProps['risks']

function Template(risks: TemplateProps) {
  return <SmallRosette risks={risks} />
}

export const Rosette: Story<TemplateProps> = Template.bind({})
Rosette.args = {
  sequencerFailure: 'bad',
  stateValidation: 'warning',
  dataAvailability: 'fine',
  upgradeability: 'bad',
  validatorFailure: 'warning',
}
