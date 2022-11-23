import { Story } from '@storybook/react'
import React from 'react'

import { Milestones, MilestonesProps } from './Milestones'

export default {
  title: 'Components/Project/Milestones',
}

function Template(props: MilestonesProps) {
  return (
    <div className="p-4">
      <Milestones {...props} />
    </div>
  )
}

export const Milestone: Story<MilestonesProps> = Template.bind({})
Milestone.args = {
  milestones: [
    {
      name: 'Milestone One',
      link: 'https://l2beat.com',
      date: new Date('2022-11-23'),
      description: 'some very important description',
    },
    {
      name: 'Milestone Two',
      link: 'https://l2beat.com',
      date: new Date('2022-12-23'),
    },
  ],
}
