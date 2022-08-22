import '../styles/meta-image.scss'

import { Story } from '@storybook/react'
import React from 'react'

import { MetaImage as MetaImageComponent } from '../pages/MetaImages/MetaImage'

export default {
  title: 'Components/MetaImage',
  component: MetaImageComponent,
}

const Template = () => (
  <MetaImageComponent
    tvl="$1.34 B"
    sevenDayChange="+3.45%"
    name="Arbitrum Nova"
    icon="/icons/nova.png"
    apiEndpoint=""
    metadata={{ description: '', image: '', title: '', url: '' }}
  />
)
export const MetaImage: Story = Template.bind({})
MetaImage.parameters = {
  controls: { hideNoControlsWarning: true },
  layout: 'fullscreen',
}
