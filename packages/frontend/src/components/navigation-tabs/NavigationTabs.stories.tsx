import { Story } from '@storybook/react'
import React from 'react'

import { BridgesNavigationTabs } from './BridgesNavigationTabs'
import { ScalingNavigationTabs } from './ScalingNavigationTabs'

export default {
  title: 'Components/NavigationTabs',
}

interface BridgesTemplateProps {
  selected: 'summary' | 'risk'
}
function BridgesTemplate({ selected }: BridgesTemplateProps) {
  return (
    <div className="px-4">
      <BridgesNavigationTabs selected={selected} />
    </div>
  )
}

export const Bridges: Story<BridgesTemplateProps> = BridgesTemplate.bind({})
Bridges.argTypes = {
  selected: {
    control: 'radio',
    options: ['summary', 'risk'],
  },
}
Bridges.args = {
  selected: 'summary',
}

interface ScalingTemplateProps {
  selected: 'summary' | 'risk' | 'activity'
}
function ScalingTemplate({ selected }: ScalingTemplateProps) {
  return (
    <div className="px-4">
      <ScalingNavigationTabs showActivity selected={selected} />
    </div>
  )
}

export const Scaling: Story<ScalingTemplateProps> = ScalingTemplate.bind({})
Scaling.argTypes = {
  selected: {
    control: 'radio',
    options: ['summary', 'risk', 'activity'],
  },
}
Scaling.args = {
  selected: 'summary',
}
