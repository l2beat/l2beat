import { Story } from '@storybook/react'
import React from 'react'

import {
  WarningBar as WarningBarComponent,
  WarningBarProps,
} from './WarningBar'

export default {
  title: 'Components/Project/WarningBar',
}

const text = 'This is an example text for the warning.'

function Template(props: WarningBarProps) {
  return (
    <div className="p-4">
      <WarningBarComponent {...props} />
    </div>
  )
}

export const Yellow: Story<WarningBarProps> = Template.bind({})
Yellow.args = {
  color: 'yellow',
  isCritical: false,
  text,
}

export const Red: Story<WarningBarProps> = Template.bind({})
Red.args = {
  color: 'red',
  isCritical: false,
  text,
}

export const Critical: Story<WarningBarProps> = Template.bind({})
Critical.args = {
  color: 'red',
  isCritical: true,
  text,
}

export const YellowWithLink: Story<WarningBarProps> = Template.bind({})
YellowWithLink.args = {
  color: 'yellow',
  isCritical: false,
  text,
  href: 'https://example.com',
}
