import { Story } from '@storybook/react'
import React from 'react'

import { ArchivedBar, ArchivedBarProps } from './ArchivedBar'

export default {
  title: 'Components/Project/ArchivedBar',
}

function Template(props: ArchivedBarProps) {
  return (
    <div className="p-4">
      <ArchivedBar {...props} />
    </div>
  )
}

export const BaseText: Story<ArchivedBarProps> = Template.bind({})
BaseText.args = {
  text: 'This project is archived and no longer maintained.',
}
