import { Story } from '@storybook/react'
import React from 'react'

import { Badge, BadgeProps, BadgeSize, BadgeType } from './Badge'

export default {
  title: 'Components/Badge',
  argTypes: {
    type: {
      options: Object.values(BadgeType),
      control: { type: 'select' },
    },
    size: {
      options: Object.values(BadgeSize),
      control: { type: 'select' },
    },
  },
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
  type: BadgeType.ERROR,
  size: BadgeSize.MD,
}

export const Warning: Story<BadgeProps> = Template.bind({})
Warning.args = {
  type: BadgeType.WARNING,
  size: BadgeSize.MD,
}

export const BrightYellow: Story<BadgeProps> = Template.bind({})
BrightYellow.args = {
  type: BadgeType.BRIGHT_YELLOW,
  size: BadgeSize.MD,
}

export const Purple: Story<BadgeProps> = Template.bind({})
Purple.args = {
  type: BadgeType.PURPLE,
  size: BadgeSize.MD,
}

export const Gray: Story<BadgeProps> = Template.bind({})
Gray.args = {
  type: BadgeType.GRAY,
  size: BadgeSize.MD,
}

export const Small: Story<BadgeProps> = Template.bind({})
Small.args = {
  type: BadgeType.BRIGHT_YELLOW,
  size: BadgeSize.SM,
}
