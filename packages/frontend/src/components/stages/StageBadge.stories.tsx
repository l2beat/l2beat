import { Story } from '@storybook/react'
import React from 'react'

import { StageBadge, StageBadgeProps } from './StageBadge'

export default {
  title: 'Components/Stages',
}

function Template(props: StageBadgeProps) {
  return (
    <div className="m-4 ml-32">
      <StageBadge stage={props.stage} big={props.big} />
    </div>
  )
}

export const Badge: Story<StageBadgeProps> = Template.bind({})
Badge.argTypes = {
  stage: {
    control: 'radio',
    options: ['Stage 0', 'Stage 1', 'Stage 2', undefined],
  },
  big: {
    control: 'radio',
    options: [true, false],
  },
  oneSize: {
    control: 'radio',
    options: [true, false],
  },
}
Badge.args = {
  stage: 'Stage 0',
  big: false,
}
