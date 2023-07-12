import { Story } from '@storybook/react'
import React from 'react'

import { Badge, BadgeProps } from './Badge'

export default {
  title: 'Components/Badge',
}

function Template(props: BadgeProps) {
  return (
    <Badge {...props} className="m-4">
      Badge
    </Badge>
  )
}
export const Error: Story<BadgeProps> = Template.bind({})
Error.args = {
  type: 'error',
}

export const Warning: Story<BadgeProps> = Template.bind({})
Warning.args = {
  type: 'warning',
}

export const BrightYellow: Story<BadgeProps> = Template.bind({})
BrightYellow.args = {
  type: 'brightYellow',
}

export const Purple: Story<BadgeProps> = Template.bind({})
Purple.args = {
  type: 'purple',
}

export const Gray: Story<BadgeProps> = Template.bind({})
Gray.args = {
  type: 'gray',
}
